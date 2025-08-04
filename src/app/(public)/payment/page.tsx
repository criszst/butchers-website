"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/components/cart/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  DollarSign,
  Smartphone,
  MapPin,
  CheckCircle,
  Loader2,
  Package,
  Truck,
  Clock,
  Shield,
  Plus,
  Minus,
  LogIn,
  Eye,
  Check,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import { createOrder } from "@/app/actions/order/orders"
import { getUserAddresses } from "@/app/actions/address"
import { AddressModal } from "@/components/address/AddressModal"
import { ProductDetailModal } from "@/components/product/modals/ProductDetail"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { PaymentStatus, type Address } from "@/generated/prisma"
import { SuccessPage } from "@/components/checkout/SuccessPage"

export default function PaymentPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, total: cartTotal, itemCount, clearCart, updateQuantity, removeItem } = useCart()
  const [paymentType, setPaymentType] = useState("dinheiro")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)

  const subtotal = cartTotal
  const deliveryFee = subtotal > 50 ? 0 : 8.9
  const total = subtotal + deliveryFee

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(productId)
    } else {
      await updateQuantity(productId, newQuantity)
    }
  }

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  // Check authentication and load addresses
  useEffect(() => {
    const checkUserAndAddresses = async () => {
      if (status === "loading") return
      if (!session) {
        setShowLoginPrompt(true)
        setIsLoadingAddresses(false)
        return
      }
      try {
        const result = await getUserAddresses()
        if (result.success) {
          setAddresses(result.addresses)
          const defaultAddress = result.addresses.find((addr) => addr.isDefault)
          if (defaultAddress) {
            setSelectedAddress(defaultAddress)
          } else if (result.addresses.length === 0) {
            setShowAddressModal(true)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar endereços:", error)
      } finally {
        setIsLoadingAddresses(false)
      }
    }

    checkUserAndAddresses()
  }, [session, status])

  const handleSubmitOrder = async () => {
    console.log("=== INICIANDO SUBMIT ORDER ===")

    if (!session) {
      console.log("Sem sessão")
      setShowLoginPrompt(true)
      return
    }

    if (!selectedAddress) {
      console.log("Sem endereço selecionado")
      toast.error("Selecione um endereço de entrega")
      setShowAddressModal(true)
      return
    }

    if (items.length === 0) {
      console.log(" Carrinho vazio")
      toast.error("Carrinho está vazio")
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          category: item.product.category,
        })),
        total,
        paymentMethod: "entrega",
        paymentType,
        PaymentStatus: PaymentStatus.Pendente,
        customerData: {
          nome: session.user?.name || "",
          email: session.user?.email || "",
          street: selectedAddress.street,
          number: selectedAddress.number,
          complement: selectedAddress.complement ?? "",
          neighborhood: selectedAddress.neighborhood,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country,
          cep: selectedAddress.cep,
        },
        deliveryFee,
      }

      console.log("📦 Dados do pedido preparados:", orderData)

      const result = await createOrder(orderData)
      console.log("📋 Resultado do createOrder:", result)

      if (result.success) {
        console.log("✅ Pedido criado com sucesso!")
        setOrderNumber(result.orderNumber || "")
        setOrderSuccess(true)
        await clearCart()
        toast.success("Pedido realizado com sucesso!")
      } else {
        console.log("❌ Erro ao criar pedido:", result.message)
        toast.error(result.message || "Erro ao processar pedido")
      }
    } catch (error) {
      console.error("❌ Erro no handleSubmitOrder:", error)
      toast.error("Erro interno. Tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddressCreated = async () => {
    const result = await getUserAddresses()
    if (result.success) {
      setAddresses(result.addresses)
      const defaultAddress = result.addresses.find((addr) => addr.isDefault)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress)
      }
    }
  }

  // Loading state
  if (status === "loading" || isLoadingAddresses) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-600" />
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </>
    )
  }

  // Login prompt
  if (showLoginPrompt && !session) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full"
          >
            <Card className="text-center shadow-xl">
              <CardContent className="p-8">
                <LogIn className="h-16 w-16 mx-auto text-red-600 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Login Necessário</h2>
                <p className="text-gray-600 mb-6">Você precisa estar logado para finalizar seu pedido.</p>
                <div className="space-y-3">
                  <Link href="/login">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Fazer Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" className="w-full bg-transparent">
                      Criar Conta
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    )
  }

  // Empty cart
  if (items.length === 0 && !orderSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto text-center shadow-lg">
            <CardContent className="p-8">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Carrinho vazio</h2>
              <p className="text-gray-600 mb-6">Adicione produtos para continuar</p>
              <Link href="/">
                <Button className="bg-red-600 hover:bg-red-700 text-white">Explorar Produtos</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Success page
  if (orderSuccess) {
    return (
      <SuccessPage
        formaPagamento={paymentType}
        tipoEntrega={paymentType}
        total={total}
        onNewOrder={() => {
          setOrderSuccess(false)
          router.push("/")
        }}
      />
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container py-4 lg:py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/cart" className="hover:text-red-600 transition-colors flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Carrinho
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Pagamento</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Column - Shopping Cart */}
            <div>
              <Card className="shadow-lg border-0">
                <CardHeader className="border-b">
                  <CardTitle className="text-2xl font-bold text-gray-800">Carrinho de Compras</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className="relative w-16 h-16 bg-white rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => handleProductClick(item.product)}
                        >
                          <Image
                            src={item.product.image || "/placeholder.svg?height=64&width=64"}
                            alt={item.product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{item.product.category}</p>
                          <p className="text-sm text-gray-500">R$ {item.product.price.toFixed(2)}/kg</p>
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full flex items-center justify-center transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="h-3 w-3 text-gray-600" />
                          </motion.button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}kg</span>
                          <motion.button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full flex items-center justify-center transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="h-3 w-3 text-gray-600" />
                          </motion.button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        Entrega
                      </span>
                      <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                        {deliveryFee === 0 ? "Grátis" : `R$ ${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-red-600">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Continue Shopping */}
                  <Link href="/">
                    <Button variant="outline" className="w-full mt-6 border-gray-300 hover:bg-gray-50 bg-transparent">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continuar Comprando
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Address & Payment */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <Card className="shadow-lg border-0">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                    <MapPin className="h-5 w-5 mr-2 text-red-600" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedAddress ? (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">{selectedAddress.name}</p>
                          <p className="text-sm text-green-600">
                            {selectedAddress.street}, {selectedAddress.number}
                            {selectedAddress.complement && `, ${selectedAddress.complement}`}
                          </p>
                          <p className="text-xs text-green-600">
                            {selectedAddress.neighborhood}, {selectedAddress.city} - {selectedAddress.state}
                          </p>
                          <p className="text-xs text-green-600">CEP: {selectedAddress.cep}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddressModal(true)}
                          className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                        >
                          Alterar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Nenhum endereço cadastrado</p>
                      <Button
                        onClick={() => setShowAddressModal(true)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Endereço
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="shadow-lg border-0">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                    <CreditCard className="h-5 w-5 mr-2 text-red-600" />
                    Forma de Pagamento
                    <Badge className="ml-2 bg-red-100 text-red-800">Na Entrega</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium mb-1">💳 Pagamento na Entrega</p>
                    <p className="text-xs text-blue-600">
                      Você pagará diretamente ao entregador quando receber seu pedido.
                    </p>
                  </div>

                  <RadioGroup value={paymentType} onValueChange={setPaymentType} className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="dinheiro" id="dinheiro" />
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <Label htmlFor="dinheiro" className="font-medium cursor-pointer">
                          Dinheiro
                        </Label>
                        <p className="text-sm text-gray-600">Pagamento em espécie</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="credito" id="credito" />
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <Label htmlFor="credito" className="font-medium cursor-pointer">
                          Cartão de Crédito
                        </Label>
                        <p className="text-sm text-gray-600">Visa, Mastercard, Elo</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="debito" id="debito" />
                      <Banknote className="h-5 w-5 text-purple-600" />
                      <div className="flex-1">
                        <Label htmlFor="debito" className="font-medium cursor-pointer">
                          Cartão de Débito
                        </Label>
                        <p className="text-sm text-gray-600">Débito direto da conta</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="vr" id="vr" />
                      <Smartphone className="h-5 w-5 text-orange-600" />
                      <div className="flex-1">
                        <Label htmlFor="vr" className="font-medium cursor-pointer">
                          Vale Refeição/Alimentação
                        </Label>
                        <p className="text-sm text-gray-600">VR, VA, Sodexo, Ticket</p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button
                onClick={handleSubmitOrder}
                disabled={!selectedAddress || isProcessing || items.length === 0}
                className={`w-full py-4 text-lg font-bold rounded-lg transition-all duration-300 ${
                  selectedAddress && !isProcessing && items.length > 0
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processando Pedido...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Finalizar Pedido - R$ {total.toFixed(2)}
                  </>
                )}
              </Button>

              {/* Security Info */}
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Seguro</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Verificado</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>45-60 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressCreated={handleAddressCreated}
      />

      <ProductDetailModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={selectedProduct}
      />
    </>
  )
}
