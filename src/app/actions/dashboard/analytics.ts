"use server"

import prisma from "@/lib/prisma"
import { subDays } from "date-fns"

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  revenueGrowth: number
  ordersGrowth: number
  productsGrowth: number
  usersGrowth: number
}

export interface TopProduct {
  name: string
  sales: number
  revenue: number
  growth: number
}

export interface TopCustomer {
  name: string
  email: string
  totalOrders: number
  totalSpent: number
}

export interface SalesByCategory {
  category: string
  revenue: number
  percentage: number
  orders: number
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customer: string
  total: number
  status: string
  time: string
}

export interface LowStockProduct {
  name: string
  stock: number
  minStock: number
  category: string
}

export interface SalesAnalytics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  newCustomers: number
  revenueGrowth: number
  ordersGrowth: number
  avgOrderGrowth: number
  customersGrowth: number
  topProducts: TopProduct[]
  salesByCategory: SalesByCategory[]
  recentTransactions: RecentOrder[]
  topCustomers: TopCustomer[]
}

// Função para calcular crescimento percentual
function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Função para obter dados do dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const now = new Date()
    const thirtyDaysAgo = subDays(now, 30)
    const sixtyDaysAgo = subDays(now, 60)

    // Dados atuais (últimos 30 dias)
    const [currentOrders, previousOrders, totalProducts, totalUsers, previousUsers] = await Promise.all([
      // Pedidos dos últimos 30 dias
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
            lte: now,
          },
        },
      }),
      // Pedidos dos 30 dias anteriores (para comparação)
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
      // Total de produtos
      prisma.product.count(),
      // Usuários dos últimos 30 dias
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      // Usuários dos 30 dias anteriores
      prisma.user.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
    ])

    // Calcular métricas atuais
    const totalRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = currentOrders.length

    // Calcular métricas anteriores
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)
    const previousOrdersCount = previousOrders.length

    // Calcular crescimentos
    const revenueGrowth = calculateGrowth(totalRevenue, previousRevenue)
    const ordersGrowth = calculateGrowth(totalOrders, previousOrdersCount)
    const usersGrowth = calculateGrowth(totalUsers, previousUsers)

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      ordersGrowth: Math.round(ordersGrowth * 100) / 100,
      productsGrowth: 0, // Pode ser implementado se necessário
      usersGrowth: Math.round(usersGrowth * 100) / 100,
    }
  } catch (error) {
    console.error("Erro ao obter estatísticas do dashboard:", error)
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalUsers: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      productsGrowth: 0,
      usersGrowth: 0,
    }
  }
}

// Função para obter produtos com estoque baixo
export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: {
          lte: 10, // Produtos com estoque <= 10
        },
        available: true,
      },
      orderBy: {
        stock: "asc",
      },
      take: 5,
    })

    return products.map((product) => ({
      name: product.name,
      stock: product.stock,
      minStock: 15, // Valor padrão, pode ser configurável
      category: product.category,
    }))
  } catch (error) {
    console.error("Erro ao obter produtos com estoque baixo:", error)
    return []
  }
}

// Função para obter pedidos recentes
export async function getRecentOrders(): Promise<RecentOrder[]> {
  try {
    const orders = await prisma.order.findMany({
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

    return orders.map((order) => {
      const now = new Date()
      const orderDate = new Date(order.createdAt)
      const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60))

      let timeAgo: string
      if (diffInMinutes < 60) {
        timeAgo = `${diffInMinutes} min atrás`
      } else if (diffInMinutes < 1440) {
        timeAgo = `${Math.floor(diffInMinutes / 60)}h atrás`
      } else {
        timeAgo = `${Math.floor(diffInMinutes / 1440)} dias atrás`
      }

      return {
        id: `#${order.orderNumber}`,
        orderNumber: order.orderNumber,
        customer: order.user?.name || "Cliente",
        total: order.total,
        status: order.status,
        time: timeAgo,
      }
    })
  } catch (error) {
    console.error("Erro ao obter pedidos recentes:", error)
    return []
  }
}

// Função para obter produtos mais vendidos
export async function getTopProducts(days = 30): Promise<TopProduct[]> {
  try {
    const startDate = subDays(new Date(), days)
    const previousStartDate = subDays(new Date(), days * 2)

    // Produtos mais vendidos no período atual
    const currentPeriodItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: startDate,
          },
        },
      },
      include: {
        order: true,
      },
    })

    // Produtos mais vendidos no período anterior (para comparação)
    const previousPeriodItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: previousStartDate,
            lt: startDate,
          },
        },
      },
    })

    // Agrupar por produto
    const productStats = new Map<string, { sales: number; revenue: number }>()
    const previousProductStats = new Map<string, { sales: number; revenue: number }>()

    // Processar período atual
    currentPeriodItems.forEach((item) => {
      const existing = productStats.get(item.name) || { sales: 0, revenue: 0 }
      productStats.set(item.name, {
        sales: existing.sales + item.quantity,
        revenue: existing.revenue + item.price * item.quantity,
      })
    })

    // Processar período anterior
    previousPeriodItems.forEach((item) => {
      const existing = previousProductStats.get(item.name) || { sales: 0, revenue: 0 }
      previousProductStats.set(item.name, {
        sales: existing.sales + item.quantity,
        revenue: existing.revenue + item.price * item.quantity,
      })
    })

    // Converter para array e calcular crescimento
    const topProducts: TopProduct[] = Array.from(productStats.entries())
      .map(([name, stats]) => {
        const previousStats = previousProductStats.get(name) || { sales: 0, revenue: 0 }
        const growth = calculateGrowth(stats.revenue, previousStats.revenue)

        return {
          name,
          sales: stats.sales,
          revenue: stats.revenue,
          growth: Math.round(growth * 100) / 100,
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return topProducts
  } catch (error) {
    console.error("Erro ao obter produtos mais vendidos:", error)
    return []
  }
}

// Função para obter vendas por categoria
export async function getSalesByCategory(days = 30): Promise<SalesByCategory[]> {
  try {
    const startDate = subDays(new Date(), days)

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: startDate,
          },
        },
      },
    })

    const categoryStats = new Map<string, { revenue: number; orders: Set<string> }>()
    let totalRevenue = 0

    orderItems.forEach((item) => {
      const revenue = item.price * item.quantity
      totalRevenue += revenue

      const existing = categoryStats.get(item.category) || { revenue: 0, orders: new Set() }
      categoryStats.set(item.category, {
        revenue: existing.revenue + revenue,
        orders: existing.orders.add(item.orderId),
      })
    })

    return Array.from(categoryStats.entries())
      .map(([category, stats]) => ({
        category,
        revenue: stats.revenue,
        percentage: totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0,
        orders: stats.orders.size,
      }))
      .sort((a, b) => b.revenue - a.revenue)
  } catch (error) {
    console.error("Erro ao obter vendas por categoria:", error)
    return []
  }
}

