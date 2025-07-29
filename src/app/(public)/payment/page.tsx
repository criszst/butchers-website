'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/context";
import { ProgressBar } from "@/components/checkout/ProgressBar";
import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { OrderSummary } from "@/components/checkout/OrderSumary";
import { SuccessPage } from "@/components/checkout/SucessPage";
import { EmptyCart } from "@/components/checkout/EmptyCart";
import Header from "@/components/header";

export default function CheckoutPage() {
  const navigate = useRouter();
  const { items, total: cartTotal } = useCart();
  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartTotal;
  const taxaEntrega = subtotal > 50 ? 0 : 8.9;
  const descontoPix = formaPagamento === "pix" ? subtotal * 0.05 : 0;

  // Simulação de validação do formulário (sempre válido nesta versão simplificada)
  const isFormValid = true;

  const finalizarPedido = () => {
    setIsProcessing(true);
    // Simular processamento do pedido
    setTimeout(() => {
      setPedidoFinalizado(true);
      setIsProcessing(false);
    }, 3000);
  };

  const handleNewOrder = () => {
    navigate.push("/");
  };

  const handleBackToCart = () => {
    navigate.push("/");
  };

  const handleExploreProducts = () => {
    navigate.push("/");
  };

  if (pedidoFinalizado) {
    return (
      <SuccessPage
        formaPagamento={formaPagamento}
        descontoPix={descontoPix}
        onNewOrder={handleNewOrder}
      />
    );
  }

  if (items.length === 0) {
    return <EmptyCart onExploreProducts={handleExploreProducts} />;
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      {/* Progress Bar */}
      <ProgressBar currentStep={2} />

      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Finalizar Pedido
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Preencha seus dados para concluir a compra
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          {/* Payment Form */}
          <div className="xl:col-span-2 space-y-6">
            <PaymentMethod
              formaPagamento={formaPagamento}
              setFormaPagamento={setFormaPagamento}
              subtotal={subtotal}
            />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary
              formaPagamento={formaPagamento}
              onFinalizarPedido={finalizarPedido}
              isFormValid={isFormValid}
              isProcessing={isProcessing}
              onBackToCart={handleBackToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}