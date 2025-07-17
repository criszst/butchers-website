"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Eye, Plus, Filter } from "lucide-react"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface TrackingInfo {
  status: string
  estimatedDelivery: string
  trackingNumber: string
}

interface Order {
  id: string
  date: string
  total: number
  status: string
  items: OrderItem[]
  trackingInfo: TrackingInfo
}

interface OrdersTabProps {
  orders: Order[]
  onViewOrderDetails: (order: Order) => void
}

export default function OrdersTab({ orders, onViewOrderDetails }: OrdersTabProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "entregue":
        return "bg-green-100 text-green-800 border-green-200"
      case "em transporte":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "preparando":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="border-gray-200 bg-white rounded-xl shadow-md">
      <CardHeader className="border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Pedidos</h3>
              <p className="text-sm text-gray-500">Acompanhe seus pedidos e histórico</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="bg-transparent hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Fazer Novo Pedido
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-200"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                    <div>
                      <h4 className="font-medium text-gray-900">Pedido #{order.id}</h4>
                      <p className="text-gray-600 text-sm">{order.date}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-gray-900">R$ {order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{order.items.length} itens</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-colors bg-transparent hover:bg-gray-50"
                    onClick={() => onViewOrderDetails(order)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  {order.status !== "Entregue" && order.status !== "Cancelado" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent transition-colors"
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
