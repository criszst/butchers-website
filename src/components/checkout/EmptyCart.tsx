"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ArrowLeft } from "lucide-react"

interface EmptyCartProps {
  onExploreProducts: () => void
}

export const EmptyCart = ({ onExploreProducts }: EmptyCartProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="container py-8 lg:py-16 text-center">
        <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 lg:p-12">
            <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner mb-6 lg:mb-8">
              <Package className="h-8 w-8 lg:h-12 lg:w-12 text-gray-400" />
            </div>

            <h2 className="text-xl lg:text-3xl font-bold mb-3 lg:mb-4 text-gray-800">Carrinho vazio</h2>

            <p className="text-gray-600 mb-6 lg:mb-8 text-sm lg:text-base leading-relaxed">
              Adicione produtos ao carrinho para continuar com o pagamento
            </p>

            <Button
              onClick={onExploreProducts}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 lg:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              Explorar Produtos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