// Função para obter clientes que mais compram
export async function getTopCustomers(days = 30): Promise<TopCustomer[]> {
  try {
    const startDate = subDays(new Date(), days)

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    const customerStats = new Map<string, { name: string; email: string; totalOrders: number; totalSpent: number }>()

    orders.forEach((order) => {
      const userId = order.userId
      const existing = customerStats.get(userId) || {
        name: order.user?.name || "Cliente",
        email: order.user?.email || "",
        totalOrders: 0,
        totalSpent: 0,
      }

      customerStats.set(userId, {
        ...existing,
        totalOrders: existing.totalOrders + 1,
        totalSpent: existing.totalSpent + order.total,
      })
    })

    return Array.from(customerStats.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
  } catch (error) {
    console.error("Erro ao obter top clientes:", error)
    return []
  }
}

// Função principal para obter analytics de vendas
export async function getSalesAnalytics(period = "30days"): Promise<SalesAnalytics> {
  try {
    let days: number
    switch (period) {
      case "7days":
        days = 7
        break
      case "90days":
        days = 90
        break
      case "1year":
        days = 365
        break
      default:
        days = 30
    }

    const now = new Date()
    const startDate = subDays(now, days)
    const previousStartDate = subDays(now, days * 2)

    // Dados do período atual
    const [currentOrders, previousOrders, newCustomers, previousNewCustomers] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: now,
          },
        },
      }),
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: previousStartDate,
            lt: startDate,
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: previousStartDate,
            lt: startDate,
          },
        },
      }),
    ])

    // Calcular métricas atuais
    const totalRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = currentOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calcular métricas anteriores
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)
    const previousOrdersCount = previousOrders.length
    const previousAvgOrderValue = previousOrdersCount > 0 ? previousRevenue / previousOrdersCount : 0

    // Calcular crescimentos
    const revenueGrowth = calculateGrowth(totalRevenue, previousRevenue)
    const ordersGrowth = calculateGrowth(totalOrders, previousOrdersCount)
    const avgOrderGrowth = calculateGrowth(averageOrderValue, previousAvgOrderValue)
    const customersGrowth = calculateGrowth(newCustomers, previousNewCustomers)

    // Obter dados adicionais
    const [topProducts, salesByCategory, recentTransactions, topCustomers] = await Promise.all([
      getTopProducts(days),
      getSalesByCategory(days),
      getRecentOrders(),
      getTopCustomers(days),
    ])

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      newCustomers,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      ordersGrowth: Math.round(ordersGrowth * 100) / 100,
      avgOrderGrowth: Math.round(avgOrderGrowth * 100) / 100,
      customersGrowth: Math.round(customersGrowth * 100) / 100,
      topProducts,
      salesByCategory,
      recentTransactions,
      topCustomers,
    }
  } catch (error) {
    console.error("Erro ao obter analytics de vendas:", error)
    return {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      newCustomers: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      avgOrderGrowth: 0,
      customersGrowth: 0,
      topProducts: [],
      salesByCategory: [],
      recentTransactions: [],
      topCustomers: [],
    }
  }
}

// Função para obter dados de vendas por período (para gráficos)
export async function getSalesChartData(period = "30days") {
  try {
    let days: number
    let groupBy: "day" | "week" | "month"

    switch (period) {
      case "7days":
        days = 7
        groupBy = "day"
        break
      case "90days":
        days = 90
        groupBy = "week"
        break
      case "1year":
        days = 365
        groupBy = "month"
        break
      default:
        days = 30
        groupBy = "day"
    }

    const startDate = subDays(new Date(), days)

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    // Agrupar dados por período
    const chartData = []
    const dateMap = new Map<string, { revenue: number; orders: number }>()

    orders.forEach((order) => {
      let dateKey: string
      const orderDate = new Date(order.createdAt)

      if (groupBy === "day") {
        dateKey = orderDate.toISOString().split("T")[0]
      } else if (groupBy === "week") {
        const weekStart = new Date(orderDate)
        weekStart.setDate(orderDate.getDate() - orderDate.getDay())
        dateKey = weekStart.toISOString().split("T")[0]
      } else {
        dateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`
      }

      const existing = dateMap.get(dateKey) || { revenue: 0, orders: 0 }
      dateMap.set(dateKey, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1,
      })
    })

    return Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
    }))
  } catch (error) {
    console.error("Erro ao obter dados do gráfico:", error)
    return []
  }
}
