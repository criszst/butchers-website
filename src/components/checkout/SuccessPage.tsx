"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Sparkles, Package, Timer, DollarSign, CreditCard, Banknote, Smartphone, Gift } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getUserOrders } from "@/app/actions/order/orders"
import { ImageError } from "next/dist/server/image-optimizer"

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
  items: Array<{
    name: string
    quantity: number // sempre em kg
    price: number
    category?: string
  }>
}

export default function SuccessPage({ formaPagamento, tipoEntrega, total, onNewOrder }: SuccessPageProps) {
  const [userOrder, setUserOrder] = useState<UserOrder>({
    orderNumber: "",
    formaPagamento: formaPagamento,
    tipoEntrega: tipoEntrega,
    total: total,
    estimatedDelivery: null,
    items: [
      {
        name: "",
        quantity: 0,
        price: 0,
        category: "",
      },
    ],
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
        items: [
          ...data.orders[0]?.items.map((item: any) => ({
            name: item.name,
            quantity: Number(item.quantity.toFixed(3)), // sempre em kg
            price: Number(item.price),
            category: item.category || "",
          }))
        ],
      }

    }

    getUserOrder().then((order) => {
      setUserOrder(order)
    })
  }, [formaPagamento, tipoEntrega, total])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }


  const formatWeightDisplay = (quantity: number) => {
    if (quantity >= 1) {
      // Se for 1kg ou mais, mostra em kg
      return `${quantity.toFixed(quantity % 1 === 0 ? 0 : 3)}kg`
    } else {
      // Se for menos de 1kg, converte para gramas
      const grams = Math.round(quantity * 1000)
      return `${grams}g`
    }
  }
  // Função para calcular preço do item (baseado na lógica do sistema)
  const calculateItemTotal = (item: UserOrder["items"][0]) => {
    const price = Number(item.price)
    const quantity = Number(item.quantity)
    return price * quantity
  }


  const getPaymentIcon = () => {
    switch (formaPagamento) {
      case "dinheiro":
        return <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
      case "credito":
        return <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
      case "debito":
        return <Banknote className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
      case "vr":
        return <Smartphone className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
      default:
        return <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
    }
  }

  const getPaymentLabel = () => {
    switch (formaPagamento) {
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

  const formatDeliveryTime = () => {
    if (userOrder.estimatedDelivery) {
      return userOrder.estimatedDelivery.toLocaleDateString("pt-BR")
    }
    return "45-60 min"
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="w-full"
        >
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8 lg:p-12">
              {/* Success Animation */}
              <motion.div
                className="text-center mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 text-white animate-pulse" />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 w-6 h-6 md:w-8 md:h-8 bg-pink-400 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Gift className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </motion.div>
                </div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-green-600">Pedido Confirmado!</h2>
                  <p className="text-gray-600 mb-8 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
                    Seu pedido foi recebido with sucesso e já está sendo preparado com todo carinho. Agradecemos pela
                    confiança!
                  </p>
                </motion.div>
              </motion.div>

              {/* Order Details Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl shadow-sm">
                  <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800 text-sm md:text-base text-center">Número do Pedido</p>
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600 text-center">
                    {userOrder.orderNumber}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 rounded-xl shadow-sm">
                  <Timer className="h-6 w-6 md:h-8 md:w-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800 text-sm md:text-base text-center">Tempo Estimado</p>
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-orange-600 text-center">
                    {formatDeliveryTime()}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-violet-100 p-4 md:p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-center mb-2">{getPaymentIcon()}</div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base text-center">Pagamento</p>
                  <p className="text-sm md:text-base lg:text-lg font-bold text-purple-600 text-center">
                    {getPaymentLabel()}
                  </p>
                  <p className="text-xs md:text-sm text-purple-700 text-center">Na entrega</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 md:p-6 rounded-xl shadow-sm">
                  <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800 text-sm md:text-base text-center">Total</p>
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-green-600 text-center">
                    {formatPrice(userOrder.total)}
                  </p>
                </div>
              </motion.div>

              {/* Order Items */}
              {userOrder.items && userOrder.items.length > 0 && (
                <motion.div
                  className="mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Itens do Pedido</h3>
                  <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto">
                    {userOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm md:text-base">{item.name}</p>
                          <p className="text-sm text-gray-600 font-semibold">
                            {formatWeightDisplay(Number(item.quantity))}
                          </p>

                          {item.category && (
                            <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-green-600 text-sm md:text-base">
                            {formatPrice(calculateItemTotal(item))}
                          </p>

                        </div>
                      </div>
                    ))}
                    {/* Total dos itens */}
                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-300">
                      <p className="font-bold text-gray-900">Total dos Itens:</p>
                      <p className="font-bold text-green-600 text-lg">
                        {formatPrice(userOrder.total)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Success Message */}
              <motion.div
                className="text-center mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.85 }}
              >
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6">
                  <h4 className="font-bold text-green-800 mb-2">🎉 Obrigado pela sua compra!</h4>
                  <p className="text-green-700 text-sm md:text-base">
                    Você receberá atualizações sobre o status do seu pedido. Nosso time está preparando tudo com muito carinho!
                  </p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  onClick={onNewOrder}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-sm md:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Fazer Novo Pedido
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/perfil#pedidos'}
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-sm md:text-base font-semibold rounded-lg transition-all duration-300"
                >
                  Ver Meus Pedidos
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}