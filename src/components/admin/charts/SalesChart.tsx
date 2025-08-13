"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Activity } from "lucide-react"
import { getSalesChartData } from "@/app/actions/dashboard/analytics"

interface ChartData {
  date: string
  revenue: number
  orders: number
}

interface SalesChartProps {
  period?: string
  onPeriodChange?: (period: string) => void
}

const COLORS = ["#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d"]

export default function SalesChart({ period = "30days", onPeriodChange }: SalesChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area")
  const [isLoading, setIsLoading] = useState(true)

  const loadChartData = async () => {
    setIsLoading(true)
    try {
      const data = await getSalesChartData(period)
      setChartData(data)
      console.log("Chart data loaded:", data)
    } catch (error) {
      console.error("Erro ao carregar dados do gráfico:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadChartData()
  }, [period])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (period === "7days" || period === "30days") {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    } else if (period === "90days") {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    } else {
      return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{formatDate(label)}</p>
          <p className="text-sm text-green-600">
            Receita: <span className="font-semibold">{formatCurrency(payload[0].value)}</span>
          </p>
          <p className="text-sm text-blue-600">
            Pedidos: <span className="font-semibold">{payload[1]?.value || 0}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-pulse" />
            <p className="text-sm text-gray-500">Carregando dados...</p>
          </div>
        </div>
      )
    }

    if (chartData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Nenhum dado disponível para o período</p>
          </div>
        </div>
      )
    }

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip content={<CustomTooltip  />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#dc2626"
              strokeWidth={3}
              dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#dc2626", strokeWidth: 2 }}
            />
          </LineChart>
        )
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        )
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#dc2626"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        )
    }
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base lg:text-lg">
            <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
            Vendas por Período
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Área</SelectItem>
                <SelectItem value="line">Linha</SelectItem>
                <SelectItem value="bar">Barras</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        {chartData.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-green-600 font-medium">Total do Período</p>
              <p className="text-lg font-bold text-green-700">
                {formatCurrency(chartData.reduce((sum, item) => sum + item.revenue, 0))}
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-600 font-medium">Total de Pedidos</p>
              <p className="text-lg font-bold text-blue-700">{chartData.reduce((sum, item) => sum + item.orders, 0)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
