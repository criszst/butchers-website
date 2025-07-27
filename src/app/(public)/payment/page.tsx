"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  MapPin,
  Clock,
  User,
  ArrowLeft,
  QrCode,
  Banknote,
  CheckCircle,
  Shield,
  Truck,
  Package,
  Phone,
  Mail,
  Home,
  MapPinIcon,
  Gift,
  Sparkles,
  Timer,
  Star,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import { useCart } from "@/components/cart/context"

export default function CheckoutPage() {
  const { items, total: cartTotal, itemCount } = useCart()
  const [formaPagamento, setFormaPagamento] = useState("pix")
  const [dadosCliente, setDadosCliente] = useState({
    nome: "",
    telefone: "",
    email: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    observacoes: "",
  })
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const subtotal = cartTotal
  const taxaEntrega = subtotal > 50 ? 0 : 8.9
  const descontoPix = formaPagamento === "pix" ? subtotal * 0.05 : 0
  const total = subtotal + taxaEntrega - descontoPix

  const handleInputChange = (field: string, value: string) => {
    setDadosCliente((prev) => ({ ...prev, [field]: value }))
  }

  const finalizarPedido = () => {
    setIsProcessing(true)
    // Simular processamento do pedido
    setTimeout(() => {
      setPedidoFinalizado(true)
      setIsProcessing(false)
    }, 3000)
  }

  const isFormValid =
    dadosCliente.nome &&
    dadosCliente.telefone &&
    dadosCliente.endereco &&
    dadosCliente.numero &&
    dadosCliente.bairro &&
    dadosCliente.cep

  if (pedidoFinalizado) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="text-center p-12">
              {/* Success Animation */}
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in duration-500">
                  <CheckCircle className="h-16 w-16 text-white animate-pulse" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>

              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Pedido Confirmado!
              </h2>

              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Seu pedido foi recebido com sucesso e já está sendo preparado com todo carinho. Você receberá
                atualizações em tempo real via WhatsApp.
              </p>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                  <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">Número do Pedido</p>
                  <p className="text-2xl font-bold text-blue-600">#AC{Math.floor(Math.random() * 10000)}</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
                  <Timer className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">Tempo Estimado</p>
                  <p className="text-2xl font-bold text-orange-600">45-60 min</p>
                </div>
              </div>

              {/* Payment Method Confirmation */}
              {formaPagamento === "pix" && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl mb-8 border-2 border-green-200">
                  <QrCode className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-green-800 mb-2">Pagamento via PIX</h3>
                  <p className="text-sm text-green-700">
                    O QR Code para pagamento foi enviado para seu WhatsApp. Você economizou R$ {descontoPix.toFixed(2)}{" "}
                    com o desconto PIX!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link href="/">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Gift className="h-5 w-5 mr-2" />
                    Fazer Novo Pedido
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 py-3 rounded-xl transition-all duration-300 bg-transparent"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Avaliar Experiência
                </Button>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-blue-800 font-medium">Compra Protegida</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Phone className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-green-800 font-medium">Suporte 24/7</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Truck className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-purple-800 font-medium">Entrega Rápida</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="container py-16 text-center">
            <Card className="max-w-lg mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner mb-8">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Carrinho vazio
                </h2>
                <p className="text-gray-600 mb-8">Adicione produtos ao carrinho para continuar</p>
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
        {/* Progress Bar */}
        <div className="bg-white border-b shadow-sm">
          <div className="container py-4">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600">Carrinho</span>
              </div>
              <div className="w-16 h-1 bg-green-600 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <span className="text-sm font-medium text-blue-600">Checkout</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-bold text-sm">3</span>
                </div>
                <span className="text-sm font-medium text-gray-500">Confirmação</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Finalizar Pedido
            </h1>
            <p className="text-gray-600">Preencha seus dados para concluir a compra</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Formulário de Dados */}
            <div className="xl:col-span-2 space-y-6">


            

              {/* Forma de Pagamento */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden animate-in slide-in-from-left duration-1000">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl">Forma de Pagamento</span>
                    <Badge className="ml-auto bg-purple-100 text-purple-800">Passo 3</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <RadioGroup value={formaPagamento} onValueChange={setFormaPagamento} className="space-y-4">
                    <div
                      className={`relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 cursor-pointer ${
                        formaPagamento === "pix"
                          ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="pix" id="pix" className="border-2 border-green-500" />
                        <div className="p-3 bg-green-100 rounded-full">
                          <QrCode className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="pix" className="font-bold text-lg text-gray-800 cursor-pointer">
                            PIX - Pagamento Instantâneo
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Aprovação imediata e segura</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-3 py-1">
                            5% OFF
                          </Badge>
                          <p className="text-xs text-green-700 mt-1">Economize R$ {(subtotal * 0.05).toFixed(2)}</p>
                        </div>
                      </div>
                      {formaPagamento === "pix" && (
                        <div className="mt-4 p-4 bg-white/80 rounded-lg border border-green-200 animate-in slide-in-from-top duration-300">
                          <div className="flex items-center space-x-2 text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Após confirmar, você receberá o QR Code para pagamento
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 cursor-pointer ${
                        formaPagamento === "entrega"
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="entrega" id="entrega" className="border-2 border-blue-500" />
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Banknote className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="entrega" className="font-bold text-lg text-gray-800 cursor-pointer">
                            Pagamento na Entrega
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Dinheiro, débito ou crédito</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="border-blue-500 text-blue-700">
                            Tradicional
                          </Badge>
                        </div>
                      </div>
                      {formaPagamento === "entrega" && (
                        <div className="mt-4 p-4 bg-white/80 rounded-lg border border-blue-200 animate-in slide-in-from-top duration-300">
                          <div className="flex items-center space-x-2 text-blue-800">
                            <CreditCard className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Aceitamos todas as formas de pagamento na entrega
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Resumo do Pedido */}
            <div>
              <Card className="sticky top-24 shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl">Resumo do Pedido</span>
                    <Badge className="ml-auto bg-orange-100 text-orange-800">{itemCount} itens</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Produtos */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative">
                          <Image
                            src={item.product.image || "/placeholder.svg?height=60&width=60"}
                            alt={item.product.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover shadow-sm"
                          />
                          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-600">
                            {item.quantity}kg × R$ {item.product.price.toFixed(2)}
                          </p>
                        </div>
                        <span className="font-bold text-green-600">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  {/* Cálculos */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-semibold text-lg">R$ {subtotal.toFixed(2)}</span>
                    </div>

                    {formaPagamento === "pix" && (
                      <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 border border-green-200">
                        <span className="text-green-700 flex items-center space-x-2">
                          <Gift className="h-4 w-4" />
                          <span>Desconto PIX (5%)</span>
                        </span>
                        <span className="font-semibold text-lg text-green-600">-R$ {descontoPix.toFixed(2)}</span>
                      </div>
                    )}

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
                      R$ {total.toFixed(2)}
                    </span>
                  </div>

                  {/* Tempo de Entrega */}
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-800">Entrega Expressa</p>
                      <p className="text-sm text-blue-600">45-60 minutos</p>
                    </div>
                  </div>

                  {/* Botão de Finalizar */}
                  <Button
                    className={`w-full font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 ${
                      isFormValid
                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    size="lg"
                    onClick={finalizarPedido}
                    disabled={!isFormValid || isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Processando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Confirmar Pedido</span>
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    )}
                  </Button>

                  {/* Voltar ao Carrinho */}
                  <Link href="/cart">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 py-3 rounded-xl transition-all duration-300 bg-transparent"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar ao Carrinho
                    </Button>
                  </Link>

                  {/* Informações de Segurança */}
                  <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 text-sm text-gray-600 p-3 rounded-lg bg-blue-50">
                      <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Seus dados estão protegidos</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 p-3 rounded-lg bg-green-50">
                      <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
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
