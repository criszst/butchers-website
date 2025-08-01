"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, CheckCircle, Package, Truck, Shield, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart/context"
import { toast } from "sonner"
import Header from "@/components/header"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount, isLoading } = useCart()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set())
  const [promoCode, setPromoCode] = useState("")

  const taxaEntrega = total > 50 ? 0 : 8.9
  const totalFinal = total + taxaEntrega

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    setIsUpdating(productId)
    try {
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      toast.error("Erro ao atualizar quantidade")
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = async (productId: number) => {
    setRemovingItems((prev) => new Set(prev).add(productId))
    try {
      await removeItem(productId)
      toast.success("Item removido do carrinho")
    } catch (error) {
      toast.error("Erro ao remover item")
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="container py-4 lg:py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-4 border-gray-200 border-t-red-600 mx-auto"></div>
                </div>
                <p className="text-gray-600 font-medium text-sm lg:text-base">Carregando seu carrinho...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="container py-8 lg:py-16">
            <Card className="max-w-md mx-auto text-center shadow-lg border-0 bg-white">
              <CardContent className="p-8 lg:p-12">
                <div className="relative mb-6 lg:mb-8">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 lg:h-12 lg:w-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs lg:text-sm font-bold">0</span>
                  </div>
                </div>
                <h2 className="text-xl lg:text-3xl font-bold mb-3 lg:mb-4 text-gray-800">Seu carrinho está vazio</h2>
                <p className="text-gray-600 mb-6 lg:mb-8 text-sm lg:text-lg leading-relaxed">
                  Que tal adicionar alguns produtos deliciosos?
                </p>
                <Link href="/">
                  <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Package className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Explorar Produtos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container py-4 lg:py-8">
          {/* Breadcrumb - Mobile Hidden */}
          <div className="flex items-center ml-10  space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-red-600 transition-colors duration-300">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Carrinho</span>
          </div>

          {/* Page Title */}
          <div className="mb-6 lg:mb-8 ml-10">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2">SEU CARRINHO</h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {itemCount} {itemCount === 1 ? "item" : "itens"} • {items.length} produtos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 sm:ml-10 w-[calc(100%-2rem)] ml-[1rem] sm:w-auto ">
            {/* Products List - Mobile First */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              {items.map((item, index) => (
                <Card
                  key={item.id}
                  className={`bg-white shadow-sm hover:shadow-md transition-all duration-300 border-0 ${
                    removingItems.has(item.product.id) ? "animate-pulse opacity-50" : ""
                  }`}
                >
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                        <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.product.image || "/placeholder.svg?height=96&width=96"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {/* Remove Button - Mobile */}
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          disabled={removingItems.has(item.product.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors sm:hidden"
                        >
                          ×
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-semibold text-gray-800 text-sm lg:text-base mb-1">{item.product.name}</h3>
                        <p className="text-xs lg:text-sm text-gray-600 capitalize mb-2">{item.product.category}</p>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="font-bold text-red-600 text-sm lg:text-base">
                            R$ {item.product.price.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">
                            /{item.product.priceWeightAmount}
                            {item.product.priceWeightUnit}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:space-y-3">
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            disabled={isUpdating === item.product.id || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <div className="min-w-[3rem] text-center">
                            {isUpdating === item.product.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mx-auto"></div>
                            ) : (
                              <span className="font-semibold text-sm">{item.product.priceWeightAmount} {item.product.priceWeightUnit}</span>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={isUpdating === item.product.id}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Desktop Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product.id)}
                          disabled={removingItems.has(item.product.id)}
                          className="hidden sm:flex text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {removingItems.has(item.product.id) ? "Removendo..." : "Remover"}
                        </Button>

                        {/* Subtotal */}
                        <div className="text-right sm:text-center">
                          <div className="font-bold text-green-600 text-sm lg:text-base">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary - Sticky on Desktop */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg lg:text-xl font-bold text-gray-800">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6">
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Código promocional</label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Digite seu código"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-4 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Free Shipping Progress */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {total >= 50 ? (
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-semibold text-sm">Frete Grátis Garantido!</span>
                        </div>
                        <p className="text-xs text-green-600">Você economizou R$ 8,90</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">
                            Faltam <span className="font-bold text-red-600">R$ {(50 - total).toFixed(2)}</span> para
                            frete grátis
                          </p>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-red-600 to-orange-600 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min((total / 50) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>R$ 0</span>
                            <span>R$ 50</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm lg:text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">R$ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm lg:text-base">
                      <span className="text-gray-600 flex items-center space-x-1">
                        <Truck className="h-4 w-4" />
                        <span>Entrega</span>
                      </span>
                      <span className={`font-semibold ${taxaEntrega === 0 ? "text-green-600" : ""}`}>
                        {taxaEntrega === 0 ? "Grátis" : `R$ ${taxaEntrega.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-bold text-lg lg:text-xl text-gray-800">Total</span>
                    <span className="font-bold text-xl lg:text-2xl text-green-600">R$ {totalFinal.toFixed(2)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 lg:py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      onClick={() => router.push("/payment")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="h-4 w-4 lg:h-5 lg:w-5" />
                        <span>Ir para o Pagamento</span>
                        <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
                      </div>
                    </Button>

                    <Link href="/">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 py-2 lg:py-3 rounded-lg transition-all duration-300 bg-transparent"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Continuar Comprando
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-1 gap-2 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-xs text-gray-600 p-2 bg-blue-50 rounded">
                      <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span>Compra 100% segura</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600 p-2 bg-green-50 rounded">
                      <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Entrega em 45-60 minutos</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600 p-2 bg-purple-50 rounded">
                      <Package className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <span>Acompanhe via WhatsApp</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
