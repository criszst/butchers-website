"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Heart, Star, Minus, Plus, ShoppingCart, Loader2, Share2, Truck, Shield, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/generated/prisma"
import { useCart } from "@/components/cart/context"
import { toast } from "sonner"
import { getProductById, getRelatedProducts } from "@/app/actions/product"
import Header from "@/components/header"

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const productId = Number.parseInt(params.id as string)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || isNaN(productId)) {
        setIsLoading(false)
        return
      }

      try {
        const result = await getProductById(productId)
        if (result.success && result.product) {
          setProduct(result.product)

          // Fetch related products
          const relatedResult = await getRelatedProducts(productId, result.product.category, 4)
          if (relatedResult.success) {
            setRelatedProducts(relatedResult.products)
          }
        } else {
          toast.error(result.message || "Produto não encontrado")
        }
      } catch (error) {
        toast.error("Erro ao carregar produto")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)
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
      toast.success(`${quantity}${product.priceWeightUnit} de ${product.name} adicionado ao carrinho!`)
    } catch (error) {
      toast.error("Erro ao adicionar produto ao carrinho")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Confira este produto: ${product?.name}`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copiado para a área de transferência!")
    }
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          {/* Mobile Loading */}
          <div className="lg:hidden">
            <div className="relative h-80 bg-gradient-to-br from-red-500 to-orange-500">
              <div className="absolute top-4 left-4">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="absolute top-4 right-4">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
            <div className="px-4 py-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          {/* Desktop Loading */}
          <div className="hidden lg:block container py-8">
            <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto text-center shadow-lg">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
              <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
              <Link href="/">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar às Compras
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Design */}
        <div className="lg:hidden">
          {/* Hero Section with Image */}
          <div className="relative h-80 bg-gradient-to-br from-red-500 to-orange-500 overflow-hidden">
            {/* Navigation */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <motion.button
                onClick={() => router.back()}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="h-6 w-6" />
              </motion.button>
              <div className="flex space-x-2">
                <motion.button
                  onClick={handleShare}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current text-pink-300" : ""}`} />
                </motion.button>
              </div>
            </div>

            {/* Product Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative w-64 h-64"
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

            {/* Stock Badge */}
            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-orange-600 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  Últimas {product.stock} unidades
                </Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="px-4 py-6 space-y-6">
            {/* Title and Category */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <Badge className="bg-red-100 text-red-800 mb-3">{product.category}</Badge>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">4.8 (25 avaliações)</span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {product.stock > 0 ? "Em estoque" : "Fora de estoque"}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm">Entrega: Amanhã</span>
                </div>
              </div>
            </motion.div>

            {/* Price */}
            <motion.div
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(discountedPrice * quantity)}</span>
                  {product.discount && product.discount > 0 && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm line-through text-gray-400">
                        {formatPrice(product.price * quantity)}
                      </span>
                      <Badge className="bg-green-600 text-white text-xs">-{product.discount}% OFF</Badge>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    por {quantity} {product.priceWeightUnit} • {formatPrice(discountedPrice)}/{product.priceWeightUnit}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description || "Produto de alta qualidade, selecionado especialmente para você."}
              </p>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3">Quantidade</h3>
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
                <span className="text-2xl font-bold text-gray-900 w-16 text-center">{quantity}</span>
                <motion.button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>
            </motion.div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <motion.div
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-semibold text-gray-900 mb-4">Produtos Relacionados</h3>
                <div className="grid grid-cols-2 gap-3">
                  {relatedProducts.map((relatedProduct) => (
                    <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                      <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="relative w-full h-20 mb-2">
                          <Image
                            src={relatedProduct.image || "/placeholder.svg?height=80&width=80"}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <h4 className="text-xs font-medium text-gray-900 mb-1 line-clamp-2">{relatedProduct.name}</h4>
                        <p className="text-xs font-bold text-red-600">{formatPrice(relatedProduct.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Security Info */}
            <motion.div
              className="flex items-center justify-center space-x-6 text-xs text-gray-500 py-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Compra Segura</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="h-3 w-3" />
                <span>Entrega Rápida</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>45-60 min</span>
              </div>
            </motion.div>
          </div>

          {/* Fixed Bottom Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.available || product.stock === 0}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : product.stock === 0 ? (
                "Produto Esgotado"
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </>
              )}
            </Button>
          </div>

          {/* Bottom Spacing for Fixed Button */}
          <div className="h-20" />
        </div>

        {/* Desktop Design */}
        <div className="hidden lg:block">
          <div className="container py-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8 ml-17">
              <Link href="/" className="hover:text-red-600 transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link href="/" className="hover:text-red-600 transition-colors">
                Produtos
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{product.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Left: Image */}
              <motion.div
                className="relative"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative aspect-square bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-8 flex items-center justify-center overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg?height=500&width=500"}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="object-cover rounded-xl shadow-2xl"
                  />

                  {/* Favorite Button */}
                  <motion.button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? "fill-current text-pink-300" : ""}`} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Right: Details */}
              <motion.div
                className="flex flex-col justify-between"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-red-100 text-red-800">{product.category}</Badge>
                    <Button variant="outline" size="sm" onClick={handleShare} className="bg-transparent">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>

                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">4.8 (25 avaliações)</span>
                  </div>

                  {/* Stock and Delivery Info */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                      <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                        {product.stock > 0 ? "Em estoque" : "Fora de estoque"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Truck className="h-4 w-4" />
                      <span>Entrega: Amanhã</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    {product.description || "Produto de alta qualidade, selecionado especialmente para você."}
                  </p>

                  {/* Quantity Selector */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">Quantidade</h3>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-5 w-5 text-gray-600" />
                      </motion.button>
                      <span className="text-2xl font-bold text-gray-900 w-16 text-center">{quantity}</span>
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
                </div>

                {/* Price and Add to Cart */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(discountedPrice * quantity)}
                      </span>
                      {product.discount && product.discount > 0 && (
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg line-through text-gray-400">
                            {formatPrice(product.price * quantity)}
                          </span>
                          <Badge className="bg-green-600 text-white">-{product.discount}% OFF</Badge>
                        </div>
                      )}
                      <p className="text-gray-500 mt-1">
                        {product.priceWeightAmount !== null && product.priceWeightAmount !== undefined ? (
                          <span>
                            por {product.priceWeightAmount * quantity} {product.priceWeightUnit} • {formatPrice(discountedPrice)} / {product.priceWeightAmount} {product.priceWeightUnit}
                          </span>
                        ) : (
                          <span>Informação não disponível</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product.available || product.stock === 0}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Adicionando...
                      </>
                    ) : product.stock === 0 ? (
                      "Produto Esgotado"
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </Button>

                  {/* Security Info */}
                  <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 mt-6">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Compra Segura</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <span>Entrega Rápida</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>45-60 min</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Related Products Desktop */}
            {relatedProducts.length > 0 && (
              <motion.div
                className="mt-16"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Produtos Relacionados</h3>
                <div className="grid grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="relative w-full h-40 mb-4">
                            <Image
                              src={relatedProduct.image || "/placeholder.svg?height=160&width=160"}
                              alt={relatedProduct.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h4>
                          <p className="text-lg font-bold text-red-600">{formatPrice(relatedProduct.price)}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
