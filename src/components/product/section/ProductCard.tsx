"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye, Loader2, Clock, Award } from "lucide-react"
import type { Product } from "@/generated/prisma"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

import { MeatImagePlaceholder } from "@/components/ui/MeatImagePlaceholder"


interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
  isFavorite?: boolean
  isLoading?: boolean
  onToggleFavorite?: () => void
  onAddToCart?: () => void
  getRandomImage?: () => string
}

export function ProductCard({
  product,
  viewMode = "grid",
  isFavorite = false,
  isLoading = false,
  onToggleFavorite,
  onAddToCart,
  getRandomImage,
}: ProductCardProps) {
  const router = useRouter()

  const formatPrice = (price: number | null) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price ?? 0)
  }

  

  const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024
  const effectiveViewMode = isMobile ? "list" : viewMode


  const formatPriceDisplay = () => {
    const price = product.discount ? product.price - (product.price * product.discount) / 100 : product.price
    const amount = product.priceWeightAmount || 1
    const unit = product.priceWeightUnit || "kg"

    if (unit === "kg") {
      return `${formatPrice(price)} por ${amount} kg (${amount * 1000} gramas)`
    } else {
      return `${formatPrice(price)} por ${amount} gramas (${(amount / 1000).toFixed(1)} kg)`
    }
  }

  if (effectiveViewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="relative lg:w-64 flex-shrink-0">
            <div className="aspect-square lg:aspect-[4/3] overflow-hidden">
            {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                    product.stock === 0 ? "grayscale" : ""
                  }`}
                />
              ) : (
                <MeatImagePlaceholder className="w-full h-full object-cover" />
            )}
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.discount && product.discount > 0 && (
                <Badge className="bg-green-600 text-white font-bold text-xs">-{product.discount}%</Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge className="bg-orange-600 text-white text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Últimas {product.stock}
                </Badge>
              )}
              {product.stock === 0 && <Badge className="bg-gray-600 text-white text-xs">Esgotado</Badge>}
            </div>

            {/* Favorite Button */}
            <motion.button
              onClick={onToggleFavorite}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${isFavorite ? "text-red-500 fill-current" : "text-gray-400"}`}
              />
            </motion.button>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 lg:p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg lg:text-xl mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

              {/* Stock Info */}
              {product.stock <= 10 && product.stock > 0 && (
                <p className="text-xs text-orange-600 mb-3 flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Apenas {product.stock} unidades restantes
                </p>
              )}
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-xl lg:text-2xl font-bold text-red-600">{formatPrice(discountedPrice)}</span>
                  {product.discount && product.discount > 0 && (
                    <span className="text-sm line-through text-gray-400">{formatPrice(product.price)}</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  por {formatPrice(product.priceWeightAmount)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-red-50 hover:border-red-300 bg-transparent"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <Eye className="h-4 w-4" />
                  Ver
                </Button>
                <Button
                  className={`font-semibold transition-all duration-300 ${
                    product.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-lg"
                  }`}
                  onClick={onAddToCart}
                  disabled={product.stock === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adicionando...
                    </>
                  ) : product.stock === 0 ? (
                    "Esgotado"
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Adicionar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white relative">
        {/* Favorite Button */}
        <motion.button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${isFavorite ? "text-red-500 fill-current" : "text-gray-400"}`}
          />
        </motion.button>

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge className="absolute top-3 left-3 z-20 bg-orange-600 text-white text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Últimas {product.stock}
          </Badge>
        )}

        {/* Out of Stock Badge */}
        {product.stock === 0 && (
          <Badge className="absolute top-3 left-3 z-20 bg-gray-600 text-white text-xs">Esgotado</Badge>
        )}

        <CardHeader className="p-0 relative overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={product.image || getRandomImage?.() || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                product.stock === 0 ? "grayscale" : ""
              }`}
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quick View Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </motion.div>
            </div>

            {/* Discount Badge */}
            {product.discount && product.discount > 0 && (
              <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                -{product.discount}% OFF
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-red-600">{formatPrice(discountedPrice)}</span>
                {product.discount && product.discount > 0 && (
                  <span className="text-sm line-through text-gray-400">{formatPrice(product.price)}</span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                por {product.priceWeightAmount} {product.priceWeightUnit}
              </span>
            </div>
          </div>

          {/* Stock Info */}
          {product.stock <= 10 && product.stock > 0 && (
            <p className="text-xs text-orange-600 mb-4 flex items-center">
              <Award className="h-3 w-3 mr-1" />
              Apenas {product.stock} unidades restantes
            </p>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="w-full space-y-2">
            <Button
              className={`w-full font-semibold py-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              }`}
              onClick={onAddToCart}
              disabled={product.stock === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : product.stock === 0 ? (
                "Produto Esgotado"
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar ao Carrinho
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full text-gray-700 hover:bg-red-50 hover:border-red-300 bg-transparent transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="text-sm">Ver Detalhes</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
