"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, X, Plus, Minus, ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart/context"

import { motion, AnimatePresence } from "framer-motion"

interface MiniCartProps {
  isOpen: boolean
  onClose: () => void
  lastAddedItem?: any
}

export default function MiniCart({ isOpen, onClose, lastAddedItem }: MiniCartProps) {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart()
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (lastAddedItem && isOpen) {
      setShowSuccess(true)
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [lastAddedItem, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null;


  return (
    <AnimatePresence>
      {/* Overlay */}
       <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

      {/* Mini Cart */}
       <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "0%" }}
            transition={{ type: 'keyframes', duration: 0.2 }}
          >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <h3 className="font-semibold">
              Carrinho ({itemCount} {itemCount === 1 ? "item" : "itens"})
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        
      </div>
        {/* Success Message */}
        {showSuccess && lastAddedItem && (
          <div className="p-4 bg-green-50 border-b border-green-200 animate-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Produto adicionado!</p>
                <p className="text-xs text-green-600">{lastAddedItem.name} foi adicionado ao carrinho</p>
              </div>
            </div>
          </div>
        )}

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Carrinho vazio</h3>
              <p className="text-gray-600 mb-4">Adicione produtos deliciosos ao seu carrinho!</p>
              <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                    lastAddedItem?.id === item.id && showSuccess
                      ? "bg-green-50 border-green-200 animate-pulse"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    {lastAddedItem?.id === item.id && showSuccess && (
                      <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-1">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-gray-600 capitalize">{item.category}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-red-600 text-sm">R$ {item.price.toFixed(2)}/kg</span>
                      <span className="font-semibold text-gray-800">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-semibold w-8 text-center">{item.quantity}kg</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2 text-xs"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t bg-white p-4 space-y-4">
            {/* Shipping Info */}
            <div className="text-center">
              {total >= 50 ? (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Frete grátis garantido!</span>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Faltam <span className="font-semibold text-red-600">R$ {(50 - total).toFixed(2)}</span> para frete
                  grátis
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((total / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-red-600">R$ {total.toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link href="/cart" onClick={onClose}>
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold">
                  Ver Carrinho Completo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/payment" onClick={onClose}>
                <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
                  Finalizar Pedido
                </Button>
              </Link>
            </div>

            {/* Continue Shopping */}
            <Button variant="ghost" onClick={onClose} className="w-full text-gray-600 hover:text-gray-800">
              Continuar Comprando
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
