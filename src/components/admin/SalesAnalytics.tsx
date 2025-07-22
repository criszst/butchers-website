"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Download,
  Eye,
  Target,
} from "lucide-react"

export default function SalesAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days")

  // Mock data para demonstração
  const salesData = {
    totalRevenue: 45680.5,
    totalOrders: 1247,
    averageOrderValue: 89.45,
    newCustomers: 156,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    avgOrderGrowth: 4.2,
    customersGrowth: 15.7,
  }

  const topProducts = [
    { name: "Picanha Premium", revenue: 12450.0, orders: 145, growth: 15.2 },
    { name: "Costela Bovina", revenue: 8900.0, orders: 98, growth: -2.1 },
    { name: "Filé Mignon", revenue: 7680.0, orders: 76, growth: 8.7 },
    { name: "Linguiça Artesanal", revenue: 6540.0, orders: 234, growth: 22.3 },
    { name: "Fraldinha", revenue: 5430.0, orders: 87, growth: 5.8 },
  ]

  const salesByCategory = [
    { category: "Carnes Nobres", revenue: 28450.0, percentage: 62.3 },
    { category: "Carnes Especiais", revenue: 12340.0, percentage: 27.0 },
    { category: "Embutidos", revenue: 3890.0, percentage: 8.5 },
    { category: "Aves", revenue: 1000.0, percentage: 2.2 },
  ]

  const recentTransactions = [
    { id: "#1247", customer: "João Silva", amount: 89.9, time: "2 min atrás", status: "Confirmado" },
    { id: "#1246", customer: "Maria Santos", amount: 156.5, time: "15 min atrás", status: "Pago" },
    { id: "#1245", customer: "Pedro Costa", amount: 234.8, time: "1h atrás", status: "Pago" },
    { id: "#1244", customer: "Ana Oliveira", amount: 67.3, time: "2h atrás", status: "Pendente" },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
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

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Análise de Vendas</h2>
          <p className="text-sm lg:text-base text-gray-600">Acompanhe o desempenho das vendas e métricas importantes</p>
        </div>
        <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full lg:w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="90days">Últimos 90 dias</SelectItem>
              <SelectItem value="1year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent w-full lg:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="lg:hidden">Exportar</span>
            <span className="hidden lg:inline">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium opacity-90">Receita Total</CardTitle>
            <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 opacity-90" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold">{formatCurrency(salesData.totalRevenue)}</div>
            <div
              className={`flex items-center space-x-1 text-xs opacity-90 ${getGrowthColor(salesData.revenueGrowth)}`}
            >
              {getGrowthIcon(salesData.revenueGrowth)}
              <span>+{salesData.revenueGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Pedidos</CardTitle>
            <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{salesData.totalOrders}</div>
            <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(salesData.ordersGrowth)}`}>
              {getGrowthIcon(salesData.ordersGrowth)}
              <span>+{salesData.ordersGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Ticket Médio</CardTitle>
            <Target className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">
              {formatCurrency(salesData.averageOrderValue)}
            </div>
            <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(salesData.avgOrderGrowth)}`}>
              {getGrowthIcon(salesData.avgOrderGrowth)}
              <span>+{salesData.avgOrderGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Novos Clientes</CardTitle>
            <Users className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{salesData.newCustomers}</div>
            <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(salesData.customersGrowth)}`}>
              {getGrowthIcon(salesData.customersGrowth)}
              <span>+{salesData.customersGrowth}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Sales Chart Placeholder */}
        <Card className="xl:col-span-2 bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-base lg:text-lg">
              <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
              Vendas por Período
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="h-48 lg:h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm lg:text-base text-gray-600">Gráfico de vendas seria exibido aqui</p>
                <p className="text-xs lg:text-sm text-gray-500">Integração com biblioteca de gráficos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-base lg:text-lg">
              <Target className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
              <span className="hidden sm:inline">Vendas por Categoria</span>
              <span className="sm:hidden">Por Categoria</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {salesByCategory.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs lg:text-sm font-medium text-gray-900 truncate">{category.category}</span>
                    <span className="text-xs lg:text-sm text-gray-600">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-orange-600 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs lg:text-sm font-semibold text-green-600">
                      {formatCurrency(category.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Recent Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Top Products */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
                <span className="text-base lg:text-lg">Top Produtos</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent"
              >
                <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Ver Todos</span>
                <span className="sm:hidden">Todos</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {topProducts.map((product, index) => (
                <div key={index} className="p-3 lg:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs lg:text-sm font-bold text-red-600">#{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{product.name}</p>
                        <p className="text-xs lg:text-sm text-gray-600">{product.orders} pedidos</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-green-600 text-sm lg:text-base">
                        {formatCurrency(product.revenue)}
                      </p>
                      <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(product.growth)}`}>
                        {getGrowthIcon(product.growth)}
                        <span>{Math.abs(product.growth)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-base lg:text-lg">
              <DollarSign className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
              <span className="hidden sm:inline">Transações Recentes</span>
              <span className="sm:hidden">Transações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="p-3 lg:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <DollarSign className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm lg:text-base">{transaction.id}</p>
                        <p className="text-xs lg:text-sm text-gray-600 truncate">{transaction.customer}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-gray-900 text-sm lg:text-base">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <Badge
                          className={
                            transaction.status === "Pago"
                              ? "bg-green-100 text-green-800 text-xs"
                              : transaction.status === "Confirmado"
                                ? "bg-blue-100 text-blue-800 text-xs"
                                : "bg-yellow-100 text-yellow-800 text-xs"
                          }
                        >
                          {transaction.status}
                        </Badge>
                        <span className="text-xs text-gray-500 hidden sm:inline">{transaction.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
