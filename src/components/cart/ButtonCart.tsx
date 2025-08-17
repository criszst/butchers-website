"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Loader2 } from "lucide-react"
import { useCart } from "./context"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancedCartButtonProps {
  onClick?: () => void
}

export default function EnhancedCartButton({ onClick }: EnhancedCartButtonProps) {
  const { itemCount, total, isLoading } = useCart()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      variant="outline"
      size="lg"
      className="relative bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group px-3 sm:px-4 py-2 h-10 sm:h-12"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading}
    >
      {/* Loading Spinner */}
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-red-600 mr-2" />}

      {/* Cart Icon with Animation */}
      <div className="relative">
        <motion.div animate={itemCount > 0 ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
          <ShoppingCart
            className={`h-4 w-4 sm:h-5 sm:w-5 text-red-600 transition-transform duration-300 ${
              isHovered ? "scale-110" : ""
            }`}
          />
        </motion.div>

        {/* Animated Plus Icon when hovering */}
        {isHovered && !isLoading && (
          <Plus className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 text-red-600 animate-bounce" />
        )}
      </div>

      {/* Item Count Badge */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2"
          >
            <Badge className="h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 text-xs bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 animate-pulse shadow-lg border-2 border-white flex items-center justify-center">
              {itemCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

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
