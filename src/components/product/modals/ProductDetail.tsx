"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { X, Heart, Star, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { Product } from "@/generated/prisma"
import { useCart } from "@/components/cart/context"
import { toast } from "sonner"

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
  isFavorite = false,
  onToggleFavorite,
}: ProductDetailModalProps ) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()

  if (!product) return <div>Produto não encontrado</div>;

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      for (let i = 0; i < quantity; i++) {
        await addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          available: product.available,
          priceWeightAmount: product.priceWeightAmount,
          priceWeightUnit: product.priceWeightUnit,
        })
      }
      toast.success(`${quantity}kg de ${product.name} adicionado ao carrinho!`)
      onClose()
    } catch (error) {
      toast.error("Erro ao adicionar produto ao carrinho")
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal - Mobile First Design */}
          <motion.div
            className="fixed inset-0 z-50 lg:flex lg:items-center lg:justify-center lg:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Mobile: Full Screen */}
            <motion.div
              className="lg:hidden w-full h-full bg-gradient-to-br from-red-500 to-orange-500 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 text-white">
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
                <motion.button
                  onClick={onToggleFavorite}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? "fill-current text-pink-300" : ""}`} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex flex-col h-full">
                {/* Product Info */}
                <div className="flex-1 px-6 pb-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">{product.category}</Badge>

                    <div className="flex items-center space-x-2 mb-6">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? "text-yellow-300 fill-current" : "text-white/40"}`}
                          />
                        ))}
                      </div>
                      <span className="text-white/80 text-sm">4.5</span>
                    </div>

                    <div className="text-white/90 mb-6">
                      <p className="text-sm mb-2">
                        Tamanho: {product.priceWeightAmount}
                        {product.priceWeightUnit}
                      </p>
                    </div>
                  </motion.div>

                  {/* Product Image */}
                  <motion.div
                    className="relative w-64 h-64 mx-auto mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Image
                      src={product.image || "/placeholder.svg?height=256&width=256"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-2xl shadow-2xl"
                    />
                  </motion.div>
                </div>

                {/* Bottom Card */}
                <motion.div
                  className="bg-white rounded-t-3xl p-6 shadow-2xl"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Descrição</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.description || "Produto de alta qualidade, selecionado especialmente para você."}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Quantidade</h3>
                    <div className="flex items-center justify-center space-x-4">
                      <motion.button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-5 w-5 text-gray-600" />
                      </motion.button>
                      <span className="text-2xl font-bold text-gray-800 w-16 text-center">{quantity}</span>
                      <motion.button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="h-5 w-5 text-gray-600" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-gray-800">{formatPrice(product.price * quantity)}</span>
                    <span className="text-sm text-gray-500">por {quantity} {product.priceWeightUnit}</span>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isLoading || !product.available}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Adicionando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Desktop: Modal Card */}
            <motion.div
              className="hidden lg:block max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="shadow-2xl border-0">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 h-[600px]">
                    {/* Left: Image */}
                    <div className="relative bg-gradient-to-br from-red-500 to-orange-500 p-8 flex items-center justify-center">
                      <motion.button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-6 w-6" />
                      </motion.button>
                      <Image
                        src={product.image || "/placeholder.svg?height=400&width=400"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="object-cover rounded-2xl shadow-2xl"
                      />
                    </div>

                    {/* Right: Details */}
                    <div className="p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-red-100 text-red-800">{product.category}</Badge>
                          <motion.button
                            onClick={onToggleFavorite}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart
                              className={`h-6 w-6 ${isFavorite ? "fill-current text-red-500" : "text-gray-400"}`}
                            />
                          </motion.button>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

                        <div className="flex items-center space-x-2 mb-6">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-600 text-sm">4.5</span>
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {product.description || "Produto de alta qualidade, selecionado especialmente para você."}
                        </p>

                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-800 mb-3">Quantidade</h3>
                          <div className="flex items-center space-x-4">
                            <motion.button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              disabled={quantity <= 1}
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </motion.button>
                            <span className="text-xl font-bold text-gray-800 w-12 text-center">{quantity}</span>
                            <motion.button
                              onClick={() => setQuantity(quantity + 1)}
                              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-3xl font-bold text-gray-800">
                            {formatPrice(product.price * quantity)}
                          </span>
                          <span className="text-sm text-gray-500">por {quantity}kg</span>
                        </div>

                        <Button
                          onClick={handleAddToCart}
                          disabled={isLoading || !product.available}
                          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Adicionando...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-5 w-5 mr-2" />
                              Adicionar ao Carrinho
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
