"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import generateOrderNumber from "@/app/utils/db/generateOrderNumber"
import type { PaymentStatus } from "@/generated/prisma"

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

export async function createOrder(orderData: CreateOrderData) {
  try {
    console.log("=== INÍCIO CREATE ORDER ===")
    console.log("Dados recebidos:", JSON.stringify(orderData, null, 2))

    const session = await getServerSession()
    console.log("Sessão:", session?.user?.email)

    if (!session?.user?.email) {
      console.log("❌ Usuário não autenticado")
      return { success: false, message: "Usuário não autenticado" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    console.log("Usuário encontrado:", user?.id)

    if (!user) {
      console.log("❌ Usuário não encontrado no banco")
      return { success: false, message: "Usuário não encontrado" }
    }

    // Validar se há itens no pedido
    if (!orderData.items || orderData.items.length === 0) {
      console.log("❌ Nenhum item no pedido")
      return { success: false, message: "Nenhum item no pedido" }
    }

    // Buscar produtos e validar disponibilidade
    const productIds = orderData.items.map((item) => item.productId)
    console.log("IDs dos produtos:", productIds)

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })
    console.log("Produtos encontrados:", products.length)

    for (const item of orderData.items) {
      const product = products.find((p) => p.id === item.productId)
      console.log(`Validando produto ${item.productId}:`, {
        encontrado: !!product,
        disponivel: product?.available,
        estoque: product?.stock,
        quantidadeSolicitada: item.quantity,
      })

      if (!product) {
        console.log(`❌ Produto ${item.productId} não encontrado`)
        return {
          success: false,
          message: `Produto ${item.name} não encontrado`,
        }
      }

      if (!product.available) {
        console.log(`❌ Produto ${item.productId} não disponível`)
        return {
          success: false,
          message: `Produto ${item.name} não está disponível`,
        }
      }

      if (product.stock < item.quantity) {
        console.log(`❌ Estoque insuficiente para produto ${item.productId}`)
        return {
          success: false,
          message: `Produto ${item.name} não tem estoque suficiente. Disponível: ${product.stock}`,
        }
      }
    }

    console.log("✅ Todos os produtos validados")

    const readableOrderNumber = generateOrderNumber(user.name || "XX")
    console.log("Criando pedido...")

    // Criar endereço de entrega formatado
    const deliveryAddress = `${orderData.customerData.street}, ${orderData.customerData.number}${
      orderData.customerData.complement ? `, ${orderData.customerData.complement}` : ""
    }, ${orderData.customerData.neighborhood}, ${orderData.customerData.city} - ${orderData.customerData.state}, ${orderData.customerData.cep}`

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: orderData.total,
        status: "Preparando",
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.PaymentStatus || "Pendente",
        orderNumber: readableOrderNumber,
        deliveryAddress: deliveryAddress,
        items: {
          create: orderData.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    console.log("✅ Pedido criado com ID:", order.id)

    console.log("Atualizando estoque...")
    for (const item of orderData.items) {
      await prisma.product.update({
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
    const existingAddress = await prisma.address.findFirst({
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
      await prisma.address.create({
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
    const deletedItems = await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    })
    console.log(`✅ ${deletedItems.count} itens removidos do carrinho`)

    revalidatePath("/")
    revalidatePath("/profile")

    const orderNumber = order.orderNumber || order.id.toString().padStart(8, "0").toUpperCase()
    console.log("✅ Pedido finalizado com sucesso:", orderNumber)
    console.log("=== FIM CREATE ORDER ===")

    return {
      success: true,
      message: "Pedido criado com sucesso",
      orderId: order.id,
      orderNumber,
    }
  } catch (error: any) {
    console.error("❌ ERRO COMPLETO:", error)
    console.error("Stack trace:", error.stack)
    return {
      success: false,
      message: `Erro interno do servidor: ${error.message}`,
    }
  }
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
          quantity: item.quantity,
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

    const order = await prisma.order.findUnique({
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
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "Cancelado",
        updatedAt: new Date(),
      },
    })

    // Restaurar estoque dos produtos
    for (const item of order.items) {
      // Aqui você precisaria buscar o produto pelo nome ou ter uma referência ao productId
      // Como o schema atual não tem productId no OrderItem, vamos pular esta parte
      console.log(`Deveria restaurar estoque para: ${item.name} - Qtd: ${item.quantity}`)
    }

    revalidatePath("/profile")
    revalidatePath("/admin")

    return { success: true, message: "Pedido cancelado com sucesso" }
  } catch (error) {
    console.error("Erro ao cancelar pedido:", error)
    return { success: false, message: "Erro interno do servidor" }
  }
}
