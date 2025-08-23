"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { getUserFavorites } from "@/app/actions/favorites"
import { ProductCard } from "@/components/product/section/ProductCard"
import type { Product } from "@/generated/prisma"
import { useCart } from "@/components/cart/context"
import { toast } from "sonner"

export default function FavoritesTab() {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function loadFavorites() {
      try {
        const result = await getUserFavorites()
        if (result.success) {
          setFavorites(result.favorites)
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,

      priceWeightAmount: product.priceWeightAmount,
      priceWeightUnit: product.priceWeightUnit,

      category: product.category,
      available: product.available,
      stock: product.stock,
    }, 1)
    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold">Favoritos</span>
              <p className="text-white/80 text-sm">Seus produtos favoritos</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (favorites.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold">Favoritos</span>
              <p className="text-white/80 text-sm">Seus produtos favoritos</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum favorito ainda</h3>
            <p className="text-gray-500">Adicione produtos aos seus favoritos para vê-los aqui!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6">
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold">Favoritos</span>
            <p className="text-white/80 text-sm">{favorites.length} produtos favoritos</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={true}
              onAddToCart={() => handleAddToCart(product)}
              onToggleFavorite={() => {
                // Remove from favorites and update local state
                setFavorites((prev) => prev.filter((p) => p.id !== product.id))
                toast.success("Produto removido dos favoritos!")
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
