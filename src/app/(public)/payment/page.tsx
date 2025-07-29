"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart/context"
import { ProgressBar } from "@/components/checkout/ProgressBar"
import { PaymentMethod } from "@/components/checkout/PaymentMethod"
import { OrderSummary } from "@/components/checkout/OrderSumary"
import { SuccessPage } from "@/components/checkout/SucessPage"
import { EmptyCart } from "@/components/checkout/EmptyCart"
import { PaymentSkeleton } from "@/components/checkout/PaymentSkeleton"
import Header from "@/components/header"

export default function PaymentPage() {
  const navigate = useRouter()
  const { items, total: cartTotal, isLoading } = useCart()
  const [formaPagamento, setFormaPagamento] = useState("entrega")
  const [tipoEntrega, setTipoEntrega] = useState("dinheiro")
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = cartTotal
  const taxaEntrega = subtotal > 50 ? 0 : 8.9
  const total = subtotal + taxaEntrega

  // Simulação de validação do formulário (sempre válido nesta versão simplificada)
  const isFormValid = true

  const finalizarPedido = () => {
    setIsProcessing(true)
    // Simular processamento do pedido
    setTimeout(() => {
      setPedidoFinalizado(true)
      setIsProcessing(false)
    }, 3000)
  }

  const handleNewOrder = () => {
    navigate.push("/")
  }

  const handleBackToCart = () => {
    navigate.push("/cart")
  }

  const handleExploreProducts = () => {
    navigate.push("/")
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <PaymentSkeleton />
      </>
    )
  }

  if (pedidoFinalizado) {
    return (
      <>
        <Header />
        <SuccessPage
          formaPagamento={formaPagamento}
          tipoEntrega={tipoEntrega}
          total={total}
          onNewOrder={handleNewOrder}
        />
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <EmptyCart onExploreProducts={handleExploreProducts} />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
        {/* Progress Bar */}
        <ProgressBar currentStep={2} />

        <div className="container py-4 lg:py-8">
          {/* Breadcrumb - Desktop Only */}
          <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <button onClick={handleBackToCart} className="hover:text-red-600 transition-colors">
              Carrinho
            </button>
            <span>/</span>
            <span className="text-gray-800 font-medium">Pagamento</span>
          </div>

          {/* Header */}
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2">Finalizar Pedido</h1>
            <p className="text-gray-600 text-sm lg:text-base">Escolha a forma de pagamento para concluir sua compra</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Payment Form - Mobile First */}
            <div className="lg:col-span-2 space-y-6">
              <PaymentMethod
                formaPagamento={formaPagamento}
                setFormaPagamento={setFormaPagamento}
                tipoEntrega={tipoEntrega}
                setTipoEntrega={setTipoEntrega}
                subtotal={subtotal}
              />
            </div>

            {/* Order Summary - Sticky on Desktop */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <OrderSummary
                tipoEntrega={tipoEntrega}
                onFinalizarPedido={finalizarPedido}
                isFormValid={isFormValid}
                isProcessing={isProcessing}
                onBackToCart={handleBackToCart}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
