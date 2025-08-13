"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Sparkles,
  Package,
  Timer,
  Star,
  Shield,
  Truck,
  DollarSign,
  CreditCard,
  Banknote,
  Smartphone,
  Gift,
  Home,
  MessageCircle,
  ArrowRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getUserOrders } from "@/app/actions/order/orders"

interface SuccessPageProps {
  formaPagamento: string
  tipoEntrega: string
  total: number
  onNewOrder: () => void
}

interface UserOrder {
  orderNumber: string
  formaPagamento: string
  tipoEntrega: string
  total: number
  estimatedDelivery: Date | null
}

export const SuccessPage = ({ formaPagamento, tipoEntrega, total, onNewOrder }: SuccessPageProps) => {
  const [userOrder, setUserOrder] = useState<UserOrder>({
    orderNumber: "",
    formaPagamento: formaPagamento,
    tipoEntrega: tipoEntrega,
    total: total,
    estimatedDelivery: null,
  })

  useEffect(() => {
    const getUserOrder = async (): Promise<UserOrder> => {
      const data = await getUserOrders()
      return {
        orderNumber: data.orders[0]?.orderNumber || `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        formaPagamento: data.orders[0]?.paymentMethod || formaPagamento,
        tipoEntrega: tipoEntrega,
        total: data.orders[0]?.total || total,
        estimatedDelivery: data.orders[0]?.estimatedDelivery || null,
      }
    }

    getUserOrder().then((userOrder) => {
      setUserOrder(userOrder)
    })
  }, [formaPagamento, tipoEntrega, total])

  const getPaymentIcon = () => {
    switch (tipoEntrega) {
      case "dinheiro":
        return <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
      case "credito":
        return <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
      case "debito":
        return <Banknote className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
      case "vr":
        return <Smartphone className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
      default:
        return <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
    }
  }

  const getPaymentLabel = () => {
    switch (tipoEntrega) {
      case "dinheiro":
        return "Dinheiro"
      case "credito":
        return "Cartão de Crédito"
      case "debito":
        return "Cartão de Débito"
      case "vr":
        return "Vale Refeição/Alimentação"
      default:
        return "Dinheiro"
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto my-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
            <CardContent className="p-6 md:p-8 lg:p-12">
              {/* Success Animation */}
              <motion.div
                className="text-center mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </motion.div>
                </div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-green-600">Pedido Confirmado!</h1>
                  <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                    Seu pedido foi recebido com sucesso e já está sendo preparado com todo carinho.
                  </p>
                </motion.div>
              </motion.div>

              {/* Order Details Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Order Number */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl border border-blue-200">
                  <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-500 mx-auto mb-3" />
                  <p className="font-medium text-gray-700 text-xs md:text-sm mb-1">Número do Pedido</p>
                  <p className="text-lg md:text-xl font-bold text-blue-600">{userOrder.orderNumber}</p>
                </div>

                {/* Estimated Time */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 md:p-6 rounded-xl border border-orange-200">
                  <Timer className="h-6 w-6 md:h-8 md:w-8 text-orange-500 mx-auto mb-3" />
                  <p className="font-medium text-gray-700 text-xs md:text-sm mb-1">Tempo Estimado</p>
                  <p className="text-lg md:text-xl font-bold text-orange-600">45-60 min</p>
                </div>

                {/* Payment Method */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-6 rounded-xl border border-purple-200">
                  <div className="flex justify-center mb-3">{getPaymentIcon()}</div>
                  <p className="font-medium text-gray-700 text-xs md:text-sm mb-1">Pagamento</p>
                  <p className="text-sm md:text-base font-bold text-purple-600">{getPaymentLabel()}</p>
                  <p className="text-xs text-purple-500">Na entrega</p>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-xl border border-green-200">
                  <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-gray-700 text-xs md:text-sm mb-1">Total</p>
                  <p className="text-lg md:text-xl font-bold text-green-600">R$ {userOrder.total.toFixed(2)}</p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="space-y-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={onNewOrder}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 md:py-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                  >
                    <Home className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Fazer Novo Pedido
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 py-3 md:py-4 rounded-xl transition-all duration-200 bg-white"
                  >
                    <Star className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Avaliar Experiência
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 py-2 md:py-3 rounded-xl transition-all duration-200 bg-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Suporte ao Cliente
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 py-2 md:py-3 rounded-xl transition-all duration-200 bg-white"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Acompanhar Pedido
                  </Button>
                </div>
              </motion.div>

              {/* Security Info */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs md:text-sm text-blue-700 font-medium">Compra Protegida</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Truck className="h-4 w-4 md:h-5 md:w-5 text-green-500 mx-auto mb-2" />
                  <p className="text-xs md:text-sm text-green-700 font-medium">Entrega Rápida</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs md:text-sm text-purple-700 font-medium">Qualidade Garantida</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Gift className="h-4 w-4 md:h-5 md:w-5 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs md:text-sm text-orange-700 font-medium">Produtos Frescos</p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
