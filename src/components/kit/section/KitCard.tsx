"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye, Loader2, Layers } from "lucide-react"
import type { Kit } from "@/interfaces/kit"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface KitCardProps {
  kit: Kit
  viewMode?: "grid" | "list"
  isFavorite?: boolean
  isLoading?: boolean
  onToggleFavorite?: () => void
  onAddToCart?: () => void
}

export function KitCard({
  kit,
  viewMode = "grid",
  isFavorite = false,
  isLoading = false,
  onToggleFavorite,
  onAddToCart,
}: KitCardProps) {
  const router = useRouter()
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const formatPrice = (price: number | null) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price ?? 0)
  }

  const calculateKitPrice = () => {
    const totalPrice = kit.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return kit.discount ? totalPrice - (totalPrice * kit.discount) / 100 : totalPrice
  }

  const kitPrice = calculateKitPrice()
  const originalPrice = kit.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024
  const effectiveViewMode = isMobile ? "list" : viewMode

  const handleToggleFavorite = async () => {
    if (favoriteLoading) return

    setFavoriteLoading(true)
    try {
      // TODO: Implement kit favorites API
      toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos")
      if (onToggleFavorite) {
        onToggleFavorite()
      }
    } catch (error) {
      toast.error("Erro ao atualizar favoritos")
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (effectiveViewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="relative lg:w-64 flex-shrink-0">
            <div className="aspect-square lg:aspect-[4/3] overflow-hidden">
              <Image
                src={kit.image ?? "/placeholder.svg?height=300&width=300&text=Kit"}
                alt={kit.name}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              <Badge className="bg-blue-600 text-white font-bold text-xs">
                <Layers className="h-3 w-3 mr-1" />
                Kit
              </Badge>
              {kit.discount && kit.discount > 0 && (
                <Badge className="bg-green-600 text-white font-bold text-xs">-{kit.discount}%</Badge>
              )}
            </div>

            {/* Favorite Button */}
            <motion.button
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white shadow-lg disabled:opacity-50"
              whileHover={{ scale: favoriteLoading ? 1 : 1.1 }}
              whileTap={{ scale: favoriteLoading ? 1 : 0.9 }}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  favoriteLoading
                    ? "text-gray-400 animate-pulse"
                    : isFavorite
                      ? "text-red-500 fill-current"
                      : "text-gray-400"
                }`}
              />
            </motion.button>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 lg:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-bold text-lg lg:text-xl group-hover:text-red-600 transition-colors line-clamp-2">
                  {kit.name}
                </h3>
                <Badge className="bg-blue-100 text-blue-800 text-xs">{kit.items.length} itens</Badge>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{kit.description}</p>

              {/* Kit Items Preview */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Inclui:</p>
                <div className="flex flex-wrap gap-1">
                  {kit.items.slice(0, 3).map((item) => (
                    <Badge key={item.id} variant="outline" className="text-xs">
                      {item.quantity}x {item.product.name}
                    </Badge>
                  ))}
                  {kit.items.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{kit.items.length - 3} mais
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-xl lg:text-2xl font-bold text-red-600">{formatPrice(kitPrice)}</span>
                  {kit.discount && kit.discount > 0 && (
                    <span className="text-sm line-through text-gray-400">{formatPrice(originalPrice)}</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {kit.discount && kit.discount > 0 && (
                    <span className="text-green-600 font-medium">
                      Economize {formatPrice(originalPrice - kitPrice)}
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-red-50 hover:border-red-300 bg-transparent"
                  onClick={() => router.push(`/kit/${kit.id}`)}
                >
                  <Eye className="h-4 w-4" />
                  Ver
                </Button>
                <Button
                  className="font-semibold transition-all duration-300 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-lg"
                  onClick={onAddToCart}
                  disabled={!kit.available || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adicionando...
                    </>
                  ) : !kit.available ? (
                    "Indisponível"
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Adicionar Kit
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
          onClick={handleToggleFavorite}
          disabled={favoriteLoading}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white shadow-lg disabled:opacity-50"
          whileHover={{ scale: favoriteLoading ? 1 : 1.1 }}
          whileTap={{ scale: favoriteLoading ? 1 : 0.9 }}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              favoriteLoading
                ? "text-gray-400 animate-pulse"
                : isFavorite
                  ? "text-red-500 fill-current"
                  : "text-gray-400"
            }`}
          />
        </motion.button>

        {/* Kit Badge */}
        <Badge className="absolute top-3 left-3 z-20 bg-blue-600 text-white text-xs">
          <Layers className="h-3 w-3 mr-1" />
          Kit
        </Badge>

        <CardHeader className="p-0 relative overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={kit.image ?? "/placeholder.svg?height=400&width=400&text=Kit"}
              alt={kit.name}
            
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                  onClick={() => router.push(`/kit/${kit.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Kit
                </Button>
              </motion.div>
            </div>

            {/* Discount Badge */}
            {kit.discount && kit.discount > 0 && (
              <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                -{kit.discount}% OFF
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-bold text-lg group-hover:text-red-600 transition-colors line-clamp-2 flex-1">
              {kit.name}
            </h3>
            <Badge className="bg-blue-100 text-blue-800 text-xs">{kit.items.length} itens</Badge>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{kit.description}</p>

          {/* Kit Items Preview */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Inclui:</p>
            <div className="flex flex-wrap gap-1">
              {kit.items.slice(0, 2).map((item) => (
                <Badge key={item.id} variant="outline" className="text-xs">
                  {item.quantity}x {item.product.name}
                </Badge>
              ))}
              {kit.items.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{kit.items.length - 2} mais
                </Badge>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-red-600">{formatPrice(kitPrice)}</span>
                {kit.discount && kit.discount > 0 && (
                  <span className="text-sm line-through text-gray-400">{formatPrice(originalPrice)}</span>
                )}
              </div>
              {kit.discount && kit.discount > 0 && (
                <span className="text-xs text-green-600 font-medium">
                  Economize {formatPrice(originalPrice - kitPrice)}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="w-full space-y-2">
            <Button
              className="w-full sm:w-[250px] font-semibold py-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              onClick={onAddToCart}
              disabled={!kit.available || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : !kit.available ? (
                "Kit Indisponível"
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar Kit
                </>
              )}
            </Button> 

            <Button
              variant="outline"
              className="w-full text-gray-700 hover:bg-red-50 hover:border-red-300 bg-transparent transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg"
              onClick={() => router.push(`/kit/${kit.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="text-sm">Ver Detalhes do Kit</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
