"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  Heart,
  Star,
  ShoppingCart,
  Loader2,
  Share2,
  Truck,
  Shield,
  Clock,
  Layers,
  Package,
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { Kit } from "@/interfaces/kit"
import { useCart } from "@/components/cart/context"
import { toast } from "sonner"
import { getKitById } from "@/app/actions/kit"
import Header from "@/components/header"

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: "Kit Premium - Casa de Carnes Duarte",
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copiado para a área de transferência!")
  }
}

export default function KitDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()

  const [kit, setKit] = useState<Kit | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const kitId = Number.parseInt(params.id as string)

  useEffect(() => {
    const fetchKit = async () => {
      if (!kitId || isNaN(kitId)) {
        setIsLoading(false)
        return
      }

      try {
        const result = await getKitById(kitId)
        if (result.success && result.kit) {
          setKit(result.kit)
        } else {
          toast.error(result.message || "Kit não encontrado")
        }
      } catch (error) {
        toast.error("Erro ao carregar kit")
      } finally {
        setIsLoading(false)
      }
    }

    fetchKit()
  }, [kitId])

  const handleAddToCart = async () => {
    if (!kit) return

    setIsAddingToCart(true)
    try {
      // Add each item in the kit to cart
      for (const kitItem of kit.items) {
        const product = {
          ...kitItem.product,
          stock: kitItem.product.stock ?? 0,
          available: kitItem.product.available ?? true,
        }
        await addItem(product, kitItem.quantity)
      }
      toast.success(`Kit "${kit.name}" adicionado ao carrinho!`)
    } catch (error) {
      toast.error("Erro ao adicionar kit ao carrinho")
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

  const calculateKitPrice = () => {
    if (!kit) return 0
    const totalPrice = kit.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return kit.discount ? totalPrice - (totalPrice * kit.discount) / 100 : totalPrice
  }

  const calculateOriginalPrice = () => {
    if (!kit) return 0
    return kit.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }

  const calculateSavings = () => {
    if (!kit || !kit.discount) return 0
    const originalPrice = calculateOriginalPrice()
    const discountedPrice = calculateKitPrice()
    return originalPrice - discountedPrice
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

  if (!kit) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto text-center shadow-lg">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold mb-4">Kit não encontrado</h2>
              <p className="text-gray-600 mb-6">O kit que você está procurando não existe ou foi removido.</p>
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

  const kitPrice = calculateKitPrice()
  const originalPrice = calculateOriginalPrice()
  const savings = calculateSavings()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Mobile View */}
        <div className="lg:hidden">
          <div className="relative h-80 bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
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

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative w-64 h-64"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Image
                  src={kit.image || "/placeholder.svg?height=256&width=256&text=Kit"}
                  alt={kit.name}
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-blue-600 text-white shadow-lg">
                    <Layers className="h-3 w-3 mr-1" />
                    Kit
                  </Badge>
                </div>
              </motion.div>
            </div>

            {kit.discount && kit.discount > 0 && (
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-green-600 text-white shadow-lg">
                  <Package className="h-3 w-3 mr-1" />-{kit.discount}% OFF
                </Badge>
              </div>
            )}
          </div>

          <div className="px-4 py-6 space-y-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center space-x-2 mb-3">
                <Badge className="bg-blue-100 text-blue-800">{kit.category}</Badge>
                <Badge className="bg-gray-100 text-gray-800">{kit.items.length} itens</Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{kit.name}</h1>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">4.9 (12 avaliações)</span>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${kit.available ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-sm font-medium ${kit.available ? "text-green-600" : "text-red-600"}`}>
                    {kit.available ? "Disponível" : "Indisponível"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm">Entrega: Amanhã</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(kitPrice)}</span>
                  {kit.discount && kit.discount > 0 && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm line-through text-gray-400">{formatPrice(originalPrice)}</span>
                      <Badge className="bg-green-600 text-white text-xs">-{kit.discount}% OFF</Badge>
                    </div>
                  )}
                  {savings > 0 && (
                    <p className="text-sm text-green-600 font-medium mt-1">Economize {formatPrice(savings)}</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{kit.description}</p>
            </motion.div>

            <motion.div
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3">Itens Inclusos ({kit.items.length})</h3>
              <div className="space-y-3">
                {kit.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg?height=48&width=48&text=Produto"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-xs text-gray-600">
                        {item.quantity}x • {formatPrice(item.product.price)} cada
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-center space-x-6 text-xs text-gray-500 py-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
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

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !kit.available}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Adicionando Kit...
                </>
              ) : !kit.available ? (
                "Kit Indisponível"
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar Kit - {formatPrice(kitPrice)}
                </>
              )}
            </Button>
          </div>

          <div className="h-20" />
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="container py-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
              <Link href="/" className="hover:text-red-600 transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link href="/" className="hover:text-red-600 transition-colors">
                Kits
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{kit.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-12 max-w-6xl mx-auto">
              <motion.div
                className="relative"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8 flex items-center justify-center overflow-hidden">
                  <Image
                    src={kit.image || "/placeholder.svg?height=500&width=500&text=Kit"}
                    alt={kit.name}
                    width={500}
                    height={500}
                    className="object-cover rounded-xl shadow-2xl"
                  />

                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white shadow-lg">
                      <Layers className="h-4 w-4 mr-2" />
                      Kit Premium
                    </Badge>
                  </div>

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

              <motion.div
                className="flex flex-col justify-between"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800">{kit.category}</Badge>
                      <Badge className="bg-gray-100 text-gray-800">{kit.items.length} itens</Badge>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleShare} className="bg-transparent">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>

                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{kit.name}</h1>

                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">4.9 (12 avaliações)</span>
                  </div>

                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${kit.available ? "bg-green-500" : "bg-red-500"}`} />
                      <span className={`font-medium ${kit.available ? "text-green-600" : "text-red-600"}`}>
                        {kit.available ? "Disponível" : "Indisponível"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Truck className="h-4 w-4" />
                      <span>Entrega: Amanhã</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">{kit.description}</p>

                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">Itens Inclusos ({kit.items.length})</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {kit.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={item.product.image || "/placeholder.svg?height=64&width=64&text=Produto"}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantity}x • {formatPrice(item.product.price)} cada
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-4xl font-bold text-gray-900">{formatPrice(kitPrice)}</span>
                      {kit.discount && kit.discount > 0 && (
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg line-through text-gray-400">{formatPrice(originalPrice)}</span>
                          <Badge className="bg-green-600 text-white">-{kit.discount}% OFF</Badge>
                        </div>
                      )}
                      {savings > 0 && (
                        <p className="text-green-600 font-medium mt-1">Economize {formatPrice(savings)}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !kit.available}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Adicionando Kit...
                      </>
                    ) : !kit.available ? (
                      "Kit Indisponível"
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Adicionar Kit Completo - {formatPrice(kitPrice)}
                      </>
                    )}
                  </Button>

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
          </div>
        </div>
      </div>
    </>
  )
}
