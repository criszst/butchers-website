"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  Eye,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Package,
  User,
  MapPin,
  Phone,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function OrdersManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)

  // Mock data
  const orders = [
    {
      id: "#1247",
      customer: {
        name: "João Silva",
        email: "joao@email.com",
        phone: "(11) 99999-9999",
        address: "Rua das Flores, 123 - Centro, Salto/SP",
      },
      items: [
        { name: "Picanha Premium", quantity: 1, price: 89.9 },
        { name: "Linguiça Artesanal", quantity: 2, price: 15.9 },
      ],
      total: 121.7,
      status: "Preparando",
      paymentMethod: "Cartão de Crédito",
      createdAt: "2024-01-15 14:30",
      estimatedDelivery: "2024-01-15 16:30",
    },
    {
      id: "#1246",
      customer: {
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "(11) 88888-8888",
        address: "Av. Paulista, 456 - Bela Vista, Salto/SP",
      },
      items: [
        { name: "Costela Bovina", quantity: 2, price: 45.9 },
        { name: "Carvão Premium", quantity: 1, price: 25.0 },
      ],
      total: 116.8,
      status: "Entregue",
      paymentMethod: "PIX",
      createdAt: "2024-01-15 12:15",
      estimatedDelivery: "2024-01-15 14:15",
    },
    {
      id: "#1245",
      customer: {
        name: "Pedro Costa",
        email: "pedro@email.com",
        phone: "(11) 77777-7777",
        address: "Rua do Comércio, 789 - Vila Nova, Salto/SP",
      },
      items: [
        { name: "Filé Mignon", quantity: 1, price: 120.0 },
        { name: "Cerveja Artesanal", quantity: 6, price: 12.5 },
      ],
      total: 195.0,
      status: "A caminho",
      paymentMethod: "Dinheiro",
      createdAt: "2024-01-15 10:00",
      estimatedDelivery: "2024-01-15 12:00",
    },
    {
      id: "#1244",
      customer: {
        name: "Ana Oliveira",
        email: "ana@email.com",
        phone: "(11) 66666-6666",
        address: "Rua da Paz, 321 - Jardim Europa, Salto/SP",
      },
      items: [
        { name: "Linguiça Artesanal", quantity: 3, price: 15.9 },
        { name: "Tempero Especial", quantity: 1, price: 8.9 },
      ],
      total: 56.6,
      status: "Confirmado",
      paymentMethod: "Cartão de Débito",
      createdAt: "2024-01-15 09:30",
      estimatedDelivery: "2024-01-15 11:30",
    },
  ]

  const statusOptions = [
    { value: "Confirmado", label: "Confirmado", color: "bg-blue-100 text-blue-800" },
    { value: "Preparando", label: "Preparando", color: "bg-yellow-100 text-yellow-800" },
    { value: "A caminho", label: "A caminho", color: "bg-purple-100 text-purple-800" },
    { value: "Entregue", label: "Entregue", color: "bg-green-100 text-green-800" },
    { value: "Cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((option) => option.value === status)
    return statusOption?.color || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmado":
        return <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
      case "Preparando":
        return <Package className="h-3 w-3 lg:h-4 lg:w-4" />
      case "A caminho":
        return <Truck className="h-3 w-3 lg:h-4 lg:w-4" />
      case "Entregue":
        return <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4" />
      default:
        return <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsOrderDetailOpen(true)
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status ${newStatus}`)
  }

  // Mobile Order Card Component
  const OrderCard = ({ order }: { order: any }) => (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-600">{order.customer.name}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="font-bold text-green-600">{formatCurrency(order.total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge className={`text-xs ${getStatusColor(order.status)}`}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(order.status)}
                <span>{order.status}</span>
              </div>
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pagamento:</span>
            <Badge variant="outline" className="text-xs">
              {order.paymentMethod}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Data:</span>
            <span className="text-sm text-gray-900">{order.createdAt.split(" ")[0]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Gerenciar Pedidos</h2>
          <p className="text-sm lg:text-base text-gray-600">Acompanhe e gerencie todos os pedidos</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por ID ou nome do cliente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Display */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center text-base lg:text-lg">
            <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
            Pedidos ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4">
                  <OrderCard order={order} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.items.length} itens</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-sm text-gray-600">{order.customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">{formatCurrency(order.total)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={order.status}
                          onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                        >
                          <SelectTrigger className="w-32">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(status.value)}
                                  <span>{status.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-gray-600">
                        {order.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900">{order.createdAt.split(" ")[0]}</p>
                        <p className="text-xs text-gray-600">{order.createdAt.split(" ")[1]}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogTitle className="text-lg font-semibold hidden">Detalhes do Pedido</DialogTitle>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 lg:space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base lg:text-lg">
                    <User className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Informações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm lg:text-base">{selectedOrder.customer.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm lg:text-base">{selectedOrder.customer.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm lg:text-base">{selectedOrder.customer.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base lg:text-lg">
                    <Package className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Itens do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm lg:text-base">{item.name}</p>
                          <p className="text-xs lg:text-sm text-gray-600">Quantidade: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm lg:text-base">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                    <div className="border-t pt-3 flex justify-between items-center">
                      <p className="font-semibold text-base lg:text-lg">Total:</p>
                      <p className="font-bold text-base lg:text-lg text-green-600">
                        {formatCurrency(selectedOrder.total)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base lg:text-lg">
                    <Clock className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Status e Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-base">Status atual:</span>
                    <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-base">Método de pagamento:</span>
                    <span className="text-sm lg:text-base">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-base">Previsão de entrega:</span>
                    <span className="text-sm lg:text-base">{selectedOrder.estimatedDelivery}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
