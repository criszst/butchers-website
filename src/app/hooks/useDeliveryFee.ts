"use client"

import { useMemo } from "react"

interface DeliveryFeeCalculation {
  isFree: boolean
  fee: number
  reason: string
  savings?: number
}

interface UseDeliveryFeeProps {
  orderTotal: number
  deliveryMethod?: string
  storeSettings?: {
    deliveryFee: number
    freeDeliveryMinimum: number
  }
}

export function useDeliveryFee({
  orderTotal,
  deliveryMethod,
  storeSettings,
}: UseDeliveryFeeProps): DeliveryFeeCalculation {
  return useMemo(() => {
    // Se não tiver configurações da loja, usar valores padrão
    const deliveryFee = storeSettings?.deliveryFee ?? 10.0
    const freeDeliveryMinimum = storeSettings?.freeDeliveryMinimum ?? 150.0

    // Se for retirada no açougue, frete é sempre grátis
    if (deliveryMethod === "PICKUP") {
      return {
        isFree: true,
        fee: 0,
        reason: "Retirada no açougue",
      }
    }

    // Se for delivery, verificar se atinge o mínimo para frete grátis
    if (orderTotal >= freeDeliveryMinimum) {
      return {
        isFree: true,
        fee: 0,
        reason: `Frete grátis para pedidos acima de R$ ${freeDeliveryMinimum.toFixed(2)}`,
        savings: deliveryFee,
      }
    }

    // Caso contrário, cobra a taxa de entrega
    return {
      isFree: false,
      fee: deliveryFee,
      reason: `Taxa de entrega: R$ ${deliveryFee.toFixed(2)}`,
    }
  }, [orderTotal, deliveryMethod, storeSettings])
}

// Função utilitária para usar em server components
export function calculateDeliveryFee(
  orderTotal: number,
  deliveryMethod?: string,
  storeSettings?: {
    deliveryFee: number
    freeDeliveryMinimum: number
  },
): DeliveryFeeCalculation {
  const deliveryFee = storeSettings?.deliveryFee ?? 10.0
  const freeDeliveryMinimum = storeSettings?.freeDeliveryMinimum ?? 150.0

  // Se for retirada no açougue, frete é sempre grátis
  if (deliveryMethod === "PICKUP") {
    return {
      isFree: true,
      fee: 0,
      reason: "Retirada no açougue",
    }
  }

  // Se for delivery, verificar se atinge o mínimo para frete grátis
  if (orderTotal >= freeDeliveryMinimum) {
    return {
      isFree: true,
      fee: 0,
      reason: `Frete grátis para pedidos acima de R$ ${freeDeliveryMinimum.toFixed(2)}`,
      savings: deliveryFee,
    }
  }

  // Caso contrário, cobra a taxa de entrega
  return {
    isFree: false,
    fee: deliveryFee,
    reason: `Taxa de entrega: R$ ${deliveryFee.toFixed(2)}`,
  }
}
