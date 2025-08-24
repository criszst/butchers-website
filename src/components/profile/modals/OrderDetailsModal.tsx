"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  X,
  User,
  Phone,
  MapPin,
  DollarSign,
  CreditCard,
  Calendar,
  Truck,
  Package2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import type { Order, OrderItem } from "@/generated/prisma"
import { cancelOrder } from "@/app/actions/order/orders"
import { useDeliveryFee } from "@/app/hooks/useDeliveryFee"
import { getStoreSettings, type StoreSettingsData } from "@/app/actions/store-settings"

interface OrderDetailModalProps {
  order: (Order & { items: OrderItem[]; user?: { name?: string; phone?: string } }) | null
  isOpen: boolean
  onClose: () => void
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 50 },
}

const statusSteps = [
  { key: "Preparando", label: "Preparando", icon: Package },
  { key: "Enviado", label: "Enviado", icon: Truck },
  { key: "Entregue", label: "Entregue", icon: CheckCircle },
]

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [storeSettings, setStoreSettings] = useState<StoreSettingsData | null>(null)

  useEffect(() => {
    if (order) {
      const stepIndex = statusSteps.findIndex((step) => step.key === order.status)
      setCurrentStep(stepIndex >= 0 ? stepIndex : 0)
    }
  }, [order])

  useEffect(() => {
    const loadStoreSettings = async () => {
      try {
        const result = await getStoreSettings()
        if (result.success && result.settings) {
          setStoreSettings(result.settings)
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
      }
    }
    loadStoreSettings()
  }, [])

  const deliveryCalculation = useDeliveryFee({
    orderTotal: order ? order.total - (order.deliveryFee || 0) : 0,
    deliveryMethod: order?.paymentMethod === "pickupOrder" ? "pickup" : "delivery",
    storeSettings: storeSettings
      ? {
          deliveryFee: storeSettings.deliveryFee || 10.0,
          freeDeliveryMinimum: storeSettings.freeDeliveryMinimum || 150.0,
        }
      : undefined,
  })

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "entregue":
        return <CheckCircle className="h-4 w-4" />
      case "enviado":
        return <Truck className="h-4 w-4" />
      case "preparando":
        return <Package className="h-4 w-4" />
      case "cancelado":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      case "Estornado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatQuantity = (quantity: number) => {
    return quantity !== null && quantity < 1
      ? `${quantity.toFixed(3).replace(quantity.toString()[0], "").replace(".", "")} gramas`
      : `${quantity} kilo`
  }

  const replaceOrderMethod = (method: string) => {
    const methods = {
      ["pickupOrder"]: "Pagamento na Retirada",
      ["vr"]: "Vale Refeição",
      ["va"]: "Vale Alimentação",
      ["debito"]: "Cartão de Débito",
      ["credito"]: "Cartão de Crédito",
      ["dinheiro"]: "Dinheiro",
    }

    return methods[method] || "Não informado"
  }

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2)}`
  }

  if (!order) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
          exit="exit"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Package className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-2xl font-bold">
                      Pedido #{order.orderNumber || order.id.toString().padStart(4, "0")}
                    </h3>
                    <p className="text-orange-100 text-sm md:text-base">Detalhes do Pedido</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </motion.button>
              </div>

              {/* Status Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2">{order.status}</span>
                </Badge>
                <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-sm px-3 py-1`}>
                  <CreditCard className="h-3 w-3 mr-1" />
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] md:max-h-[calc(90vh-160px)]">
              <div className="p-4 md:p-6 space-y-6 md:space-y-8">
                {/* Status Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 rounded-xl p-4 md:p-6"
                >
                  <h4 className="font-bold text-lg mb-4 md:mb-6 text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    Status do Pedido
                  </h4>

                  <div className="relative">
                    {/* Mobile Timeline */}
                    <div className="block md:hidden space-y-4">
                      {order.status === "Cancelado" ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-300 text-gray-500">
                            <X className="h-4 w-4" />
                          </div>
                          <span className="text-sm text-gray-500">Cancelado</span>
                        </div>
                      ) : (
                        statusSteps.map((step, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-300 text-gray-500">
                              <step.icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm text-gray-500">{step.label}</span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Desktop Timeline */}
                    <div className="hidden md:flex items-center justify-between">
                      {statusSteps.map((step, index) => {
                        const isActive = index <= currentStep
                        const isCurrent = index === currentStep
                        const Icon = step.icon

                        return (
                          <div key={step.key} className="flex flex-col items-center relative">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                isActive
                                  ? "bg-gradient-to-r from-orange-500 to-red-500 border-orange-500 text-white shadow-lg"
                                  : "bg-gray-200 border-gray-300 text-gray-500"
                              } ${isCurrent ? "ring-4 ring-orange-200" : ""}`}
                            >
                              <Icon className="h-5 w-5" />
                            </motion.div>
                            <span
                              className={`text-sm mt-2 text-center max-w-20 ${
                                isActive ? "text-orange-600 font-medium" : "text-gray-500"
                              }`}
                            >
                              {step.label}
                            </span>
                            {index < statusSteps.length - 1 && (
                              <div
                                className={`absolute top-6 left-12 h-0.5 transition-all duration-300 ${
                                  isActive ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gray-300"
                                }`}
                                style={{ width: "calc(100% + 2rem)" }}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>

                <div className="grid lg:grid-cols-1 gap-6 md:gap-8">
                  {window.location.pathname.includes("/perfil") ? (
                    <></>
                  ) : (
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
                        Informações do Cliente
                      </h4>

                      <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {order.user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 space-y-3 min-w-0">
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                <span className="font-medium truncate">{order.user?.name || "Cliente"}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                <span className="truncate">{order.user?.phone || "Não informado"}</span>
                              </div>
                              <div className="flex items-start text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <div className="font-medium mb-1 break-words">
                                    {order.deliveryAddress || "Endereço de entrega"}
                                  </div>
                                  {order.trackingCode && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Código de rastreamento: {order.trackingCode}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                  {/* Customer Details */}

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
                      Resumo do Pedido
                    </h4>

                    <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                      <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Subtotal dos Produtos:</span>
                          <span className="font-medium">R$ {(order.total - (order.deliveryFee || 0)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Taxa de Entrega:</span>
                          <div className="text-right">
                            {deliveryCalculation.isFree ? (
                              <span className="text-green-600 font-medium">Grátis</span>
                            ) : (
                              <span className="font-medium">{formatPrice(deliveryCalculation.fee)}</span>
                            )}
                            {deliveryCalculation.reason && (
                              <p className="text-xs text-teal-600 mt-1">{deliveryCalculation.reason}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <span className="text-gray-600">Total do Pedido:</span>
                          <span className="font-bold text-xl md:text-2xl text-green-600">
                            R$ {order.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 text-sm">Método de Pagamento:</span>
                          <Badge variant="outline" className="font-medium">
                            <CreditCard className="h-3 w-3 mr-1" />
                            {replaceOrderMethod(order.paymentMethod)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 text-sm">Data do Pedido:</span>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            {new Date(order.date).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        {order.estimatedDelivery && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 text-sm">Previsão de Entrega:</span>
                            <div className="flex items-center text-sm">
                              <Truck className="h-4 w-4 mr-1 text-gray-500" />
                              {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        )}
                        {order.deliveryDate && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 text-sm">Data de Entrega:</span>
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                              {new Date(order.deliveryDate).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        )}
                        {order.paymentDate && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 text-sm">Data do Pagamento:</span>
                            <div className="flex items-center text-sm">
                              <CreditCard className="h-4 w-4 mr-1 text-green-500" />
                              {new Date(order.paymentDate).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Order Items */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h4 className="font-bold text-lg mb-4 md:mb-6 text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <Package2 className="h-5 w-5 text-orange-600" />
                    </div>
                    Itens do Pedido ({order.items?.length || 0})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items?.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                      >
                        <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-orange-500">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package2 className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-gray-900 truncate">{item.name}</h5>
                                <p className="text-xs text-gray-500 truncate">{item.category}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sm text-gray-600">
                                    Comprou: {formatQuantity(item.quantity)}
                                  </span>
                                  <div className="text-right">
                                    <div className="text-xs text-gray-500"> R$ {item.price}</div>
                                    <div className="font-bold text-green-600">
                                      R$ {(item.price * item.quantity).toFixed(2)} por {formatQuantity(item.quantity)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )) || (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <Package2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Nenhum item encontrado neste pedido.</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200"
                >
                  <Button
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Fechar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
                    onClick={() => window.print()}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Imprimir Pedido
                  </Button>
                  {order.status !== "Entregue" && order.status !== "Cancelado" && (
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                      onClick={() => {
                        cancelOrder(order.id)
                      }}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Cancelar Pedido
                    </Button>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
