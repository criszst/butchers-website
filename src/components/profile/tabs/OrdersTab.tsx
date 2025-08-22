"use client"

import { useEffect, useState } from "react"
import { Product, type Order, type OrderItem } from "@/generated/prisma"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Eye, Plus, Filter, RefreshCw } from "lucide-react"
import OrderDetailModal from "@/components/profile/modals/OrderDetailsModal"
import { getProductById } from "@/app/actions/product"
import { cancelOrder } from "@/app/actions/order/orders"

interface OrdersTabProps {
  orders: (Order & { items: OrderItem[] })[]
  onViewOrderDetails: (order: Order & { items: OrderItem[] }) => void
   product?: { name: string; id: number; createdAt: Date; price: number; category: string; description: string; priceWeightAmount: number | null; priceWeightUnit: string | null; image: string | null; discount: number | null; stock: number; available: boolean; } | null | undefined;
}

const ordersNotFound = () => {
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
            <Button
              onClick={() => console.log("Novo Pedido")}
              className="bg-orange-600 hover:bg-orange-700 text-white transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Fazer Novo Pedido
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
          <p className="text-sm text-gray-500 mb-6">Você ainda não fez nenhum pedido. Que tal começar agora?</p>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Fazer Primeiro Pedido
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function OrdersTab({ orders, onViewOrderDetails, product }: OrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<(Order & { items: OrderItem[] }) | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)


  // TODO: makes refresh works 100%

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const handleViewDetails = (order: Order & { items: OrderItem[] }) => {
    setSelectedOrder(order)
    setShowModal(true)
    onViewOrderDetails(order)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  if (!orders || orders.length === 0) {
    return <div className="pb-20 md:pb-0">{ordersNotFound()}</div>
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "entregue":
        return "bg-green-100 text-green-800 border-green-200"
      case "enviado":
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
    <div className="pb-20 md:pb-0">
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
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-transparent hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Button variant="outline" className="bg-transparent hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-200 bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Pedido #{order.orderNumber || order.id.toString().padStart(4, "0")}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {new Date(order.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-gray-900">R$ {order.total.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            {order.items?.length || 0} {order.items?.length === 1 ? "item" : "itens"}
                          </p>
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
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    {order.status !== "Entregue" && order.status !== "Cancelado" && (
                      <Button
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                      onClick={() => {
                        // Handle cancel order logic here
                        cancelOrder(order.id)
                      }}
                    >
                      Cancelar Pedido
                    </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <OrderDetailModal order={selectedOrder} isOpen={showModal} onClose={handleCloseModal} />
    </div>
  )
}

