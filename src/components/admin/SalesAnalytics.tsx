"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Download,
  Eye,
  Target,
  RefreshCw,
  Crown,
} from "lucide-react"
import { getSalesAnalytics } from "@/app/actions/dashboard/analytics"
import type { SalesAnalytics as SalesAnalyticsType } from "@/app/actions/dashboard/analytics"
import SalesChart from "@/components/admin/charts/SalesChart"
import PDFReportGenerator from "./reports/PDFReportGenerator"
import AdvancedFilters from "./filters/AdvancedFilters"
import { toast } from "react-hot-toast"

import { mkConfig, generateCsv, download, asString } from "export-to-csv";
import { writeFile } from "node:fs"


export default function SalesAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days")
  const [analytics, setAnalytics] = useState<SalesAnalyticsType>({
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
  })
  const [isLoading, setIsLoading] = useState(true)

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const analyticsData = await getSalesAnalytics(selectedPeriod)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error("Erro ao carregar analytics:", error)
      toast.error("Erro ao carregar dados de vendas")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalyticsData()
  }, [selectedPeriod])

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

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "7days":
        return "últimos 7 dias"
      case "90days":
        return "últimos 90 dias"
      case "1year":
        return "último ano"
      default:
        return "últimos 30 dias"
    }
  }

  const exportData = () => {
    const csvData = [
      {
        Métrica: "Receita Total",
        Valor: formatCurrency(analytics.totalRevenue),
        Crescimento: `${analytics.revenueGrowth >= 0 ? "+" : ""}${analytics.revenueGrowth}%`,
      },
      {
        Métrica: "Total de Pedidos",
        Valor: analytics.totalOrders,
        Crescimento: `${analytics.ordersGrowth >= 0 ? "+" : ""}${analytics.ordersGrowth}%`,
      },
      {
        Métrica: "Ticket Médio",
        Valor: formatCurrency(analytics.averageOrderValue),
        Crescimento: `${analytics.avgOrderGrowth >= 0 ? "+" : ""}${analytics.avgOrderGrowth}%`,
      },
      {
        Métrica: "Novos Clientes",
        Valor: analytics.newCustomers,
        Crescimento: `${analytics.customersGrowth >= 0 ? "+" : ""}${analytics.customersGrowth}%`,
      },

      {
        Métrica: "Produtos Mais Vendidos",
        Valor: "",
        Crescimento: "",
      },
    ]

    const csvConfig = mkConfig({ 
      useKeysAsHeaders: true,
      fieldSeparator: ";",
      decimalSeparator: ","
     });
     
    const csv = generateCsv(csvConfig)(csvData);

    const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));
    const blob = new Blob([csvBuffer], { type: "text/csv" });


      download(csvConfig)(csv);

    toast.success("Dados exportados com sucesso!");
  };

  const handleFiltersChange = (filters: any) => {
  
    console.log("Filtros aplicados:", filters)
    toast.success("Filtros aplicados!")
  }

  const handleFiltersReset = () => {
    toast.success("Filtros limpos!")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 text-red-600 animate-spin" />
          <p className="text-gray-600">Carregando análise de vendas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Análise de Vendas</h2>
          <p className="text-sm lg:text-base text-gray-600">
            Acompanhe o desempenho das vendas e métricas importantes ({getPeriodLabel(selectedPeriod)})
          </p>
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
            onClick={exportData}
            className="text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent w-full lg:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button
            onClick={loadAnalyticsData}
            disabled={isLoading}
            className="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters onFiltersChange={handleFiltersChange} onReset={handleFiltersReset} />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium opacity-90">Receita Total</CardTitle>
            <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 opacity-90" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <div
              className={`flex items-center space-x-1 text-xs opacity-90 ${getGrowthColor(analytics.revenueGrowth)}`}
            >
              {getGrowthIcon(analytics.revenueGrowth)}
              <span>
                {analytics.revenueGrowth >= 0 ? "+" : ""}
                {analytics.revenueGrowth}%
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
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{analytics.totalOrders}</div>
            <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(analytics.ordersGrowth)}`}>
              {getGrowthIcon(analytics.ordersGrowth)}
              <span>
                {analytics.ordersGrowth >= 0 ? "+" : ""}
                {analytics.ordersGrowth}%
              </span>
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
              {formatCurrency(analytics.averageOrderValue)}
            </div>
            <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(analytics.avgOrderGrowth)}`}>
              {getGrowthIcon(analytics.avgOrderGrowth)}
              <span>
                {analytics.avgOrderGrowth >= 0 ? "+" : ""}
                {analytics.avgOrderGrowth}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Novos Clientes</CardTitle>
            <Users className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{analytics.newCustomers}</div>
            <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(analytics.customersGrowth)}`}>
              {getGrowthIcon(analytics.customersGrowth)}
              <span>
                {analytics.customersGrowth >= 0 ? "+" : ""}
                {analytics.customersGrowth}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Sales Chart */}
        <div className="xl:col-span-2">
          <SalesChart period={selectedPeriod} onPeriodChange={setSelectedPeriod} />
        </div>

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
            {analytics.salesByCategory.length > 0 ? (
              <div className="space-y-4">
                {analytics.salesByCategory.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs lg:text-sm font-medium text-gray-900 truncate">{category.category}</span>
                      <span className="text-xs lg:text-sm text-gray-600">{category.percentage.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-600 to-orange-600 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{category.orders} pedidos</span>
                      <span className="font-semibold text-green-600">{formatCurrency(category.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm text-gray-500">Nenhuma venda por categoria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reports and Additional Features */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* PDF Report Generator */}
        <PDFReportGenerator />

        {/* Real-time Updates Status */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <RefreshCw className="h-5 w-5 mr-2 text-green-600" />
              Atualizações em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">Sistema Ativo</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <p className="text-sm text-gray-600">
              Os dados são atualizados automaticamente a cada 30 segundos. Última atualização:{" "}
              {new Date().toLocaleTimeString("pt-BR")}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAnalyticsData}
              className="w-full bg-transparent"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Forçar Atualização
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Products, Top Customers and Recent Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
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
            {analytics.topProducts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {analytics.topProducts.map((product, index) => (
                  <div key={index} className="p-3 lg:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs lg:text-sm font-bold text-red-600">#{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{product.name}</p>
                          <p className="text-xs lg:text-sm text-gray-600">{product.sales} vendas</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-green-600 text-sm lg:text-base">
                          {formatCurrency(product.revenue)}
                        </p>
                        <div className={`flex items-center space-x-1 text-xs ${getGrowthColor(product.growth)}`}>
                          {getGrowthIcon(product.growth)}
                          <span>{Math.abs(product.growth).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum produto vendido ainda</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-base lg:text-lg">
              <Crown className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
              <span className="hidden sm:inline">Top Clientes</span>
              <span className="sm:hidden">Clientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {analytics.topCustomers.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {analytics.topCustomers.map((customer, index) => (
                  <div key={index} className="p-3 lg:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-600">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{customer.name}</p>
                          <p className="text-xs lg:text-sm text-gray-600">{customer.totalOrders} pedidos</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-green-600 text-sm lg:text-base">
                          {formatCurrency(customer.totalSpent)}
                        </p>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">#{index + 1}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Crown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum cliente ainda</p>
              </div>
            )}
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
            {analytics.recentTransactions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {analytics.recentTransactions.map((transaction, index) => (
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
                          {formatCurrency(transaction.total)}
                        </p>
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <Badge
                            className={
                              transaction.status === "Entregue"
                                ? "bg-green-100 text-green-800 text-xs"
                                : transaction.status === "Enviado"
                                  ? "bg-blue-100 text-blue-800 text-xs"
                                  : transaction.status === "Preparando"
                                    ? "bg-yellow-100 text-yellow-800 text-xs"
                                    : "bg-red-100 text-red-800 text-xs"
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
            ) : (
              <div className="p-8 text-center text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma transação recente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
