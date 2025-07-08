"use client"

import { ShoppingCart } from "lucide-react"

export default function CartLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full blur-xl animate-pulse" />
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 border-2 border-red-200 rounded-full animate-spin" />
            <div className="bg-white rounded-full p-3 shadow-lg">
              <ShoppingCart className="h-6 w-6 text-red-600 animate-bounce" />
            </div>
          </div>
        </div>
        <p className="text-gray-600 font-medium">Carregando carrinho...</p>
      </div>
    </div>
  )
}
