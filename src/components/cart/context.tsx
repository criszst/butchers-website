"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { addToCart, removeFromCart, getCartItems, updateCartItemQuantity } from "@/app/actions/cart/cart"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  price: number
  image: string | null
  category: string
  available: boolean
  priceWeightAmount: number | null
  priceWeightUnit: string | null
}

interface CartItem {
  id: string
  quantity: number
  product: Product
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => Promise<void>
    removeItem: (productId: number) => Promise<void> 
    updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  itemCount: number
  isLoading: boolean
  lastAddedItem: Product | null
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState<Product | null>(null)
  const { data: session, status } = useSession()

  // Função para atualizar o resumo do carrinho
  const updateCartSummary = useCallback((cartItems: CartItem[]) => {
    const newTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const newItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    setTotal(newTotal)
    setItemCount(newItemCount)
  }, [])

  // Função para carregar itens do carrinho
  const refreshCart = useCallback(async () => {
    if (status === "loading" || !session?.user) return

    setIsLoading(true)
    try {
      const cartItems = await getCartItems()
      setItems(cartItems)
      updateCartSummary(cartItems)
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error)
      toast.error("Erro ao carregar carrinho")
    } finally {
      setIsLoading(false)
    }
  }, [session, status, updateCartSummary])

  // Carregar carrinho quando o usuário estiver autenticado
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  // Adicionar item ao carrinho
  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      if (!session?.user) {
        toast.error("Faça login para adicionar itens ao carrinho")
        return
      }

      setIsLoading(true)
      try {
        const result = await addToCart(product.id, quantity)

        if (result.success) {
          await refreshCart()
          setLastAddedItem(product)
          toast.success(result.message)

          // Limpar lastAddedItem após 3 segundos
          setTimeout(() => setLastAddedItem(null), 3000)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error("Erro ao adicionar item:", error)
        toast.error("Erro ao adicionar item ao carrinho")
      } finally {
        setIsLoading(false)
      }
    },
    [session, refreshCart],
  )

  // Remover item do carrinho
  const removeItem = useCallback(
    async (productId: number) => {
      if (!session?.user) return

      setIsLoading(true)
      try {
        const result = await removeFromCart(productId)

        if (result.success) {
          await refreshCart()
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error("Erro ao remover item:", error)
        toast.error("Erro ao remover item do carrinho")
      } finally {
        setIsLoading(false)
      }
    },
    [session, refreshCart],
  )

  // Atualizar quantidade
  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!session?.user) return

      setIsLoading(true)
      try {
        const result = await updateCartItemQuantity(productId, quantity)

        if (result.success) {
          await refreshCart()
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error("Erro ao atualizar quantidade:", error)
        toast.error("Erro ao atualizar quantidade")
      } finally {
        setIsLoading(false)
      }
    },
    [session, refreshCart],
  )

  // Limpar carrinho
  const clearCartHandler = useCallback(async () => {
    if (!session?.user) return

    setIsLoading(true)
    try {
      const { clearCart } = await import("@/app/actions/cart/cart")
      const result = await clearCart()

      if (result.success) {
        setItems([])
        setTotal(0)
        setItemCount(0)
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error)
      toast.error("Erro ao limpar carrinho")
    } finally {
      setIsLoading(false)
    }
  }, [session])

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart: clearCartHandler,
    total,
    itemCount,
    isLoading,
    lastAddedItem,
    refreshCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider")
  }
  return context
}
