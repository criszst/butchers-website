"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CreditCard, Heart, Gift, TrendingUp } from "lucide-react"

const stats = {
  totalOrders: 24,
  favoriteProducts: 12,
}

export default function UserStats() {
  return (
    <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gray-800 text-white p-6">
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold">Estatísticas</span>
            <p className="text-white/80 text-sm">Seu desempenho</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <Package className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
            <p className="text-xs text-gray-600 font-medium">Pedidos</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <Heart className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.favoriteProducts}</p>
            <p className="text-xs text-gray-600 font-medium">Favoritos</p>
          </div>
          {/* <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
            <Gift className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-red-600">{stats.loyaltyPoints}</p>
            <p className="text-xs text-red-600/80 font-medium">Pontos</p>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
