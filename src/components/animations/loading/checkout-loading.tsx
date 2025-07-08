"use client"

import { CreditCard } from "lucide-react"

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-green-600/20 rounded-full blur-2xl animate-pulse" />
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 border-3 border-green-200 rounded-full animate-spin" />
            <div className="bg-white rounded-full p-4 shadow-xl">
              <CreditCard className="h-8 w-8 text-green-600 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Processando Pedido</h2>
          <p className="text-gray-600">Finalizando sua compra...</p>
        </div>

        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-ping" />
            <span>Validando pagamento</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
            <span>Confirmando pedido</span>
          </div>
        </div>
      </div>
    </div>
  )
}
