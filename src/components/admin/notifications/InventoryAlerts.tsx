"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package, Bell, X, Settings } from "lucide-react"
import { getLowStockProducts } from "@/app/actions/dashboard/analytics"
import type { LowStockProduct } from "@/app/actions/dashboard/analytics"
import { toast } from "react-hot-toast"

interface InventoryAlertsProps {
  className?: string
}

export default function InventoryAlerts({ className }: InventoryAlertsProps) {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const loadLowStockProducts = async () => {
    setIsLoading(true)
    try {
      const products = await getLowStockProducts()
      setLowStockProducts(products)
    } catch (error) {
      console.error("Erro ao carregar produtos com estoque baixo:", error)
      toast.error("Erro ao carregar alertas de estoque")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLowStockProducts()
    // Atualizar a cada 5 minutos
    const interval = setInterval(loadLowStockProducts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const dismissAlert = (productName: string) => {
    setDismissedAlerts((prev) => new Set([...prev, productName]))
    toast.success("Alerta dispensado")
  }

  const getStockLevel = (stock: number, minStock: number) => {
    const percentage = (stock / minStock) * 100
    if (percentage <= 25) return { level: "critical", color: "bg-red-500", textColor: "text-red-800" }
    if (percentage <= 50) return { level: "low", color: "bg-yellow-500", textColor: "text-yellow-800" }
    return { level: "normal", color: "bg-green-500", textColor: "text-green-800" }
  }

  const visibleProducts = lowStockProducts.filter((product) => !dismissedAlerts.has(product.name))

  if (!alertsEnabled) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">Alertas de estoque desabilitados</p>
          <Button onClick={() => setAlertsEnabled(true)} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Habilitar Alertas
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            Alertas de Estoque
            {visibleProducts.length > 0 && (
              <Badge className="ml-2 bg-red-100 text-red-800">{visibleProducts.length}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={loadLowStockProducts} disabled={isLoading}>
              Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAlertsEnabled(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <Package className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-pulse" />
            <p className="text-sm text-gray-500">Verificando estoque...</p>
          </div>
        ) : visibleProducts.length > 0 ? (
          <div className="space-y-3">
            {visibleProducts.map((product, index) => {
              const stockLevel = getStockLevel(product.stock, product.minStock)
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stockLevel.color}`}></div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600">
                        {product.category} • Mín: {product.minStock}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${stockLevel.textColor} bg-white border`}>{product.stock} restantes</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(product.name)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            <div className="pt-3 border-t border-gray-200">
              <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white">
                <Package className="h-4 w-4 mr-2" />
                Gerenciar Estoque
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-green-400" />
            <p className="text-green-600 font-medium">Estoque em bom estado!</p>
            <p className="text-sm text-gray-500 mt-1">Todos os produtos estão com estoque adequado</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
