"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
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
  Phone,
  MoreVertical,
  RefreshCw,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getAllOrders, updateOrderStatus } from "@/app/actions/order/orders"
import { toast } from "sonner"
import type { Order, OrderItem, User as PrismaUser } from "@/generated/prisma"

interface OrderWithDetails extends Order {
  user: Pick<PrismaUser, "name" | "email" | "phone">
  items: OrderItem[]
}

export default function OrdersManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null)

  const statusOptions = [
    { value: "Confirmado", label: "Confirmado", color: "bg-blue-100 text-blue-800" },
    { value: "Preparando", label: "Preparando", color: "bg-yellow-100 text-yellow-800" },
    { value: "A caminho", label: "A caminho", color: "bg-purple-100 text-purple-800" },
    { value: "Entregue", label: "Entregue", color: "bg-green-100 text-green-800" },
    { value: "Cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
  ]

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const result = await getAllOrders()
      if (result.success) {
        setOrders(result.orders as OrderWithDetails[])
      } else {
        toast.error("Erro ao carregar pedidos")
      }
    } catch (error) {
      toast.error("Erro ao carregar pedidos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

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
      order.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleViewOrder = (order: OrderWithDetails) => {
    setSelectedOrder(order)
    setIsOrderDetailOpen(true)
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(orderId)
    try {
      const result = await updateOrderStatus(orderId, newStatus)
      if (result.success) {
        toast.success("Status atualizado com sucesso!")
        await fetchOrders() // Refresh orders
      } else {
        toast.error(result.message || "Erro ao atualizar status")
      }
    } catch (error) {
      toast.error("Erro ao atualizar status")
    } finally {
      setIsUpdatingStatus(null)
    }
  }

  // Mobile Order Card Component
  const OrderCard = ({ order }: { order: OrderWithDetails }) => (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
              <p className="text-sm text-gray-600">{order.user.name}</p>
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
            <span className="text-sm text-gray-600">Data:</span>
            <span className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-48" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Gerenciar Pedidos</h2>
          <p className="text-sm lg:text-base text-gray-600">Acompanhe e gerencie todos os pedidos</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" className="bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
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
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600">Não há pedidos que correspondam aos filtros selecionados.</p>
            </div>
          ) : (
            <>
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
                              <p className="font-medium text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                              <p className="text-sm text-gray-600">{order.items.length} itens</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{order.user.name}</p>
                            <p className="text-sm text-gray-600">{order.user.email}</p>
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
                              disabled={isUpdatingStatus === order.id}
                            >
                              <SelectTrigger className="w-32">
                                <div className="flex items-center space-x-2">
                                  {isUpdatingStatus === order.id ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : (
                                    getStatusIcon(order.status)
                                  )}
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
                          <div>
                            <p className="text-sm text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
                            </p>
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{selectedOrder?.id.slice(-8).toUpperCase()}</DialogTitle>
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
                    <span className="text-sm lg:text-base">{selectedOrder.user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm lg:text-base">{selectedOrder.user.email}</span>
                  </div>
                  {selectedOrder.user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm lg:text-base">{selectedOrder.user.phone}</span>
                    </div>
                  )}
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
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm lg:text-base">{item.name}</p>
                          <p className="text-xs lg:text-sm text-gray-600">
                            Quantidade: {item.quantity} • Categoria: {item.category}
                          </p>
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
                    Status e Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-base">Status atual:</span>
                    <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-base">Data do pedido:</span>
                    <span className="text-sm lg:text-base">
                      {new Date(selectedOrder.createdAt).toLocaleString("pt-BR")}
                    </span>
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
