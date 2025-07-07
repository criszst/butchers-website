"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Truck, CheckCircle, QrCode } from "lucide-react"
import { useCart } from "@/components/cart/context"

export default function CheckoutPage() {
  const [pedidoCompleto, setPedidoCompleto] = useState(false)
  const { items, total } = useCart()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => setPedidoCompleto(true), 2000)
  }

  if (pedidoCompleto) {
    return (
      <div className="container py-16 text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Pedido Confirmado!</h2>
        <p className="text-gray-600 mb-6">Seu pedido foi recebido e está sendo preparado para entrega.</p>
        <p className="font-semibold">Pedido #AC{Math.floor(Math.random() * 10000)}</p>
        <p className="text-sm text-gray-500 mt-2">Tempo estimado: 45-60 minutos</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" required />
                  </div>
                  <div>
                    <Label htmlFor="sobrenome">Sobrenome</Label>
                    <Input id="sobrenome" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input id="endereco" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" required />
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" type="tel" required />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="pix">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="pix" id="pix" />
                    <QrCode className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <Label htmlFor="pix">PIX</Label>
                      <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cartao" id="cartao" />
                    <CreditCard className="h-5 w-5" />
                    <div className="flex-1">
                      <Label htmlFor="cartao">Cartão de Crédito</Label>
                      <p className="text-sm text-gray-600">Visa, Mastercard, Elo</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="entrega" id="entrega" />
                    <Truck className="h-5 w-5" />
                    <div className="flex-1">
                      <Label htmlFor="entrega">Pagamento na Entrega</Label>
                      <p className="text-sm text-gray-600">Dinheiro ou cartão</p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" size="lg">
              Confirmar Pedido
            </Button>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x{item.quantity}kg
                  </span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-red-600">R$ {total.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>🚚 Entrega grátis</p>
                <p>⏱️ Tempo estimado: 45-60 min</p>
                <p>🔒 Pagamento seguro</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
