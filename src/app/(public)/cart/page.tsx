"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart/context"
import { toast } from "sonner"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount, isLoading } = useCart()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState<number | null>(null)

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
    try {
      await removeItem(productId)
      toast.success("Item removido do carrinho")
    } catch (error) {
      toast.error("Erro ao remover item")
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Carrinho vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos deliciosos ao seu carrinho para continuar!</p>
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700">
                <ArrowRight className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Produtos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>
                  Meu Carrinho ({itemCount} {itemCount === 1 ? "item" : "itens"})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Imagem do Produto */}
                  <div className="relative">
                    <Image
                      src={item.product.image || "/placeholder.svg?height=80&width=80"}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  </div>

                  {/* Informações do Produto */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{item.product.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-bold text-red-600">R$ {item.product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">
                        /{item.product.priceWeightAmount}
                        {item.product.priceWeightUnit}
                      </span>
                    </div>
                  </div>

                  {/* Controles de Quantidade */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        disabled={isUpdating === item.product.id || item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="font-semibold min-w-[3rem] text-center">
                        {isUpdating === item.product.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mx-auto"></div>
                        ) : (
                          `${item.quantity}kg`
                        )}
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        disabled={isUpdating === item.product.id}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Botão Remover */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-3"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remover
                    </Button>
                  </div>

                  {/* Subtotal do Item */}
                  <div className="text-right">
                    <span className="font-bold text-lg">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resumo do Pedido */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informações de Frete */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
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

              {/* Cálculos */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Entrega</span>
                  <span className={taxaEntrega === 0 ? "text-green-600 font-medium" : ""}>
                    {taxaEntrega === 0 ? "Grátis" : `R$ ${taxaEntrega.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-red-600">R$ {totalFinal.toFixed(2)}</span>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3"
                  size="lg"
                  onClick={() => router.push("/checkout")}
                >
                  Finalizar Pedido
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Continuar Comprando
                  </Button>
                </Link>
              </div>

              {/* Informações Adicionais */}
              <div className="text-center text-xs text-gray-600 space-y-1">
                <p>🔒 Compra 100% segura</p>
                <p>📱 Acompanhe seu pedido via WhatsApp</p>
                <p>⏱️ Entrega em 45-60 minutos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
