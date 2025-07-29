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
  Phone,
  Truck,
  DollarSign,
  CreditCard,
  Banknote,
  Smartphone,
  Gift,
} from "lucide-react"

interface SuccessPageProps {
  formaPagamento: string
  tipoEntrega: string
  total: number
  onNewOrder: () => void
}

export const SuccessPage = ({ formaPagamento, tipoEntrega, total, onNewOrder }: SuccessPageProps) => {
  const orderNumber = Math.floor(Math.random() * 10000)

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
    <div className="min-h-screen bg-gradient-to-br from-red-200 via-red-300 to-orange-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-xl overflow-hidden">
        <CardContent className="text-center p-6 ">
          {/* Success Animation */}
          <div className="relative mb-6 lg:mb-8">
            <div className="w-20 h-20 lg:w-32 lg:h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in duration-700">
              <CheckCircle className="h-10 w-10 lg:h-16 lg:w-16 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-8 h-8 lg:w-12 lg:h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Sparkles className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 w-6 h-6 lg:w-10 lg:h-10 bg-pink-400 rounded-full flex items-center justify-center animate-ping shadow-lg">
              <Gift className="h-3 w-3 lg:h-5 lg:w-5 text-white" />
            </div>
          </div>

          <h2 className="text-2xl lg:text-4xl font-bold mb-3 lg:mb-4 text-green-600">Pedido Confirmado!</h2>

          <p className="text-gray-600 mb-6 lg:mb-8 text-sm lg:text-lg leading-relaxed px-2 lg:px-4">
            Seu pedido foi recebido com sucesso e já está sendo preparado com todo carinho. Você receberá atualizações
            em tempo real via WhatsApp.
          </p>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 lg:p-6 rounded-xl shadow-lg">
              <Package className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-800 text-sm lg:text-base">Número do Pedido</p>
              <p className="text-lg lg:text-2xl font-bold text-blue-600">#CD{orderNumber}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 lg:p-6 rounded-xl shadow-lg">
              <Timer className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-800 text-sm lg:text-base">Tempo Estimado</p>
              <p className="text-lg lg:text-2xl font-bold text-orange-600">45-60 min</p>
            </div>
          </div>

          {/* Payment & Total Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-violet-100 p-4 lg:p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-2">{getPaymentIcon()}</div>
              <p className="font-semibold text-gray-800 text-sm lg:text-base">Forma de Pagamento</p>
              <p className="text-sm lg:text-lg font-bold text-purple-600">{getPaymentLabel()}</p>
              <p className="text-xs lg:text-sm text-purple-700">Na entrega</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 lg:p-6 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-800 text-sm lg:text-base">Total a Pagar</p>
              <p className="text-lg lg:text-2xl font-bold text-green-600">R$ {total.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 lg:space-y-4">
            <Button
              onClick={onNewOrder}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 lg:py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Gift className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              Fazer Novo Pedido
            </Button>

            <Button
              variant="outline"
              className="w-full border-2 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 py-3 rounded-xl transition-all duration-300 bg-transparent"
            >
              <Star className="h-4 w-4 mr-2" />
              Avaliar Experiência
            </Button>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-gray-200">
            <div className="text-center p-3 lg:p-4 bg-blue-50 rounded-lg shadow-sm">
              <Shield className="h-4 w-4 lg:h-6 lg:w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs lg:text-sm text-blue-800 font-medium">Compra Protegida</p>
            </div>

            <div className="text-center p-3 lg:p-4 bg-purple-50 rounded-lg shadow-sm">
              <Truck className="h-4 w-4 lg:h-6 lg:w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs lg:text-sm text-purple-800 font-medium">Entrega Rápida</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
