"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Eye, Star, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import getProducts, { getALLProducts } from "@/app/utils/db/products"
import { Product } from "@/generated/prisma"

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  revenueGrowth: number
  ordersGrowth: number
  productsGrowth: number
  usersGrowth: number
}

interface DashboardOverviewProps {
  stats: DashboardStats
}

export default function DashboardOverview({ stats }: DashboardOverviewProps) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({} as DashboardStats)
  const [products, setProducts] = useState<Product[]>([])
 const updateDashboard = async() => {
      await getALLProducts().then((products) => {
      setProducts(products)
    })
    }

  useEffect(() => {
    updateDashboard()
  })

  // useEffect(() => {
  //   const updateDashboard = () => {
  //     getProducts().then((products) => {
  //       setDashboardStats({
  //         ...stats,
  //         productsGrowth: products.length,
  //       })
  //     })
  //   }

  //   updateDashboard()
  // })
  const recentOrders = [
    { id: "#1247", customer: "João Silva", total: 89.9, status: "Preparando", time: "2 min atrás" },
    { id: "#1246", customer: "Maria Santos", total: 156.5, status: "Entregue", time: "15 min atrás" },
    { id: "#1245", customer: "Pedro Costa", total: 234.8, status: "A caminho", time: "1h atrás" },
    { id: "#1244", customer: "Ana Oliveira", total: 67.3, status: "Confirmado", time: "2h atrás" },
  ]

  const lowStockProducts = [
    { name: "Picanha Premium", stock: 3, minStock: 10 },
    { name: "Costela Bovina", stock: 5, minStock: 15 },
    { name: "Linguiça Artesanal", stock: 8, minStock: 20 },
  ]

  const topProducts = [
    { name: "Picanha Maturada", sales: 145, revenue: 7250.0 },
    { name: "Costela Bovina", sales: 98, revenue: 4900.0 },
    { name: "Filé Mignon", sales: 76, revenue: 6080.0 },
    { name: "Linguiça Artesanal", sales: 234, revenue: 3510.0 },
  ]

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
      case "A caminho":
        return "bg-blue-100 text-blue-800"
      case "Preparando":
        return "bg-yellow-100 text-yellow-800"
      case "Confirmado":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 
        hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium opacity-90">Receita Total</CardTitle>
            <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 opacity-90" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <div className="flex items-center space-x-1 text-xs opacity-90">
              <TrendingUp className="h-2 w-2 lg:h-3 lg:w-3" />
              <span className="text-xs">+{stats.revenueGrowth}%</span>
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
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-2 w-2 lg:h-3 lg:w-3" />
              <span>+{stats.ordersGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Produtos</CardTitle>
            <Package className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{products.length}</div>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-2 w-2 lg:h-3 lg:w-3" />
              <span>+{stats.productsGrowth}%</span>
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
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-2 w-2 lg:h-3 lg:w-3" />
              <span>+{stats.usersGrowth}%</span>
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
                className="text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent text-xs lg:text-sm"
              >
                <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Ver Todos</span>
                <span className="sm:hidden">Todos</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
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
                      <p className="font-semibold text-gray-900 text-sm lg:text-base">{formatCurrency(order.total)}</p>
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                        <span className="text-xs text-gray-500 hidden sm:inline">{order.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <Button className="w-full mt-3 lg:mt-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xs lg:text-sm">
                <span className="hidden sm:inline">Gerenciar Estoque</span>
                <span className="sm:hidden">Gerenciar</span>
              </Button>
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
              <div className="space-y-2 lg:space-y-3">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-xs lg:text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.sales} vendas</p>
                    </div>
                    <p className="font-semibold text-green-600 text-xs lg:text-sm flex-shrink-0">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
