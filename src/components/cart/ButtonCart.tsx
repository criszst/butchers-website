"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus } from "lucide-react"
import { useCart } from "./context"

export default function EnhancedCartButton({ onClick }: { onClick?: () => void }) {
  const { itemCount, total } = useCart()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      variant="outline"
      size="lg"
      className="relative bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group px-3 sm:px-4 py-2 h-10 sm:h-12"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cart Icon with Animation */}
      <div className="relative">
        <ShoppingCart
          className={`h-5 w-4 sm:h-5 sm:w-5 text-red-600 transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
        />

        {/* Animated Plus Icon when hovering */}
        {isHovered && <Plus className="absolute -top-1 -right-1 h-2 w-4 sm:h-3 sm:w-3 text-red-600 animate-bounce" />}
      </div>

      {/* Item Count Badge */}
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 text-xs bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 animate-pulse shadow-lg border-2 border-white">
          {itemCount}
        </Badge>
      )}

      {/* Cart Text and Total - Hidden on small screens */}
      <div className="ml-2 hidden sm:flex flex-col items-start">
        <span className="text-xs sm:text-sm font-semibold text-red-600">
          {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "item" : "itens"}` : "Carrinho"}
        </span>
        {total > 0 && <span className="text-xs text-red-500 font-medium -mt-1">R$ {total.toFixed(2)}</span>}
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/20 to-red-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Button>
  )
}
