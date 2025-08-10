"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, FileText, Loader2 } from "lucide-react"
import { getSalesAnalytics } from "@/app/actions/dashboard/analytics"
import jsPDF from "jspdf"
import { toast } from "react-hot-toast"

interface PDFReportGeneratorProps {
  className?: string
}

export default function PDFReportGenerator({ className }: PDFReportGeneratorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30days")
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDFReport = async () => {
    setIsGenerating(true)
    try {
      // Buscar dados
      const analytics = await getSalesAnalytics(selectedPeriod)

      // Criar PDF
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Header
      pdf.setFontSize(20)
      pdf.setTextColor(220, 38, 38) // Red color
      pdf.text("Casa de Carnes Duarte", 20, 30)

      pdf.setFontSize(16)
      pdf.setTextColor(0, 0, 0)
      pdf.text("Relatório de Vendas", 20, 45)

      pdf.setFontSize(12)
      pdf.setTextColor(100, 100, 100)
      const periodLabel = getPeriodLabel(selectedPeriod)
      pdf.text(`Período: ${periodLabel}`, 20, 55)
      pdf.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 20, 65)

      // Métricas principais
      pdf.setFontSize(14)
      pdf.setTextColor(0, 0, 0)
      pdf.text("Métricas Principais", 20, 85)

      const metrics = [
        { label: "Receita Total", value: formatCurrency(analytics.totalRevenue), growth: analytics.revenueGrowth },
        { label: "Total de Pedidos", value: analytics.totalOrders.toString(), growth: analytics.ordersGrowth },
        {
          label: "Ticket Médio",
          value: formatCurrency(analytics.averageOrderValue),
          growth: analytics.avgOrderGrowth,
        },
        { label: "Novos Clientes", value: analytics.newCustomers.toString(), growth: analytics.customersGrowth },
      ]

      let yPosition = 100
      metrics.forEach((metric) => {
        pdf.setFontSize(12)
        pdf.setTextColor(0, 0, 0)
        pdf.text(`${metric.label}: ${metric.value}`, 20, yPosition)

        const growthColor: [number, number, number] = metric.growth >= 0 ? [34, 197, 94] : [239, 68, 68];
        pdf.setTextColor(...growthColor)
        pdf.text(`(${metric.growth >= 0 ? "+" : ""}${metric.growth.toFixed(1)}%)`, 120, yPosition)

        yPosition += 15
      })

      // Top Produtos
      if (analytics.topProducts.length > 0) {
        yPosition += 10
        pdf.setFontSize(14)
        pdf.setTextColor(0, 0, 0)
        pdf.text("Top 5 Produtos", 20, yPosition)
        yPosition += 15

        analytics.topProducts.slice(0, 5).forEach((product, index) => {
          pdf.setFontSize(10)
          pdf.text(`${index + 1}. ${product.name}`, 25, yPosition)
          pdf.text(`${product.sales} vendas`, 25, yPosition + 8)
          pdf.text(formatCurrency(product.revenue), 120, yPosition)
          yPosition += 20
        })
      }

      // Top Clientes
      if (analytics.topCustomers.length > 0) {
        yPosition += 10
        pdf.setFontSize(14)
        pdf.setTextColor(0, 0, 0)
        pdf.text("Top 5 Clientes", 20, yPosition)
        yPosition += 15

        analytics.topCustomers.slice(0, 5).forEach((customer, index) => {
          pdf.setFontSize(10)
          pdf.text(`${index + 1}. ${customer.name}`, 25, yPosition)
          pdf.text(`${customer.totalOrders} pedidos`, 25, yPosition + 8)
          pdf.text(formatCurrency(customer.totalSpent), 120, yPosition)
          yPosition += 20
        })
      }

      // Vendas por Categoria
      if (analytics.salesByCategory.length > 0) {
        yPosition += 10
        pdf.setFontSize(14)
        pdf.setTextColor(0, 0, 0)
        pdf.text("Vendas por Categoria", 20, yPosition)
        yPosition += 15

        analytics.salesByCategory.forEach((category) => {
          pdf.setFontSize(10)
          pdf.text(`${category.category}: ${category.percentage.toFixed(1)}%`, 25, yPosition)
          pdf.text(formatCurrency(category.revenue), 120, yPosition)
          yPosition += 12
        })
      }

      // Footer
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text("Casa de Carnes Duarte - Relatório gerado automaticamente", 20, pageHeight - 20)

      // Salvar PDF
      const fileName = `relatorio-vendas-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.pdf`
      pdf.save(fileName)

      toast.success("Relatório PDF gerado com sucesso!")
    } catch (error) {
      console.error("Erro ao gerar relatório PDF:", error)
      toast.error("Erro ao gerar relatório PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "7days":
        return "Últimos 7 dias"
      case "90days":
        return "Últimos 90 dias"
      case "1year":
        return "Último ano"
      default:
        return "Últimos 30 dias"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2 text-orange-600" />
          Relatórios PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="flex-1">
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
            onClick={generatePDFReport}
            disabled={isGenerating}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Gerar PDF
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Gere relatórios completos de vendas em PDF com métricas, gráficos e análises detalhadas.
        </p>
      </CardContent>
    </Card>
  )
}
