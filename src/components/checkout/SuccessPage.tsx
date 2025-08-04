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
  orderNumber:  string
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
    const data = await getUserOrders();
    return {
      orderNumber: data.orders[0]?.orderNumber,
      formaPagamento: data.orders[0]?.paymentMethod || formaPagamento,
      tipoEntrega: tipoEntrega,
      total: data.orders[0]?.total || total,
      estimatedDelivery: data.orders[0]?.estimatedDelivery || null,
    }
  }

  getUserOrder().then((userOrder) => {
    setUserOrder(userOrder);
  });
}, []);
  console.log("SuccessPage renderizada com:", { formaPagamento, tipoEntrega, total }) // Debug log

  const getPaymentIcon = () => {
    switch (tipoEntrega) {
      case "dinheiro":
        return <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
      case "credito":
        return <CreditCard className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
      case "debito":
        return <Banknote className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
      case "vr":
        return <Smartphone className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
      default:
        return <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
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
    <div className="fixed inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 flex items-center justify-center p-4 z-[9999]">
      {/* Mobile Design */}
      <div className="lg:hidden w-full max-w-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-6 text-center">
              {/* Success Animation */}
              <motion.div
                className="relative mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle className="h-10 w-10 text-white animate-pulse" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Gift className="h-3 w-3 text-white" />
                </motion.div>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <h2 className="text-2xl font-bold mb-3 text-green-600">Pedido Confirmado!</h2>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Seu pedido foi recebido com sucesso e já está sendo preparado com todo carinho.
                </p>
              </motion.div>

              {/* Order Details */}
              <motion.div
                className="space-y-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm">
                  <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800 text-sm">Número do Pedido</p>
                  <p className="text-lg font-bold text-blue-600">{userOrder.orderNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-xl shadow-sm">
                    <Timer className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <p className="font-semibold text-gray-800 text-xs">Tempo Estimado</p>
                    <p className="text-sm font-bold text-orange-600">{userOrder.estimatedDelivery === null ? "Indefinido" : userOrder.estimatedDelivery.toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-3 rounded-xl shadow-sm">
                    <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="font-semibold text-gray-800 text-xs">Total</p>
                    <p className="text-sm font-bold text-green-600">R$ {total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-violet-100 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-center mb-2">{getPaymentIcon()}</div>
                  <p className="font-semibold text-gray-800 text-sm">Pagamento</p>
                  <p className="text-sm font-bold text-purple-600">{getPaymentLabel()}</p>
                  <p className="text-xs text-purple-700">Na entrega</p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  onClick={onNewOrder}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Fazer Novo Pedido
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 py-2 rounded-xl transition-all duration-300 bg-transparent"
                  >
                    <Star className="h-4 w-4 mr-1" />
                    <span className="text-xs">Avaliar</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 py-2 rounded-xl transition-all duration-300 bg-transparent"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Suporte</span>
                  </Button>
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                className="grid grid-cols-2 gap-2 mt-6 pt-6 border-t border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <div className="text-center p-3 bg-blue-50 rounded-lg shadow-sm">
                  <Shield className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-blue-800 font-medium">Compra Protegida</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg shadow-sm">
                  <Truck className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-purple-800 font-medium">Entrega Rápida</p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Desktop Design */}
      <div className="hidden lg:block w-full max-w-2xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
            <CardContent className="text-center p-8">
              {/* Success Animation */}
              <motion.div
                className="relative mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle className="h-16 w-16 text-white animate-pulse" />
                </div>
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Gift className="h-5 w-5 text-white" />
                </motion.div>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <h2 className="text-4xl font-bold mb-4 text-green-600">Pedido Confirmado!</h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed px-4">
                  Seu pedido foi recebido com sucesso e já está sendo preparado com todo carinho. Agradecemos pela
                  confiança.
                </p>
              </motion.div>

              {/* Order Details */}
              <motion.div
                className="grid grid-cols-2 gap-6 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg">
                  <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800 text-base">Número do Pedido</p>
                  <p className="text-2xl font-bold text-blue-600">{userOrder.orderNumber}</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg">
                  <Timer className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800 text-base">Tempo Estimado</p>
                  <p className="text-2xl font-bold text-orange-600">{userOrder.estimatedDelivery === null ? "Indefinido" : userOrder.estimatedDelivery.toLocaleDateString("pt-BR")}</p>
                </div>
              </motion.div>

              {/* Payment & Total Info */}
              <motion.div
                className="grid grid-cols-2 gap-6 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="bg-gradient-to-r from-purple-50 to-violet-100 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-center mb-2">{getPaymentIcon()}</div>
                  <p className="font-semibold text-gray-800 text-base">Forma de Pagamento</p>
                  <p className="text-lg font-bold text-purple-600">{getPaymentLabel()}</p>
                  <p className="text-sm text-purple-700">Na entrega</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-xl shadow-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800 text-base">Total a Pagar</p>
                  <p className="text-2xl font-bold text-green-600">R$ {total.toFixed(2)}</p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <Button
                  onClick={onNewOrder}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Gift className="h-5 w-5 mr-2" />
                  Fazer Novo Pedido
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 py-3 rounded-xl transition-all duration-300 bg-transparent"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Avaliar Experiência
                </Button>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <div className="text-center p-4 bg-blue-50 rounded-lg shadow-sm">
                  <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-800 font-medium">Compra Protegida</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg shadow-sm">
                  <Truck className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-800 font-medium">Entrega Rápida</p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
