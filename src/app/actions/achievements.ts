"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  earned: boolean
  date?: string
  color: string
  bgColor: string
}

export async function getUserAchievements(): Promise<Achievement[]> {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return []
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        Order: {
          select: {
            id: true,
            createdAt: true,
            status: true,
            items: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    })

    if (!user) return []

    const completedOrders = user.Order.filter((order) => order.status === "completed")
    const orderCount = completedOrders.length
    const firstOrderDate = completedOrders.length > 0 ? completedOrders[completedOrders.length - 1].createdAt : null

   
    const uniqueCategories = new Set()
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.category) {
          uniqueCategories.add(item.category)
        }
      })
    })

    const achievements: Achievement[] = [
      {
        id: 1,
        title: "Primeiro Pedido",
        description: "Fez seu primeiro pedido no açougue",
        icon: "Target",
        earned: orderCount > 0,
        date: firstOrderDate?.toISOString().split("T")[0],
        color: "from-green-600 to-emerald-600",
        bgColor: "from-green-50 to-emerald-50",
      },
      {
        id: 2,
        title: "Cliente Fiel",
        description: "10 pedidos realizados",
        icon: "Crown",
        earned: orderCount >= 10,
        date:
          orderCount >= 10
            ? completedOrders[completedOrders.length - 10]?.createdAt.toISOString().split("T")[0]
            : undefined,
        color: "from-amber-600 to-yellow-600",
        bgColor: "from-amber-50 to-yellow-50",
      },
      {
        id: 3,
        title: "Churrasqueiro",
        description: "25 pedidos realizados - Você é um verdadeiro churrasqueiro!",
        icon: "Award",
        earned: orderCount >= 25,
        date:
          orderCount >= 25
            ? completedOrders[completedOrders.length - 25]?.createdAt.toISOString().split("T")[0]
            : undefined,
        color: "from-red-600 to-orange-600",
        bgColor: "from-red-50 to-orange-50",
      },
      {
        id: 4,
        title: "Explorador",
        description: "Experimentou 5 tipos diferentes de carne",
        icon: "Sparkles",
        earned: uniqueCategories.size >= 5,
        date: uniqueCategories.size >= 5 ? firstOrderDate?.toISOString().split("T")[0] : undefined,
        color: "from-purple-600 to-pink-600",
        bgColor: "from-purple-50 to-pink-50",
      },
      {
        id: 5,
        title: "Mestre do Churrasco",
        description: "50 pedidos realizados - Você é um mestre!",
        icon: "Zap",
        earned: orderCount >= 50,
        date:
          orderCount >= 50
            ? completedOrders[completedOrders.length - 50]?.createdAt.toISOString().split("T")[0]
            : undefined,
        color: "from-indigo-600 to-blue-600",
        bgColor: "from-indigo-50 to-blue-50",
      },
      {
        id: 6,
        title: "Conhecedor",
        description: "Experimentou mais de 10 tipos diferentes de carne",
        icon: "BookOpen",
        earned: uniqueCategories.size >= 10,
        date: uniqueCategories.size >= 10 ? firstOrderDate?.toISOString().split("T")[0] : undefined,
        color: "from-teal-600 to-cyan-600",
        bgColor: "from-teal-50 to-cyan-50",
      },
    ]

    return achievements
  } catch (error) {
    console.error("Erro ao buscar conquistas:", error)
    return []
  }
}
