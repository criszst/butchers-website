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
import { Input } from "@/components/ui/input"
import {
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
  Check,
  Home,
  Tag,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import { createOrder } from "@/app/actions/order/orders"
import { getUserAddresses } from "@/app/actions/address"
import { AddressModal } from "@/components/address/AddressModal"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { PaymentStatus, type Address } from "@/generated/prisma"
import SuccessPage from "@/components/checkout/SuccessPage"
import { MeatImagePlaceholder } from "@/components/ui/MeatImagePlaceholder"

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

  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  const subtotal = cartTotal
  const deliveryFee = subtotal > 50 ? 0 : 8.9
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0
  const total = subtotal + deliveryFee - couponDiscount

  const availableCoupons = [
    { code: "PRIMEIRA", discount: 20.0, description: "Primeira compra" },
    { code: "ACOUGUE20", discount: 15.0, description: "Desconto de R$ 15,00" },
    { code: "FRETE", discount: 8.9, description: "Frete grátis" },
    { code: "SEGUNDA", discount: 10.0, description: "Segunda sem carne" },
  ]

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(productId)
    } else {
      // Sempre trabalhar em kg com mínimo de 0.1kg
      const minQuantity = 0.1
      const adjustedQuantity = Math.max(newQuantity, minQuantity)
      await updateQuantity(productId, adjustedQuantity)
    }
  }

  const formatQuantityDisplay = (quantity: number): string => {
    // Sempre exibir em kg
    return `${quantity.toFixed(3)}kg`
  }

  const calculateItemPrice = (item: any) => {
    const product = item.product

    // Se não tem priceWeightAmount, usar preço direto
    if (!product.priceWeightAmount) {
      return product.price * item.quantity
    }

    // Sempre trabalhar considerando que está em kg
    // Se priceWeightAmount é 1kg, então o preço é por kg
    // item.quantity já está em kg
    const pricePerKg = product.price / (product.priceWeightAmount || 1)

    return pricePerKg * item.quantity
  }


  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
  }

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find((c) => c.code === couponCode.toUpperCase())
    if (coupon) {
      setAppliedCoupon(coupon)
      toast.success(`Cupom ${coupon.code} aplicado com sucesso!`)
    } else {
      toast.error("Cupom inválido")
    }
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
    if (!session) {
      setShowLoginPrompt(true)
      return
    }

    if (!selectedAddress) {
      toast.error("Selecione um endereço de entrega")
      setShowAddressModal(true)
      return
    }

    if (items.length === 0) {
      toast.error("Carrinho está vazio")
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: Number(item.quantity.toFixed(3)),
          price: item.product.price,
          category: item.product.category,
        })),
        total,
        paymentMethod: paymentType,
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
        couponDiscount,
      }

      const result = await createOrder(orderData)

      if (result.success) {
        setOrderNumber(result.orderNumber || "")
        setOrderSuccess(true)
        await clearCart()
        toast.success("Pedido realizado com sucesso!")
      } else {
        toast.error(result.message || "Erro ao processar pedido")
      }
    } catch (error) {
      console.error("Erro no handleSubmitOrder:", error)
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
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-500" />
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
            <Card className="text-center shadow-lg">
              <CardContent className="p-8">
                <LogIn className="h-16 w-16 mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Login Necessário</h2>
                <p className="text-gray-600 mb-6">Você precisa estar logado para finalizar seu pedido.</p>
                <div className="space-y-3">
                  <Link href="/login">
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Fazer Login</Button>
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
                <Button className="bg-red-500 hover:bg-red-600 text-white">Explorar Produtos</Button>
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatPriceDisplay = (product: any) => {
    const amount = product.priceWeightAmount || 1
    const unit = product.priceWeightUnit || "kg"

    return `${formatPrice(product.price)} por ${amount} kg`
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="container py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      Endereço de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAddress ? (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <p className="font-medium text-green-800">{selectedAddress.name}</p>
                              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Padrão</Badge>
                            </div>
                            <p className="text-sm text-green-700">
                              {selectedAddress.street}, {selectedAddress.number}
                              {selectedAddress.complement && `, ${selectedAddress.complement}`}
                            </p>
                            <p className="text-sm text-green-700">
                              {selectedAddress.neighborhood}, {selectedAddress.city} - {selectedAddress.state}
                            </p>
                            <p className="text-sm text-green-700">CEP: {selectedAddress.cep}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAddressModal(true)}
                            className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent text-xs"
                          >
                            Alterar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">Nenhum endereço cadastrado</p>
                        <Button
                          onClick={() => setShowAddressModal(true)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Endereço
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Payment Method */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                        <CreditCard className="h-4 w-4 text-white" />
                      </div>
                      Forma de Pagamento
                      <Badge className="ml-auto bg-blue-100 text-blue-800 text-xs">Na Entrega</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium">💳 Pagamento na Entrega</p>
                      <p className="text-xs text-blue-600">
                        Você pagará diretamente ao entregador quando receber seu pedido.
                      </p>
                    </div>

                    <RadioGroup value={paymentType} onValueChange={setPaymentType} className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="dinheiro" id="dinheiro" />
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <div className="flex-1">
                          <Label htmlFor="dinheiro" className="font-medium cursor-pointer text-sm">
                            Dinheiro
                          </Label>
                          <p className="text-xs text-gray-600">Pagamento em espécie</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="credito" id="credito" />
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        <div className="flex-1">
                          <Label htmlFor="credito" className="font-medium cursor-pointer text-sm">
                            Cartão de Crédito
                          </Label>
                          <p className="text-xs text-gray-600">Visa, Mastercard, Elo</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="debito" id="debito" />
                        <Banknote className="h-4 w-4 text-purple-500" />
                        <div className="flex-1">
                          <Label htmlFor="debito" className="font-medium cursor-pointer text-sm">
                            Cartão de Débito
                          </Label>
                          <p className="text-xs text-gray-600">Débito direto da conta</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="vr" id="vr" />
                        <Smartphone className="h-4 w-4 text-orange-500" />
                        <div className="flex-1">
                          <Label htmlFor="vr" className="font-medium cursor-pointer text-sm">
                            Vale Refeição/Alimentação
                          </Label>
                          <p className="text-xs text-gray-600">VR, VA, Sodexo, Ticket</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Coupon Code */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <Tag className="h-4 w-4 text-white" />
                      </div>
                      Código Promocional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appliedCoupon ? (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-800">Cupom aplicado: {appliedCoupon.code}</p>
                            <p className="text-sm text-green-600">Desconto de R$ {appliedCoupon.discount.toFixed(2)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveCoupon}
                            className="text-green-700 hover:text-green-800 hover:bg-green-100"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Digite seu cupom de desconto"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleApplyCoupon}
                            disabled={!couponCode.trim()}
                            className="bg-green-500 hover:bg-green-600 text-white px-6"
                          >
                            Aplicar
                          </Button>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p className="mb-2">Cupons disponíveis:</p>
                          <div className="flex flex-wrap gap-2">
                            {availableCoupons.map((coupon) => (
                              <button
                                key={coupon.code}
                                onClick={() => setCouponCode(coupon.code)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                              >
                                {coupon.code}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      Resumo do Pedido
                      <Badge className="ml-auto bg-red-100 text-red-800 text-xs">
                        {itemCount.toFixed(1)} {itemCount === 1 ? "item" : "itens"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Products List */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {items.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                        >
                          <div className="relative">
                            {item.product.image ? (
                              <Image
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                width={50}
                                height={50}
                                className="rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <MeatImagePlaceholder size="sm" className="w-12 h-12" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-800 truncate">{item.product.name}</p>
                            <p className="text-xs text-gray-600 capitalize">{item.product.category}</p>
                            <p className="text-xs text-gray-500">{formatPriceDisplay(item.product)}</p>
                          </div>
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                const product = item.product
                                const decrement = product.priceWeightUnit === "kg" ? 0.1 : 50
                                handleQuantityChange(product.id, Math.max(item.quantity - decrement, decrement))
                              }}
                              className="w-6 h-6 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full flex items-center justify-center transition-colors"
                            >
                              <Minus className="h-3 w-3 text-gray-600" />
                            </button>
                            <div className="text-center min-w-[60px]">
                              <Input
                                inputMode="numeric"
                                step="0.1"
                                min="0"
                                max={item.product.stock}
                                value={item.quantity.toFixed(3)}
                                onChange={(e) => {
                                  const value = Number.parseFloat(e.target.value);
                                  if (value < 0) {
                                    handleQuantityChange(item.product.id, 0);
                                  } else {
                                    handleQuantityChange(item.product.id, value || 0);
                                  }
                                }}
                                className="w-16 h-8 text-xs text-center border-gray-200 p-1"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {formatQuantityDisplay(item.quantity)}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                const product = item.product
                                const increment = product.priceWeightUnit === "kg" ? 0.1 : 50
                                handleQuantityChange(product.id, item.quantity + increment)
                              }}
                              className="w-6 h-6 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full flex items-center justify-center transition-colors"
                            >
                              <Plus className="h-3 w-3 text-gray-600" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-600 text-sm">
                              {formatPrice(calculateItemPrice(item))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <Truck className="h-3 w-3 mr-1" />
                          Entrega
                        </span>
                        <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                          {deliveryFee === 0 ? "Grátis" : formatPrice(deliveryFee)}
                        </span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Desconto ({appliedCoupon.code})</span>
                          <span>-{formatPrice(appliedCoupon.discount)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span className="text-red-600">{formatPrice(total)}</span>
                      </div>
                    </div>

                    {/* Delivery Time */}
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800 text-sm">Tempo de entrega</p>
                        <p className="text-blue-600 text-xs">45-60 minutos</p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={!selectedAddress || isProcessing || items.length === 0}
                      className={`w-full py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${selectedAddress && !isProcessing && items.length > 0
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Finalizar Pedido
                        </>
                      )}
                    </Button>

                    {/* Continue Shopping */}
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 hover:bg-gray-50 bg-transparent text-sm"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Continuar Comprando
                      </Button>
                    </Link>

                    {/* Security Info */}
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 pt-2">
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
                  </CardContent>
                </Card>
              </motion.div>
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
    </>
  )
}
