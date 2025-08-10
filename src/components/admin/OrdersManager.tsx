"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  Loader2,
  RefreshCw,
  Eye,
  Edit,
  X,
  Save,
  Package2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getAllOrders, updateOrderStatusByOrderNumber } from "@/app/actions/order/orders"
import { toast } from "sonner"

// Interface corrigida para corresponder ao retorno da action
interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: {
    id: string
    name: string
    quantity: number
    price: number
    category: string
  }[]
  total: number
  status: string
  paymentMethod: string
  paymentStatus: string
  deliveryAddress: string | null
  date: Date
  createdAt: string
  estimatedDelivery: Date | null
  deliveryDate: Date | null
  trackingCode: string | null
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const statusOptions = [
    { value: "all", label: "Todos os Status", color: "bg-gray-100 text-gray-800" },
    { value: "Preparando", label: "Preparando", color: "bg-yellow-100 text-yellow-800" },
    { value: "Enviado", label: "Enviado", color: "bg-blue-100 text-blue-800" },
    { value: "Entregue", label: "Entregue", color: "bg-green-100 text-green-800" },
    { value: "Cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
  ]

  const loadOrders = async () => {
    try {
      const result = await getAllOrders()
      if (result.success) {
        setOrders(result.orders)
        setFilteredOrders(result.orders)
      } else {
        toast.error("Erro ao carregar pedidos")
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
      toast.error("Erro ao carregar pedidos")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadOrders()
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder({ ...order })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingOrder) return

    try {
      const result = await updateOrderStatusByOrderNumber(editingOrder.orderNumber, editingOrder.status)
      if (result.success) {
        setOrders((prev) => prev.map((order) => (order.id === editingOrder.id ? editingOrder : order)))
        setShowEditModal(false)
        setEditingOrder(null)
        toast.success("Pedido atualizado com sucesso!")
      } else {
        toast.error(result.message || "Erro ao atualizar pedido")
      }
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error)
      toast.error("Erro ao atualizar pedido")
    }
  }

  const toggleCardExpansion = (orderId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((option) => option.value === status)
    return statusOption?.color || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Preparando":
        return <Clock className="h-4 w-4" />
      case "Enviado":
        return <Truck className="h-4 w-4" />
      case "Entregue":
        return <CheckCircle className="h-4 w-4" />
      case "Cancelado":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    hover: {
      y: -5,
      scale: 1.02,
    },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 mx-auto mb-4 text-red-600" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Carregando pedidos...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6 p-4 sm:p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gerenciar Pedidos</h2>
          <p className="text-sm sm:text-base text-gray-600">Visualize e gerencie todos os pedidos do sistema</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
            >
              {isRefreshing ? <Loader2 className="h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            </motion.div>
            Atualizar
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {statusOptions.slice(1).map((status, index) => {
          const count = orders.filter((order) => order.status === status.value).length
          return (
            <motion.div
              key={status.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="cursor-pointer"
              onClick={() => setStatusFilter(statusFilter === status.value ? "all" : status.value)}
            >
              <Card
                className={`border-l-4 ${
                  statusFilter === status.value ? "border-l-red-500 bg-red-50" : "border-l-gray-200"
                } hover:shadow-md transition-all duration-200`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">{status.label}</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${status.color}`}>{getStatusIcon(status.value)}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por ID, número do pedido, nome ou email do cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="w-full lg:w-64">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-red-500">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
              layout
            >
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-lg font-bold text-gray-900">#{order.orderNumber}</CardTitle>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 text-xs`}>
                        {getStatusIcon(order.status)}
                        <span className="hidden sm:inline">{order.status}</span>
                      </Badge>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {/* Customer Info */}
                  <div className="space-y-2">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span className="font-medium truncate">{order.customer.name}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{order.customer.phone}</span>
                    </div>
                    <div className="flex items-start text-xs sm:text-sm text-gray-600">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-3">{order.deliveryAddress || "Endereço não informado"}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-xs sm:text-sm text-gray-900">Itens do Pedido</h4>
                      <motion.button
                        onClick={() => toggleCardExpansion(order.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedCards.has(order.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </motion.button>
                    </div>
                    <AnimatePresence>
                      <div className="space-y-1">
                        {order.items.slice(0, expandedCards.has(order.id) ? order.items.length : 2).map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between text-xs text-gray-600"
                          >
                            <span className="truncate mr-2">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                          </motion.div>
                        ))}
                        {!expandedCards.has(order.id) && order.items.length > 2 && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-500">
                            +{order.items.length - 2} itens...
                          </motion.p>
                        )}
                      </div>
                    </AnimatePresence>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="font-bold text-green-600">R$ {order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="truncate">{order.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Pedido: {order.createdAt}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderDetails(true)
                        }}
                        className="w-full bg-transparent hover:bg-gray-50 transition-all duration-200"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Ver</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditOrder(order)}
                        className="w-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Editar</span>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && !isLoading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== "all"
              ? "Tente ajustar os filtros de busca"
              : "Ainda não há pedidos no sistema"}
          </p>
        </motion.div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowOrderDetails(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Header com gradiente */}
              <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">#{selectedOrder.orderNumber}</h3>
                      <p className="text-red-100">Detalhes do Pedido</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowOrderDetails(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <Badge className={`${getStatusColor(selectedOrder.status)} text-sm px-3 py-1`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2">{selectedOrder.status}</span>
                  </Badge>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
                <div className="p-6 space-y-8">
                  {/* Status Timeline */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="font-bold text-lg mb-4 text-gray-900">Status do Pedido</h4>
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        {["Preparando", "Enviado", "Entregue"].map((status, index) => {
                          const isActive = statusOptions.findIndex((s) => s.value === selectedOrder.status) >= index + 1
                          const isCurrent = selectedOrder.status === status

                          return (
                            <div key={status} className="flex flex-col items-center relative">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                  isActive || isCurrent
                                    ? "bg-red-600 border-red-600 text-white"
                                    : "bg-gray-200 border-gray-300 text-gray-500"
                                }`}
                              >
                                {getStatusIcon(status)}
                              </motion.div>
                              <span
                                className={`text-xs mt-2 text-center max-w-16 ${
                                  isActive || isCurrent ? "text-red-600 font-medium" : "text-gray-500"
                                }`}
                              >
                                {status}
                              </span>
                              {index < 2 && (
                                <div
                                  className={`absolute top-5 left-10 w-full h-0.5 ${
                                    isActive ? "bg-red-600" : "bg-gray-300"
                                  }`}
                                  style={{ width: "100px" }}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Customer Details */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <h4 className="font-bold text-lg text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        Cliente
                      </h4>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {selectedOrder.customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center text-sm">
                                  <User className="h-4 w-4 mr-2 text-gray-500" />
                                  <span className="font-medium">{selectedOrder.customer.name}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>{selectedOrder.customer.phone}</span>
                                </div>
                                <div className="flex items-start text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="break-words">
                                    {selectedOrder.deliveryAddress || "Endereço não informado"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <h4 className="font-bold text-lg text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        Resumo
                      </h4>

                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Total do Pedido:</span>
                            <span className="font-bold text-2xl text-green-600">
                              R$ {selectedOrder.total.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-gray-600">Método de Pagamento:</span>
                            <Badge variant="outline" className="font-medium">
                              <CreditCard className="h-3 w-3 mr-1" />
                              {selectedOrder.paymentMethod}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-gray-600">Status do Pagamento:</span>
                            <Badge variant="outline" className="font-medium">
                              {selectedOrder.paymentStatus}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-gray-600">Data do Pedido:</span>
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              {selectedOrder.createdAt}
                            </div>
                          </div>
                          {selectedOrder.estimatedDelivery && (
                            <div className="flex justify-between items-center py-1">
                              <span className="text-gray-600">Previsão de Entrega:</span>
                              <div className="flex items-center text-sm">
                                <Truck className="h-4 w-4 mr-1 text-gray-500" />
                                {new Date(selectedOrder.estimatedDelivery).toLocaleDateString("pt-BR")}
                              </div>
                            </div>
                          )}
                          {selectedOrder.trackingCode && (
                            <div className="flex justify-between items-center py-1">
                              <span className="text-gray-600">Código de Rastreamento:</span>
                              <span className="font-mono text-sm">{selectedOrder.trackingCode}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Order Items */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="font-bold text-lg mb-4 text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        <Package2 className="h-5 w-5 text-orange-600" />
                      </div>
                      Itens do Pedido ({selectedOrder.items.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedOrder.items.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-all duration-200">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                  <Package2 className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-900">{item.name}</h5>
                                  <p className="text-xs text-gray-500">{item.category}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-gray-600">Qtd: {item.quantity}</span>
                                    <span className="font-bold text-green-600">
                                      R$ {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Order Modal */}
      <AnimatePresence>
        {showEditModal && editingOrder && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg sm:text-xl font-bold flex items-center">
                    <Edit className="h-5 w-5 mr-2" />
                    Editar Pedido #{editingOrder.orderNumber}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Status Update */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status do Pedido
                    </Label>
                    <Select
                      value={editingOrder.status}
                      onValueChange={(value) => setEditingOrder((prev) => (prev ? { ...prev, status: value } : null))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.slice(1).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              {getStatusIcon(option.value)}
                              <span className="ml-2">{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Customer Information (Read-only) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label className="text-sm font-medium">Informações do Cliente</Label>
                    <div className="mt-2 bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <div>
                        <strong>Nome:</strong> {editingOrder.customer.name}
                      </div>
                      <div>
                        <strong>Email:</strong> {editingOrder.customer.email}
                      </div>
                      <div>
                        <strong>Telefone:</strong> {editingOrder.customer.phone}
                      </div>
                      <div>
                        <strong>Endereço:</strong>
                        <div className="mt-1 break-words">
                          {editingOrder.deliveryAddress || "Endereço não informado"}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Order Items (Read-only) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label className="text-sm font-medium">Itens do Pedido</Label>
                    <div className="mt-2 space-y-2">
                      {editingOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-gray-600">Quantidade: {item.quantity}</div>
                          </div>
                          <div className="font-bold text-green-600">R$ {(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Order Summary (Read-only) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label className="text-sm font-medium">Resumo</Label>
                    <div className="mt-2 bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold text-green-600">R$ {editingOrder.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pagamento:</span>
                        <span>{editingOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data:</span>
                        <span>{editingOrder.createdAt}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-3 pt-4"
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button variant="outline" onClick={() => setShowEditModal(false)} className="w-full">
                        Cancelar
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button onClick={handleSaveEdit} className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default OrdersManager
