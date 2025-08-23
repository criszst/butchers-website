"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import generateOrderNumber from "@/app/utils/db/generateOrderNumber"
import type { Order, PaymentStatus } from "@/generated/prisma"
import { toast } from "sonner"

interface OrderItem {
  productId: number
  name: string
  quantity: number
  price: number
  category: string
}

interface CustomerData {
  nome: string
  email?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  country: string
  cep: string
}

interface CreateOrderData {
  paymentType: any
  items: OrderItem[]
  total: number
  paymentMethod: string
  PaymentStatus: PaymentStatus | undefined
  customerData: CustomerData
  deliveryFee: number
  discount?: number
}

// Sistema de fila para evitar pedidos simultâneos
const orderQueue = new Map<string, Promise<any>>()

// Tipos de erro específicos
export type OrderErrorType =
  | "product_validation_error"
  | "price_change_error"
  | "insufficient_stock"
  | "duplicate_order"
  | "server_error"

export interface OrderResult {
  success: boolean
  message: string
  orderId?: string
  orderNumber?: string
  errorType?: OrderErrorType
  errorDetails?: any
}

export async function createOrder(orderData: CreateOrderData): Promise<OrderResult> {
  try {
    console.log("=== INÍCIO CREATE ORDER ===")
    console.log("Dados recebidos:", JSON.stringify(orderData, null, 2))

    const session = await getServerSession()
    console.log("Sessão:", session?.user?.email)

    if (!session?.user?.email) {
      console.log("❌ Usuário não autenticado")
      return {
        success: false,
        message: "Usuário não autenticado",
        errorType: "server_error",
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    console.log("Usuário encontrado:", user?.id)

    if (!user) {
      console.log("❌ Usuário não encontrado no banco")
      return {
        success: false,
        message: "Usuário não encontrado",
        errorType: "server_error",
      }
    }

    // Sistema de fila - evita pedidos simultâneos do mesmo usuário
    const queueKey = `order_${user.id}`
    if (orderQueue.has(queueKey)) {
      console.log("❌ Pedido já em processamento para este usuário")
      return {
        success: false,
        message: "Já existe um pedido sendo processado. Aguarde um momento.",
        errorType: "duplicate_order",
      }
    }

    // Adicionar à fila
    const orderPromise = processOrder(orderData, user)
    orderQueue.set(queueKey, orderPromise)

    try {
      const result = await orderPromise
      return result
    } finally {
 
      orderQueue.delete(queueKey)
    }
  } catch (error: any) {
    console.error("❌ ERRO COMPLETO:", error)
    console.error("Stack trace:", error.stack)
    return {
      success: false,
      message: `Erro interno do servidor: ${error.message}`,
      errorType: "server_error",
    }
  }
}

async function processOrder(orderData: CreateOrderData, user: any): Promise<OrderResult> {
  if (!orderData.items || orderData.items.length === 0) {
    console.log("❌ Nenhum item no pedido")
    return {
      success: false,
      message: "Nenhum item no pedido",
      errorType: "product_validation_error",
    }
  }

  const productIds = orderData.items.map((item) => item.productId)
  console.log("IDs dos produtos:", productIds)

  return await prisma.$transaction(async (tx) => {

    // evitando race conditions
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    })
    console.log("Produtos encontrados:", products.length)

    const validationErrors: string[] = []
    const priceChanges: Array<{ product: string; oldPrice: number; newPrice: number }> = []

    for (const item of orderData.items) {
      const product = products.find((p) => p.id === item.productId)
      console.log(`Validando produto ${item.productId}:`, {
        encontrado: !!product,
        disponivel: product?.available,
        estoque: product?.stock,
        quantidadeSolicitada: item.quantity,
        precoAtual: product?.price,
        precoCarrinho: item.price,
      })

      if (!product) {
        validationErrors.push(`Produto ${item.name} não foi encontrado`)
        continue
      }

      if (!product.available) {
        validationErrors.push(`Produto ${item.name} não está mais disponível`)
        continue
      }

      if (product.stock < item.quantity) {
        validationErrors.push(
          `Produto ${item.name} tem apenas ${product.stock}kg disponível (solicitado: ${item.quantity}kg)`,
        )
        continue
      }

    
      const priceDifference = Math.abs(product.price - item.price) / item.price
      if (priceDifference > 0.05) {
        priceChanges.push({
          product: item.name,
          oldPrice: item.price,
          newPrice: product.price,
        })
      }
    }

    if (validationErrors.length > 0) {
      console.log("❌ Erros de validação:", validationErrors)
      return {
        success: false,
        message: validationErrors.join("; "),
        errorType: "product_validation_error",
        errorDetails: { validationErrors },
      }
    }

    if (priceChanges.length > 0) {
      console.log("❌ Mudanças de preço detectadas:", priceChanges)
      return {
        success: false,
        message: "Os preços de alguns produtos foram atualizados. Por favor, revise seu carrinho.",
        errorType: "price_change_error",
        errorDetails: { priceChanges },
      }
    }

    console.log("✅ Todos os produtos validados")

    const recalculatedTotal =
      orderData.items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId)!
        // Preço por kg * quantidade em kg
        return sum + product.price * item.quantity
      }, 0) +
      orderData.deliveryFee -
      (orderData.discount || 0)

    if (Math.abs(recalculatedTotal - orderData.total) > 5) {
      console.log("❌ Divergência no total do pedido")
      console.log("Total recalculado:", recalculatedTotal)
      console.log("Total recebido:", orderData.total)
      console.log("Diferença:", Math.abs(recalculatedTotal - orderData.total))

      return {
        success: false,
        message: "Houve uma divergência no valor total. Por favor, atualize seu carrinho.",
        errorType: "price_change_error",
        errorDetails: {
          expectedTotal: recalculatedTotal,
          receivedTotal: orderData.total,
          difference: Math.abs(recalculatedTotal - orderData.total),
        },
      }
    }

    const readableOrderNumber = generateOrderNumber(user.name || "XX")
    console.log("Criando pedido...")

    const deliveryAddress = `${orderData.customerData.street}, ${orderData.customerData.number}${
      orderData.customerData.complement ? `, ${orderData.customerData.complement}` : ""
    }, ${orderData.customerData.neighborhood}, ${orderData.customerData.city} - ${orderData.customerData.state}, ${orderData.customerData.cep}`

    const order = await tx.order.create({
      data: {
        userId: user.id,
        total: recalculatedTotal,
        status: "Preparando",
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.PaymentStatus || "Pendente",
        orderNumber: readableOrderNumber,
        deliveryAddress: deliveryAddress,
        deliveryFee: orderData.deliveryFee,
        items: {
          create: orderData.items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!
            return {
              name: item.name,
              quantity: item.quantity,
              price: product.price,
              category: item.category,
                 }
          }),
        },
      },
      include: {
        items: true,
      },
    })

    console.log("✅ Pedido criado com ID:", order.id)

    console.log("Atualizando estoque...")
    for (const item of orderData.items) {
      const product = products.find((p) => p.id === item.productId)!

      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para ${item.name}`)
      }

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
      console.log(`✅ Estoque atualizado para produto ${item.productId}`)
    }

    console.log("Verificando endereço...")
    const existingAddress = await tx.address.findFirst({
      where: {
        userId: user.id,
        street: orderData.customerData.street,
        number: orderData.customerData.number,
        neighborhood: orderData.customerData.neighborhood,
        city: orderData.customerData.city,
        state: orderData.customerData.state,
        cep: orderData.customerData.cep,
      },
    })

    if (!existingAddress) {
      console.log("Criando novo endereço...")
      await tx.address.create({
        data: {
          userId: user.id,
          name: orderData.customerData.nome || "Endereço de entrega",
          street: orderData.customerData.street,
          number: orderData.customerData.number,
          complement: orderData.customerData.complement,
          neighborhood: orderData.customerData.neighborhood,
          city: orderData.customerData.city,
          state: orderData.customerData.state,
          country: orderData.customerData.country,
          cep: orderData.customerData.cep,
          isDefault: false,
        },
      })
      console.log("✅ Novo endereço criado")
    }

    console.log("Limpando carrinho...")
    const deletedItems = await tx.cartItem.deleteMany({
      where: { userId: user.id },
    })
    console.log(`✅ ${deletedItems.count} itens removidos do carrinho`)

    const orderNumber = order.orderNumber || order.id.toString().padStart(8, "0").toUpperCase()
    console.log("✅ Pedido finalizado com sucesso:", orderNumber)
    console.log("=== FIM CREATE ORDER ===")

    revalidatePath("/")
    revalidatePath("/profile")

    return {
      success: true,
      message: "Pedido criado com sucesso",
      orderId: order.id,
      orderNumber,
    }
  })
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.user.name || "Cliente",
          email: order.user.email || "",
          phone: order.user.phone || "",
        },
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity, // Agora é Float
          price: item.price,
          category: item.category || "Outros",
        })),
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        deliveryAddress: order.deliveryAddress,
        date: order.date,
        createdAt: order.createdAt.toLocaleString("pt-BR"),
        estimatedDelivery: order.estimatedDelivery,
        deliveryDate: order.deliveryDate,
        trackingCode: order.trackingCode,
        deliveryFee: order.deliveryFee,
      })),
    }
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return {
      success: false,
      message: "Erro ao buscar pedidos",
      orders: [],
    }
  }
}

export async function updateOrderStatusByOrderNumber(orderId: string, newStatus: string) {
  try {
    console.log("Atualizando status do pedido:", orderId, "para", newStatus)

    // Validar transições de status válidas
    const validTransitions: { [key: string]: string[] } = {
      Preparando: ["Enviado", "Cancelado"],
      Enviado: ["Entregue", "Cancelado"],
      Entregue: [],
      Cancelado: [],
    }

    const currentOrder = await prisma.order.findUnique({
      where: { orderNumber: orderId },
      select: { status: true },
    })

    if (!currentOrder) {
      return {
        success: false,
        message: "Pedido não encontrado",
      }
    }

    const allowedStatuses = validTransitions[currentOrder.status] || []
    if (!allowedStatuses.includes(newStatus)) {
      return {
        success: false,
        message: `Não é possível alterar status de "${currentOrder.status}" para "${newStatus}"`,
      }
    }

    await prisma.order.update({
      where: { orderNumber: orderId },
      data: { status: newStatus },
    })

    revalidatePath("/admin")
    revalidatePath("/profile")

    return {
      success: true,
      message: "Status do pedido atualizado com sucesso",
    }
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    return {
      success: false,
      message: "Erro ao atualizar status do pedido",
    }
  }
}

export async function getUserOrders() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { success: false, orders: [] }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, orders: [] }
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            phone: true,
          },
        },
        
      },
      orderBy: { date: "desc" },
    })

    return { success: true, orders }
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error)
    return { success: false, orders: [] }
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { success: false, message: "Usuário não autenticado" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, message: "Usuário não encontrado" }
    }

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (!order) {
        return { success: false, message: "Pedido não encontrado" }
      }

      if (order.userId !== user.id && !user.isAdmin) {
        return { success: false, message: "Acesso negado" }
      }

      if (order.status === "Entregue" || order.status === "Cancelado") {
        return { success: false, message: "Este pedido não pode ser cancelado" }
      }

      // Atualizar status do pedido
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "Cancelado",
          updatedAt: new Date(),
        },
      })

      // Restaurar estoque dos produtos (se possível identificar os produtos)
      for (const item of order.items) {
        // Tentar encontrar o produto pelo nome (não é ideal, mas funciona)
        const product = await tx.product.findFirst({
          where: { name: item.name },
        })

        if (product) {
          await tx.product.update({
            where: { id: product.id },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          })
          console.log(`✅ Estoque restaurado para: ${item.name} - Qtd: ${item.quantity}`)
        }
      }

      revalidatePath("/profile")
      revalidatePath("/admin")

      toast.success("Pedido cancelado com sucesso!")

      return { success: true, message: "Pedido cancelado com sucesso" }
    })
  } catch (error) {
    console.error("Erro ao cancelar pedido:", error)
    return { success: false, message: "Erro interno do servidor" }
  }
}