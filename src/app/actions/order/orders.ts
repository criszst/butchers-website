"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

interface OrderItem {
  productId: number
  name: string
  quantity: number
  price: number
  category: string
}

// Updated CustomerData interface to match new Address schema fields
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
  observacoes?: string
}

interface CreateOrderData {
  items: OrderItem[]
  total: number
  paymentMethod: string
  paymentType: string
  customerData: CustomerData
  deliveryFee: number
  discount?: number
}

export async function createOrder(orderData: CreateOrderData) {
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

    
    const productIds = orderData.items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    for (const item of orderData.items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product || !product.available || product.stock < item.quantity) {
        return {
          success: false,
          message: `Produto ${item.name} não está disponível na quantidade solicitada`,
        }
      }
    }

    // Criar o pedido
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: orderData.total,
        status: "Preparando",
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

    // Atualizar estoque dos produtos
    for (const item of orderData.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    
    const existingAddress = await prisma.address.findFirst({
      where: {
        userId: user.id,
        street: orderData.customerData.street,
        number: orderData.customerData.number,
        complement: orderData.customerData.complement,
        neighborhood: orderData.customerData.neighborhood,
        city: orderData.customerData.city,
        state: orderData.customerData.state,
        country: orderData.customerData.country,
        cep: orderData.customerData.cep,
      },
    })

    if (!existingAddress) {
      await prisma.address.create({
        data: {
          userId: user.id,
          name: "Endereço não disponivel",
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
    }

    // Limpar carrinho do usuário
    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    })

    revalidatePath("/")
    revalidatePath("/orders")

    return {
      success: true,
      message: "Pedido criado com sucesso",
      orderId: order.id,
      orderNumber: order.id.slice(-8).toUpperCase(),
    }
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      success: true,
      orders,
    }
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return {
      success: false,
      orders: [],
    }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    revalidatePath("/admin")
    return {
      success: true,
      message: "Status do pedido atualizado com sucesso",
    }
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}
