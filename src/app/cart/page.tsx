"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Beef } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function CarrinhoPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [cupomDesconto, setCupomDesconto] = useState("")
  const [desconto, setDesconto] = useState(0)

  useEffect(() => {
    const savedCart = localStorage.getItem("carrinho")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(cartItems))
  }, [cartItems])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantidade: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const aplicarCupom = () => {
    const cuponsValidos = {
      PRIMEIRA10: 10,
      CARNE20: 20,
      PREMIUM15: 15,
    }

    if (cuponsValidos[cupomDesconto as keyof typeof cuponsValidos]) {
      setDesconto(cuponsValidos[cupomDesconto as keyof typeof cuponsValidos])
    } else {
      alert("Cupom inválido!")
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantidade, 0)
  const valorDesconto = (subtotal * desconto) / 100
  const taxaEntrega = subtotal > 50 ? 0 : 8.9
  const total = subtotal - valorDesconto + taxaEntrega

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Beef className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-red-600">Açougue Premium</span>
            </Link>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar às Compras
              </Button>
            </Link>
          </div>
        </header>

        <div className="container py-16">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-8">Adicione alguns produtos deliciosos ao seu carrinho!</p>
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700">Continuar Comprando</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Beef className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">Açougue Premium</span>
          </Link>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    Meu Carrinho ({cartItems.length} {cartItems.length === 1 ? "item" : "itens"})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Image
                      src={item.imagem || "/placeholder.svg"}
                      alt={item.nome}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.nome}</h3>
                      <p className="text-sm text-gray-600">{item.descricao}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-bold text-red-600">R$ {item.price.toFixed(2)}/kg</span>
                        {item.promocao && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Promoção
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{item.quantidade}kg</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>

                  {desconto > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({desconto}%)</span>
                      <span>-R$ {valorDesconto.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Taxa de Entrega</span>
                    <span>{taxaEntrega === 0 ? "Grátis" : `R$ ${taxaEntrega.toFixed(2)}`}</span>
                  </div>

                  {subtotal < 50 && (
                    <p className="text-sm text-gray-600">Faltam R$ {(50 - subtotal).toFixed(2)} para frete grátis!</p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-red-600">R$ {total.toFixed(2)}</span>
                </div>

                {/* Cupom de Desconto */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cupom de Desconto</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite o cupom"
                      value={cupomDesconto}
                      onChange={(e) => setCupomDesconto(e.target.value.toUpperCase())}
                    />
                    <Button variant="outline" onClick={aplicarCupom}>
                      Aplicar
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>Cupons disponíveis:</p>
                    <p>• PRIMEIRA10 (10% off)</p>
                    <p>• CARNE20 (20% off)</p>
                    <p>• PREMIUM15 (15% off)</p>
                  </div>
                </div>

                <Link href="/pagamento">
                  <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                    Finalizar Pedido
                  </Button>
                </Link>

                <div className="text-center text-sm text-gray-600">
                  <p>🔒 Compra 100% segura</p>
                  <p>📦 Entrega em até 2 horas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
