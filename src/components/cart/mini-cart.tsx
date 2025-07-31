"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, X, Plus, Minus, ArrowRight, CheckCircle, Trash2, Gift } from "lucide-react"
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
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (lastAddedItem && isOpen) {
      setShowSuccess(true)
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
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

  const handleRemoveItem = async (productId: number) => {
    setRemovingItems((prev) => new Set(prev).add(productId))
    try {
      await removeItem(productId)
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const taxaEntrega = total > 50 ? 0 : 8.9
  const totalFinal = total + taxaEntrega

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Mini Cart */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-120 bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-600 to-orange-600 text-white"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <ShoppingCart className="h-10 w-10" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">Meu Carrinho</h3>
                  <p className="text-xs text-red-100">
                    {itemCount} {itemCount === 1 ? "item" : "itens"}
                  </p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && lastAddedItem && (
                <motion.div
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}
                    >
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.p
                        className="text-sm font-bold text-green-800"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        🎉 Produto adicionado!
                      </motion.p>
                      <motion.p
                        className="text-xs text-green-600"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {lastAddedItem.name} foi adicionado ao carrinho
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full text-center p-6"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <ShoppingCart className="h-20 w-20 text-gray-300 mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Carrinho vazio</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Que tal adicionar alguns produtos deliciosos ao seu carrinho?
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={onClose}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Explorar Produtos
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="p-4 space-y-4">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                          lastAddedItem?.id === item.id && showSuccess
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg"
                            : removingItems.has(item.product.id)
                              ? "bg-red-50 border-red-200 opacity-50"
                              : "bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-red-200 hover:shadow-md"
                        }`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50, scale: 0.8 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1,
                          ease: "easeInOut",
                        }}
                        layout
                      >
                        <div className="relative">
                          <motion.div whileHover={{ scale: 1.05 }} className="relative">
                            <Image
                              src={item.product.image || "/placeholder.svg?height=60&width=60"}
                              alt={item.product.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover shadow-sm"
                            />
                            {lastAddedItem?.id === item.id && showSuccess && (
                              <motion.div
                                className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1 shadow-lg"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </motion.div>
                            )}
                          </motion.div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-800 truncate">{item.product.name}</h4>
                          <p className="text-xs text-gray-600 capitalize mb-1">{item.product.category}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-red-600 text-sm">
                              R$ {item.product.price.toFixed(2)}/{item.product.priceWeightAmount} {item.product.priceWeightUnit}	
                            </span>
                            <span className="font-bold text-green-600 text-sm">
                              R$ {(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-1 bg-white rounded-lg p-1 shadow-sm border">
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            </motion.div>
                            <span className="text-xs font-bold w-8 text-center">{item.product.priceWeightAmount} {item.product.priceWeightUnit}</span>
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          </div>
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.product.id)}
                              disabled={removingItems.has(item.product.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2 text-xs rounded-md"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              {removingItems.has(item.product.id) ? "..." : "Remover"}
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                className="border-t bg-white p-4 space-y-4 shadow-lg"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Shipping Info */}
                <div className="text-center">
                  {total >= 50 ? (
                    <motion.div
                      className="flex max-h-max mh-auto items-center justify-center space-x-2 text-green-600 p-3 bg-green-50 rounded-lg"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-bold">🎉 Frete grátis garantido!</span>
                    </motion.div>
                  ) : (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">
                        Faltam <span className="font-bold text-red-600">R$ {(50 - total).toFixed(2)}</span> para frete
                        grátis
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-red-600 to-orange-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((total / 50) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Calculations */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Taxa de Entrega</span>
                    <span className={`font-semibold ${taxaEntrega === 0 ? "text-green-600" : ""}`}>
                      {taxaEntrega === 0 ? "Grátis" : `R$ ${taxaEntrega.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <motion.div
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="font-bold text-lg">Total:</span>
                  <span className="text-2xl font-bold text-green-600">R$ {totalFinal.toFixed(2)}</span>
                </motion.div>

                {/* Action Buttons */}
                <div className="space-y-3 ">
                  <Link href="/cart" onClick={onClose}>
                    <motion.div whileHover={{ scale: 1.02 }} className="pb-2" whileTap={{ scale: 0.98 }}>
                      <Button className="w-full  bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        Ver Carrinho Completo
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </motion.div>
                  </Link>

                  <Link href="/payment" onClick={onClose}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 bg-transparent py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        Finalizar Pedido
                      </Button>
                    </motion.div>
                  </Link>
                </div>

                {/* Continue Shopping */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 py-2 rounded-lg transition-all duration-300"
                  >
                    Continuar Comprando
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
