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
import { CreditCard, MapPin, Clock, User, QrCode, Banknote, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart/context"
import { useSession } from "next-auth/react"
import { createOrder } from "@/app/actions/order/createOrder"
import { toast } from "sonner"

interface OrderData {
  nome: string
  telefone: string
  email: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  observacoes: string
}

export default function CheckoutPage() {
  const { items, total, clearCart, isLoading } = useCart()
  const { data: session } = useSession()
  const [formaPagamento, setFormaPagamento] = useState("pix")
  const [isProcessing, setIsProcessing] = useState(false)
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false)
  const [numerosPedido, setNumeroPedido] = useState("")

  const [dadosCliente, setDadosCliente] = useState<OrderData>({
    nome: session?.user?.name || "",
    telefone: "",
    email: session?.user?.email || "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    observacoes: "",
  })

  const subtotal = total
  const taxaEntrega = subtotal > 50 ? 0 : 8.9
  const descontoPix = formaPagamento === "pix" ? subtotal * 0.05 : 0
  const totalFinal = subtotal + taxaEntrega - descontoPix

  const handleInputChange = (field: keyof OrderData, value: string) => {
    setDadosCliente((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    return (
      dadosCliente.nome.trim() !== "" &&
      dadosCliente.telefone.trim() !== "" &&
      dadosCliente.endereco.trim() !== "" &&
      dadosCliente.numero.trim() !== "" &&
      dadosCliente.bairro.trim() !== "" &&
      dadosCliente.cep.trim() !== ""
    )
  }

  const finalizarPedido = async () => {
    if (!session?.user) {
      toast.error("Você precisa estar logado para finalizar o pedido")
      return
    }

    if (!isFormValid()) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    setIsProcessing(true)

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        category: item.product.category,
      }))

      const orderData = {
        items: orderItems,
        total: totalFinal,
        paymentMethod: formaPagamento,
        customerData: dadosCliente,
        deliveryFee: taxaEntrega,
        discount: descontoPix,
      }

      const result = await createOrder(orderData)

      if (result.success) {
        setNumeroPedido(result.orderId!)
        setPedidoFinalizado(true)
        await clearCart()
        toast.success("Pedido criado com sucesso!")
      } else {
        toast.error(result.message || "Erro ao criar pedido")
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error)
      toast.error("Erro interno do servidor")
    } finally {
      setIsProcessing(false)
    }
  }

  if (pedidoFinalizado) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Pedido Confirmado!</h2>
            <p className="text-gray-600 mb-6">
              Seu pedido foi recebido e está sendo preparado. Você receberá atualizações via WhatsApp.
            </p>
            <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-lg">
              <p>
                <strong>Número do Pedido:</strong> #{numerosPedido}
              </p>
              <p>
                <strong>Total:</strong> R$ {totalFinal.toFixed(2)}
              </p>
              <p>
                <strong>Pagamento:</strong> {formaPagamento === "pix" ? "PIX" : "Na entrega"}
              </p>
              <p>
                <strong>Tempo estimado:</strong> 45-60 minutos
              </p>
            </div>

            {formaPagamento === "pix" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 mb-2">
                  📱 Você receberá o QR Code do PIX via WhatsApp em instantes
                </p>
              </div>
            )}

            <Link href="/">
              <Button className="w-full bg-red-600 hover:bg-red-700">Fazer Novo Pedido</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
      <div className="container py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Carrinho vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos ao carrinho para continuar com o checkout.</p>
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700">Voltar às Compras</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Dados */}
        <div className="space-y-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Dados Pessoais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={dadosCliente.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={dadosCliente.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={dadosCliente.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Endereço de Entrega */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Endereço de Entrega</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input
                    id="endereco"
                    value={dadosCliente.endereco}
                    onChange={(e) => handleInputChange("endereco", e.target.value)}
                    placeholder="Rua, Avenida..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    value={dadosCliente.numero}
                    onChange={(e) => handleInputChange("numero", e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={dadosCliente.complemento}
                    onChange={(e) => handleInputChange("complemento", e.target.value)}
                    placeholder="Apto, Bloco..."
                  />
                </div>
                <div>
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input
                    id="bairro"
                    value={dadosCliente.bairro}
                    onChange={(e) => handleInputChange("bairro", e.target.value)}
                    placeholder="Nome do bairro"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={dadosCliente.cep}
                  onChange={(e) => handleInputChange("cep", e.target.value)}
                  placeholder="00000-000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={dadosCliente.observacoes}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  placeholder="Instruções especiais para entrega, cortes específicos..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Forma de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Forma de Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={formaPagamento} onValueChange={setFormaPagamento}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="pix" id="pix" />
                  <QrCode className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <Label htmlFor="pix" className="font-medium">
                      PIX
                    </Label>
                    <p className="text-sm text-gray-600">Pagamento instantâneo via PIX</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    5% desconto
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="entrega" id="entrega" />
                  <Banknote className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <Label htmlFor="entrega" className="font-medium">
                      Pagamento na Entrega
                    </Label>
                    <p className="text-sm text-gray-600">Dinheiro ou cartão na entrega</p>
                  </div>
                </div>
              </RadioGroup>

              {formaPagamento === "pix" && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ Após confirmar o pedido, você receberá o QR Code do PIX para pagamento
                  </p>
                </div>
              )}

              {formaPagamento === "entrega" && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">💳 Aceitamos dinheiro, cartão de débito e crédito na entrega</p>
                </div>
              )}
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
              {/* Produtos */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Image
                      src={item.product.image || "/placeholder.svg?height=50&width=50"}
                      alt={item.product.name}
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantity}kg × R$ {item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-medium">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totais */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>

                {formaPagamento === "pix" && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto PIX (5%)</span>
                    <span>-R$ {descontoPix.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxa de Entrega</span>
                  <span className={taxaEntrega === 0 ? "text-green-600" : ""}>
                    {taxaEntrega === 0 ? "Grátis" : `R$ ${taxaEntrega.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-red-600">R$ {totalFinal.toFixed(2)}</span>
              </div>

              {/* Tempo de Entrega */}
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Tempo estimado: 45-60 minutos</span>
              </div>

              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
                onClick={finalizarPedido}
                disabled={!isFormValid() || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Pedido"
                )}
              </Button>

              <div className="text-center text-xs text-gray-600">
                <p>🔒 Seus dados estão seguros</p>
                <p>📱 Acompanhe seu pedido via WhatsApp</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
