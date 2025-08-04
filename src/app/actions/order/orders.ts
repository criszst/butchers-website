"use server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

import crypto from "crypto"
import generateOrderNumber from "@/app/utils/db/generateOrderNumber"

import { PaymentStatus } from "@/generated/prisma"

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
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: orderData.total,
        status: "Preparando",

        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.PaymentStatus,
        orderNumber: readableOrderNumber,

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
    revalidatePath("/perfil#orders")

    const orderNumber = order.id.toString().padStart(8, "0").toUpperCase()
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
            Address: {
              select: {
                street: true,
                number: true,
                neighborhood: true,
                city: true,
                state: true,
                cep: true,
              },
            },
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
        id: `#${order.orderNumber}`,
        orderNumber: order.orderNumber,
        customer: {
          name: order.user.name || "Cliente",
          email: order.user.email || "",
          phone: order.user.phone || "",
          address: order.user.Address
        },
        items: order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          category: item.category || "Outros",
        })),
        total: order.total,
        status: order.status,

         paymentMethod: order.paymentMethod,
         paymentStatus: order.paymentStatus,

        createdAt: order.createdAt.toLocaleString("pt-BR"),
        estimatedDelivery: order.estimatedDelivery,

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

    revalidatePath("/admin#orders")
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
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, orders }
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error)
    return { success: false, orders: [] }
  }
}