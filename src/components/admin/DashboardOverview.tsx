"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  getDashboardStats,
  getLowStockProducts,
  getRecentOrders,
  getTopProducts,
} from "@/app/actions/dashboard/analytics"
import type { DashboardStats, LowStockProduct, RecentOrder, TopProduct } from "@/app/actions/dashboard/analytics"

import { useRouter } from "next/navigation"

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    productsGrowth: 0,
    usersGrowth: 0,
  })
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [dashboardStats, lowStock, recent, top] = await Promise.all([
        getDashboardStats(),
        getLowStockProducts(),
        getRecentOrders(),
        getTopProducts(),
      ])

      setStats(dashboardStats)
      setLowStockProducts(lowStock)
      setRecentOrders(recent)
      setTopProducts(top)
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Entregue":
        return "bg-green-100 text-green-800"
      case "Enviado":
        return "bg-blue-100 text-blue-800"
      case "Preparando":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-2 w-2 lg:h-3 lg:w-3" />
    ) : (
      <TrendingDown className="h-2 w-2 lg:h-3 lg:w-3" />
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 text-red-600 animate-spin" />
          <p className="text-gray-600">Carregando dados do dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm lg:text-base text-gray-600">Visão geral do seu negócio (últimos 30 dias)</p>
        </div>
        <Button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="bg-gradient-to-r from-red-300 to-orange-500 text-white border-0 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium opacity-90">Receita Total</CardTitle>
            <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 opacity-90" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <div className={`flex items-center space-x-1 text-xs opacity-90  ${getGrowthColor(stats.revenueGrowth)}`}>
              {getGrowthIcon(stats.revenueGrowth)}
              <span>
                {stats.revenueGrowth >= 0 ? "+" : ""}
                {stats.revenueGrowth}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Pedidos</CardTitle>
            <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
            <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(stats.ordersGrowth)}`}>
              {getGrowthIcon(stats.ordersGrowth)}
              <span>
                {stats.ordersGrowth >= 0 ? "+" : ""}
                {stats.ordersGrowth}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Produtos</CardTitle>
            <Package className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>Total cadastrado</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Usuários</CardTitle>
            <Users className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(stats.usersGrowth)}`}>
              {getGrowthIcon(stats.usersGrowth)}
              <span>
                {stats.usersGrowth >= 0 ? "+" : ""}
                {stats.usersGrowth}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Orders */}
        <Card className="xl:col-span-2 bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">Pedidos Recentes</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin?tab=orders")}
                className="text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent text-xs lg:text-sm"
              >
                <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Ver Todos</span>
                <span className="sm:hidden">Todos</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-3 lg:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="h-3 w-3 lg:h-5 lg:w-5 text-red-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm lg:text-base">{order.id}</p>
                          <p className="text-xs lg:text-sm text-gray-600 truncate">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">
                          {formatCurrency(order.total)}
                        </p>
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                          <span className="text-xs text-gray-500 hidden sm:inline">{order.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum pedido recente encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts & Quick Actions */}
        <div className="space-y-4 lg:space-y-6">
          {/* Low Stock Alert */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-base lg:text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-600 mr-2" />
                <span className="hidden sm:inline">Estoque Baixo</span>
                <span className="sm:hidden">Estoque</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 lg:p-4">
              {lowStockProducts.length > 0 ? (
                <>
                  <div className="space-y-2 lg:space-y-3">
                    {lowStockProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-xs lg:text-sm truncate">{product.name}</p>
                          <p className="text-xs text-gray-600">Min: {product.minStock}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs flex-shrink-0">{product.stock}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => window.location.replace("/admin?tab=produtos")}
                    className="w-full mt-3 lg:mt-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xs lg:text-sm"
                  >
                    <span className="hidden sm:inline">Gerenciar Estoque</span>
                    <span className="sm:hidden">Gerenciar</span>
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">Estoque em bom estado</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-base lg:text-lg font-semibold text-gray-900 flex items-center">
                <Star className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-600 mr-2" />
                <span className="hidden sm:inline">Top Produtos</span>
                <span className="sm:hidden">Top</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 lg:p-4">
              {topProducts.length > 0 ? (
                <div className="space-y-2 lg:space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-xs lg:text-sm truncate">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.sales} vendas</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-green-600 text-xs lg:text-sm">
                          {formatCurrency(product.revenue)}
                        </p>
                        <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(product.growth)}`}>
                          {getGrowthIcon(product.growth)}
                          <span>{Math.abs(product.growth)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Star className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">Nenhuma venda ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
