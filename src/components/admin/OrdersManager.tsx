"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Eye, Printer } from "lucide-react"
import { getAllOrders, updateOrderStatusByOrderNumber } from "@/app/actions/order/orders"
import { toast } from "sonner"
import { DeliveryData, getDeliveryConfigs, getStoreSettings, StoreSettingsData } from "@/app/actions/store-settings"

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    category: string
  }>
  total: number
  deliveryFee?: number
  status: string
  paymentMethod: string
  paymentStatus: string
  deliveryAddress: string
  createdAt: string
  estimatedDelivery: Date | null
  deliveryDate: Date | null
  trackingCode: string | null
}


export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [store, setStore] = useState<StoreSettingsData | null>(null)


  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const loadSettings = async () => {
    try {
      const result = await getStoreSettings()
      if (result.success && result.settings) {
        setStore(result.settings)
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
      toast.error("Erro ao carregar configurações")
    }
  }

  const loadOrders = async () => {
    try {
      const result = await getAllOrders()
      if (result.success) {
        setOrders(result.orders as Order[])
      } else {
        toast.error("Erro ao carregar pedidos")
      }
    } catch (error) {
      toast.error("Erro ao carregar pedidos")
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderNumber: string, newStatus: string) => {
    try {
      const result = await updateOrderStatusByOrderNumber(orderNumber, newStatus)
      if (result.success) {
        toast.success("Status do pedido atualizado com sucesso!")
        loadOrders()
      } else {
        toast.error(result.message || "Erro ao atualizar status do pedido")
      }
    } catch (error) {
      toast.error("Erro ao atualizar status do pedido")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatWeight = (quantity: number) => {
    if (quantity >= 1) {
      return `${quantity.toFixed(quantity % 1 === 0 ? 0 : 3)}kg`
    } else {
      const grams = Math.round(quantity * 1000)
      return `${grams}g`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Preparando":
        return "bg-yellow-100 text-yellow-800"
      case "Enviado":
        return "bg-blue-100 text-blue-800"
      case "Entregue":
        return "bg-green-100 text-green-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePrintOrder = (order: Order) => {
    const printUrl = `/orders/${order.id}/print`
    window.open(printUrl, "_blank")
  }



  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando pedidos...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por número do pedido, cliente ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Preparando">Preparando</SelectItem>
                <SelectItem value="Enviado">Enviado</SelectItem>
                <SelectItem value="Entregue">Entregue</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum pedido encontrado</div>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">#{order.orderNumber}</h3>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Cliente:</span> {order.customer.name}
                          </p>
                          <p>
                            <span className="font-medium">Total:</span> {formatPrice(order.total)}
                          </p>
                          <p>
                            <span className="font-medium">Data:</span>{" "}
                            {order.createdAt}
                          </p>
                          <p>
                            <span className="font-medium">Pagamento:</span> {order.paymentMethod}
                          </p>
                          <p>
                            <span className="font-medium">Itens:</span> {order.items.length}
                          </p>

                          <p>
                            <span className="font-medium"> Pedido:   {order.items.map((item) => formatWeight(item.quantity)).join(", ")} de {order.items.map((item) => item.name).join(", ")} - {order.items.map((item) => formatPrice(item.price * item.quantity)).join(", ")}
                            </span>

                          </p>

                          <p>
                            <span className="font-medium">Categoria:</span> {order.items.map((item) => item.category).join(", ")}
                          </p>

                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintOrder(order)}
                          className="flex items-center gap-2"
                        >
                          <Printer className="h-4 w-4" />
                          Imprimir
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderDetails(true)
                          }}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Detalhes
                        </Button>

                        <Select
                          value={order.status}
                          onValueChange={(newStatus) => updateOrderStatus(order.orderNumber, newStatus)}
                        >
                          <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Preparando">Preparando</SelectItem>
                            <SelectItem value="Enviado">Enviado</SelectItem>
                            <SelectItem value="Entregue">Entregue</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Detalhes do Pedido #{selectedOrder.orderNumber}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrintOrder(selectedOrder)}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold mb-2">Informações do Cliente</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>
                    <span className="font-medium">Nome:</span> {selectedOrder.customer.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {selectedOrder.customer.email}
                  </p>
                  <p>
                    <span className="font-medium">Telefone:</span> {selectedOrder.customer.phone}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="font-semibold mb-2">Endereço de Entrega</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{selectedOrder.deliveryAddress}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                <div className="border rounded-lg overflow-x-auto">
                  <div className="min-w-full">
                    {/* Desktop table view */}
                    <div className="hidden md:block">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3">Produto</th>
                            <th className="text-center p-3">Quantidade</th>
                            <th className="text-right p-3">Preço Unit.</th>
                            <th className="text-right p-3">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3">
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                                </div>
                              </td>
                              <td className="p-3 text-center">{formatWeight(item.quantity)}</td>
                              <td className="p-3 text-right">{formatPrice(item.price)}</td>
                              <td className="p-3 text-right font-medium">{formatPrice(item.price * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile card view */}
                    <div className="md:hidden space-y-3 p-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="bg-white border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                              <p className="text-sm text-gray-600">Subtotal</p>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Quantidade: {formatWeight(item.quantity)}</span>
                            <span>Preço Unit.: {formatPrice(item.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="font-semibold mb-2">Resumo do Pedido</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Status:</span>
                    <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Método de Pagamento:</span>
                    <span className="font-medium">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    {/* <div className="flex justify-between items-center">
                      <span>Taxa de Frete:</span>
                      <span className="font-medium">
                        {selectedOrder.deliveryFee !== undefined
                          ? selectedOrder.deliveryFee === 0
                            ? "Grátis"
                            : formatPrice(selectedOrder.deliveryFee)
                          : "Não definido"}
                      </span>
                    </div> */}

                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-lg font-bold text-green-600">{formatPrice(selectedOrder.total)} 
                          <span className="text-lg ml-2 text-gray-600">(já inclui taxa de entrega)</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
