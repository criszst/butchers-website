"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="container py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-red-600 mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/20 to-orange-600/20 animate-pulse"></div>
                </div>
                <p className="text-gray-600 font-medium">Carregando seu carrinho...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="container py-16">
            <Card className="max-w-lg mx-auto text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                    <ShoppingCart className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs font-bold">0</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Carrinho vazio
                </h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Que tal adicionar alguns produtos deliciosos ao seu carrinho?
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Package className="h-5 w-5 mr-2" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container py-8">
          {/* Header do Carrinho */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Meu Carrinho
            </h1>
            <p className="text-gray-600">
              {itemCount} {itemCount === 1 ? "item selecionado" : "itens selecionados"}
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Lista de Produtos */}
            <div className="xl:col-span-2">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl">Produtos Selecionados</span>
                    <div className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {itemCount} {itemCount === 1 ? "item" : "itens"}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className={`group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-red-200 ${
                          removingItems.has(item.product.id)
                            ? "animate-pulse opacity-50"
                            : "animate-in slide-in-from-left duration-300"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Background Gradient on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-50/0 to-orange-50/0 group-hover:from-red-50/50 group-hover:to-orange-50/50 transition-all duration-500 rounded-2xl"></div>

                        <div className="relative flex items-center space-x-6">
                          {/* Imagem do Produto */}
                          <div className="relative flex-shrink-0">
                            <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                              <Image
                                src={item.product.image || "/placeholder.svg?height=100&width=100"}
                                alt={item.product.name}
                                width={100}
                                height={100}
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          </div>

                          {/* Informações do Produto */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <h3 className="font-bold text-xl text-gray-800 truncate group-hover:text-red-700 transition-colors duration-300">
                              {item.product.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                {item.product.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                                R$ {item.product.price.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                /{item.product.priceWeightAmount}
                                {item.product.priceWeightUnit}
                              </span>
                            </div>
                          </div>

                          {/* Controles de Quantidade */}
                          <div className="flex flex-col items-center space-y-4">
                            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 bg-transparent"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                disabled={isUpdating === item.product.id || item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>

                              <div className="min-w-[4rem] text-center">
                                {isUpdating === item.product.id ? (
                                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-600 border-t-transparent mx-auto"></div>
                                ) : (
                                  <span className="font-bold text-lg text-gray-800">{item.quantity}kg</span>
                                )}
                              </div>

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 bg-transparent"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                disabled={isUpdating === item.product.id}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Botão Remover */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.product.id)}
                              disabled={removingItems.has(item.product.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {removingItems.has(item.product.id) ? "Removendo..." : "Remover"}
                            </Button>
                          </div>

                          {/* Subtotal do Item */}
                          <div className="text-right space-y-1">
                            <div className="text-sm text-gray-500">Subtotal</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                              R$ {(item.product.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo do Pedido */}
            <div>
              <Card className="sticky top-24 shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-lg">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl">Resumo do Pedido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Informações de Frete */}
                  <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-r from-gray-50 to-gray-100">
                    {total >= 50 ? (
                      <div className="text-center space-y-3">
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <div className="p-2 bg-green-100 rounded-full">
                            <CheckCircle className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-green-700 text-lg">Frete Grátis Garantido!</p>
                          <p className="text-sm text-green-600">Parabéns! Você economizou R$ 8,90</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">
                            Faltam <span className="font-bold text-red-600 text-lg">R$ {(50 - total).toFixed(2)}</span>{" "}
                            para frete grátis
                          </p>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-red-600 to-orange-600 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                              style={{ width: `${Math.min((total / 50) * 100, 100)}%` }}
                            >
                              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>R$ 0</span>
                            <span>R$ 50</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  {/* Cálculos */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-semibold text-lg">R$ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-700 flex items-center space-x-2">
                        <Truck className="h-4 w-4" />
                        <span>Taxa de Entrega</span>
                      </span>
                      <span className={`font-semibold text-lg ${taxaEntrega === 0 ? "text-green-600" : ""}`}>
                        {taxaEntrega === 0 ? (
                          <span className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>Grátis</span>
                          </span>
                        ) : (
                          `R$ ${taxaEntrega.toFixed(2)}`
                        )}
                      </span>
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                    <span className="font-bold text-xl text-gray-800">Total</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      R$ {totalFinal.toFixed(2)}
                    </span>
                  </div>

                  {/* Botões de Ação */}
                  <div className="space-y-4">
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      size="lg"
                      onClick={() => router.push("/payment")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Finalizar Pedido</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </Button>

                    <Link href="/">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 py-3 rounded-xl transition-all duration-300 bg-transparent"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Continuar Comprando
                      </Button>
                    </Link>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 text-sm text-gray-600 p-3 rounded-lg bg-blue-50">
                      <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Compra 100% segura e protegida</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 p-3 rounded-lg bg-green-50">
                      <Clock className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>Entrega expressa em 45-60 minutos</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 p-3 rounded-lg bg-purple-50">
                      <Package className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span>Acompanhe seu pedido via WhatsApp</span>
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
