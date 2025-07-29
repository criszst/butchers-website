"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart/context"
import {
  Package,
  Truck,
  Clock,
  Shield,
  CheckCircle,
  Phone,
  ArrowLeft,
  CreditCard,
  DollarSign,
  Banknote,
  Smartphone,
} from "lucide-react"
import Image from "next/image"

interface OrderSummaryProps {
  tipoEntrega: string
  onFinalizarPedido: () => void
  isFormValid: boolean
  isProcessing: boolean
  onBackToCart: () => void
  total: number
}

export const OrderSummary = ({
  tipoEntrega,
  onFinalizarPedido,
  isFormValid,
  isProcessing,
  onBackToCart,
  total,
}: OrderSummaryProps) => {
  const { items, total: cartTotal, itemCount } = useCart()
  const subtotal = cartTotal
  const taxaEntrega = subtotal > 50 ? 0 : 8.9

  const getPaymentIcon = () => {
    switch (tipoEntrega) {
      case "dinheiro":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "credito":
        return <CreditCard className="h-4 w-4 text-blue-600" />
      case "debito":
        return <Banknote className="h-4 w-4 text-purple-600" />
      case "vr":
        return <Smartphone className="h-4 w-4 text-orange-600" />
      default:
        return <DollarSign className="h-4 w-4 text-green-600" />
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
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden sticky top-4 lg:top-24">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg lg:text-xl text-gray-800 font-bold">Resumo do Pedido</span>
          <Badge className="ml-auto bg-orange-100 text-orange-800 border-orange-300 font-semibold">
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Products List */}
        <div className="space-y-3 max-h-48 lg:max-h-64 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300 animate-in slide-in-from-right"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative flex-shrink-0">
                <Image
                  src={item.product.image || "/placeholder.svg?height=50&width=50"}
                  alt={item.product.name}
                  width={50}
                  height={50}
                  className="rounded-lg object-cover shadow-sm"
                />
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-600">
                  {item.quantity}kg × R$ {item.product.price.toFixed(2)}
                </p>
              </div>
              <span className="font-bold text-green-600 text-sm">
                R$ {(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Payment Method Selected */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            {getPaymentIcon()}
            <div>
              <p className="font-semibold text-blue-800 text-sm">Forma de Pagamento</p>
              <p className="text-blue-700 text-xs">{getPaymentLabel()} na entrega</p>
            </div>
          </div>
        </div>

        {/* Price Calculations */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span className="text-gray-700 text-sm lg:text-base">Subtotal</span>
            <span className="font-semibold text-gray-800">R$ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span className="text-gray-700 flex items-center space-x-2 text-sm lg:text-base">
              <Truck className="h-4 w-4" />
              <span>Taxa de Entrega</span>
            </span>
            <span className={`font-semibold ${taxaEntrega === 0 ? "text-green-600" : "text-gray-800"}`}>
              {taxaEntrega === 0 ? (
                <span className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Grátis</span>
                </span>
              ) : (
                `R$ ${taxaEntrega.toFixed(2)}`
              )}
            </span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-sm">
          <span className="font-bold text-lg lg:text-xl text-gray-800">Total</span>
          <span className="font-bold text-xl lg:text-2xl text-green-600">R$ {total.toFixed(2)}</span>
        </div>

        {/* Delivery Time */}
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-800 text-sm lg:text-base">Entrega Expressa</p>
            <p className="text-blue-600 text-xs lg:text-sm">45-60 minutos</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className={`w-full font-bold py-3 lg:py-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 ${
              isFormValid
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-105 text-white"
                : "bg-gray-400 cursor-not-allowed text-gray-600"
            }`}
            size="lg"
            onClick={onFinalizarPedido}
            disabled={!isFormValid || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                <span>Processando...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4 lg:h-5 lg:w-5" />
                <span>Confirmar Pedido</span>
                <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />
              </div>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onBackToCart}
            className="w-full border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 py-2 lg:py-3 rounded-xl transition-all duration-300 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Carrinho
          </Button>
        </div>


      </CardContent>
    </Card>
  )
}
