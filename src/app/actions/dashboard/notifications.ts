"use server"

import prisma from "@/lib/prisma"
import { subHours } from "date-fns"

export interface Notification {
  id: string
  type: "order" | "stock" | "payment" | "system"
  title: string
  message: string
  time: string
  unread: boolean
  data?: any
}

export async function getAdminNotifications(): Promise<Notification[]> {
  try {
    const notifications: Notification[] = []
    const now = new Date()

    // Novos pedidos (últimas 2 horas)
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: subHours(now, 2),
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    recentOrders.forEach((order) => {
      const timeAgo = Math.floor((now.getTime() - new Date(order.createdAt).getTime()) / (1000 * 60))
      notifications.push({
        id: `order-${order.id}`,
        type: "order",
        title: "Novo Pedido",
        message: `Pedido #${order.orderNumber} de ${order.user?.name || "Cliente"}`,
        time: timeAgo < 60 ? `${timeAgo} min atrás` : `${Math.floor(timeAgo / 60)}h atrás`,
        unread: true,
        data: { orderId: order.id, orderNumber: order.orderNumber },
      })
    })

    // Produtos com estoque baixo
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 10,
        },
        available: true,
      },
      take: 3,
    })

    lowStockProducts.forEach((product) => {
      notifications.push({
        id: `stock-${product.id}`,
        type: "stock",
        title: "Estoque Baixo",
        message: `${product.name} - apenas ${product.stock} unidades`,
        time: "Agora",
        unread: true,
        data: { productId: product.id, stock: product.stock },
      })
    })

    // Pagamentos confirmados (últimas 4 horas)
    const confirmedPayments = await prisma.order.findMany({
      where: {
        paymentStatus: "Pago",
        paymentDate: {
          gte: subHours(now, 4),
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
      take: 3,
    })

    confirmedPayments.forEach((order) => {
      if (order.paymentDate) {
        const timeAgo = Math.floor((now.getTime() - new Date(order.paymentDate).getTime()) / (1000 * 60))
        notifications.push({
          id: `payment-${order.id}`,
          type: "payment",
          title: "Pagamento Confirmado",
          message: `Pedido #${order.orderNumber} - R$ ${order.total.toFixed(2)}`,
          time: timeAgo < 60 ? `${timeAgo} min atrás` : `${Math.floor(timeAgo / 60)}h atrás`,
          unread: false,
          data: { orderId: order.id, amount: order.total },
        })
      }
    })

    // Ordenar por tempo (mais recentes primeiro)
    return notifications.sort((a, b) => {
      const timeA = a.time.includes("min") ? Number.parseInt(a.time) : Number.parseInt(a.time) * 60
      const timeB = b.time.includes("min") ? Number.parseInt(b.time) : Number.parseInt(b.time) * 60
      return timeA - timeB
    })
  } catch (error) {
    console.error("Erro ao buscar notificações:", error)
    return []
  }
}

export async function markNotificationAsRead(notificationId: string) {
  // Em uma implementação real, você salvaria o estado das notificações no banco
  // Por enquanto, retornamos sucesso
  return { success: true }
}

export async function getUnreadNotificationsCount(): Promise<number> {
  try {
    const notifications = await getAdminNotifications()
    return notifications.filter((n) => n.unread).length
  } catch (error) {
    console.error("Erro ao contar notificações não lidas:", error)
    return 0
  }
}
