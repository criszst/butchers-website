"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState } from "react"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  price: number
  image?: string | null
  category: string
  stock: number
  available: boolean
  priceWeightAmount?: number | null
  priceWeightUnit?: string | null
}

interface CartItem {
  id: string
  product: Product
  quantity: number // Quantidade em gramas
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  lastAddedItem: Product | null
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "REFRESH_CART" }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "SET_LAST_ADDED_ITEM"; payload: Product | null }

const CartContext = createContext<{
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
  lastAddedItem: Product | null
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
} | null>(null)

const formatWeightDisplay = (kilos: number): string => {
  return `${(kilos).toFixed(1)}kg`
}

const calculateItemPrice = (item: CartItem): number => {
  const product = item.product

  if (!product.priceWeightAmount || !product.priceWeightUnit) {
    return product.price * item.quantity
  }


  const pricePerKg = product.price / product.priceWeightAmount
  return pricePerKg * item.quantity
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload
      const existingItemIndex = state.items.findIndex((item) => item.product.id === product.id)

      let newItems: CartItem[]
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item,
        )
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity: Math.min(quantity, product.stock),
        }
        newItems = [...state.items, newItem]
      }

      const total = newItems.reduce((sum, item) => sum + calculateItemPrice(item), 0)
      const itemCount = newItems.length

      return {
        items: newItems,
        total,
        itemCount,
        lastAddedItem: product,
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.product.id !== action.payload.productId)

      const total = newItems.reduce((sum, item) => sum + calculateItemPrice(item), 0)
      const itemCount = newItems.length

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      }
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload
      const newItems = state.items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(Math.max(0, quantity), item.product.stock) }
            : item,
        )
        .filter((item) => item.quantity > 0)

      const total = newItems.reduce((sum, item) => sum + calculateItemPrice(item), 0)
      const itemCount = newItems.length

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      }
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
        lastAddedItem: null,
      }

    case "REFRESH_CART": {
      const total = state.items.reduce((sum, item) => sum + calculateItemPrice(item), 0)
      const itemCount = state.items.length
      return { ...state, total, itemCount }
    }

    case "SET_CART": {
      const items = action.payload
      const total = items.reduce((sum, item) => sum + calculateItemPrice(item), 0)
      const itemCount = items.length
      return {
        ...state,
        items,
        total,
        itemCount,
      }
    }

    case "SET_LAST_ADDED_ITEM": {
      return {
        ...state,
        lastAddedItem: action.payload,
      }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    lastAddedItem: null,
  })

  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "SET_CART", payload: parsedCart })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        localStorage.removeItem("cart")
      }
    }
  }, [])


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items))
  }, [state.items])


  useEffect(() => {
    if (state.lastAddedItem) {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_LAST_ADDED_ITEM", payload: null })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state.lastAddedItem])

  const addItem = async (product: Product, quantity = 1) => {
    try {
      setIsLoading(true)

     
      if (!product.available) {
        toast.error(`❌ ${product.name} não está disponível no momento`, {
          description: "Este produto foi temporariamente removido do estoque.",
          duration: 4000,
        })
        return
      }

      if (product.stock === 0) {
        toast.error(`😔 ${product.name} está esgotado`, {
          description: "Produto fora de estoque. Tente novamente mais tarde.",
          duration: 4000,
        })
        return
      }

      if (product.stock < quantity) {
        const displayStock = formatWeightDisplay(product.stock)
        toast.error(`⚠️ Estoque insuficiente para ${product.name}`, {
          description: `Temos apenas ${displayStock} disponível. Ajuste a quantidade.`,
          duration: 4000,
        })
        return
      }


      const existingItem = state.items.find((item) => item.product.id === product.id)
      const currentQuantity = existingItem ? existingItem.quantity : 0
      const totalQuantity = currentQuantity + quantity

      if (totalQuantity > product.stock) {
        const availableQuantity = product.stock - currentQuantity
        if (availableQuantity > 0) {
          dispatch({ type: "ADD_ITEM", payload: { product, quantity: availableQuantity } })
          const displayAvailable = formatWeightDisplay(availableQuantity)
          const displayStock = formatWeightDisplay(product.stock)
          toast.warning(`⚠️ Quantidade ajustada para ${product.name}`, {
            description: `Adicionado apenas ${displayAvailable} devido ao estoque limitado (${displayStock} disponível).`,
            duration: 5000,
          })
        } else {
          const displayStock = formatWeightDisplay(product.stock)
          toast.error(`🛒 ${product.name} já está no carrinho`, {
            description: `Você já tem a quantidade máxima disponível (${displayStock}) no carrinho.`,
            duration: 4000,
          })
        }
        return
      }

      dispatch({ type: "ADD_ITEM", payload: { product, quantity } })
      const displayQuantity = formatWeightDisplay(quantity)

      toast.success(`✅ ${product.name} adicionado ao carrinho`, {
        description: `Você adicionou ${displayQuantity} de ${product.name} ao seu carrinho.`,
        duration: 4000,
        closeButton: true,
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast.error("❌ Erro ao adicionar produto ao carrinho", {
        description: "Tente novamente em alguns instantes.",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (productId: number) => {
    try {
      setIsLoading(true)
      const item = state.items.find((item) => item.product.id === productId)
      dispatch({ type: "REMOVE_ITEM", payload: { productId } })
      if (item) {
        toast.success(`🗑️ ${item.product.name} removido do carrinho`, {
          duration: 4000,
          description: `Você removeu ${item.product.name} do seu carrinho.`,
          closeButton: true,
        })
      }
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast.error("Erro ao remover item do carrinho")
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true)
      const item = state.items.find((item) => item.product.id === productId)
      if (!item) return


      if (quantity < 0) {
        toast.warning("⚠️ Quantidade não pode ser negativa")
        return
      }

      if (quantity > item.product.stock) {
        const displayStock = formatWeightDisplay(item.product.stock)
        toast.warning(`⚠️ Estoque limitado para ${item.product.name}`, {
          description: `Temos apenas ${displayStock} disponível. Quantidade ajustada automaticamente.`,
          duration: 4000,
        })
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity: item.product.stock } })
        return
      }

      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } })
    } catch (error) {
      console.error("Error updating item quantity:", error)
      toast.error("Erro ao atualizar quantidade")
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setIsLoading(true)
      dispatch({ type: "CLEAR_CART" })
      toast.success("🧹 Carrinho limpo com sucesso")
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast.error("Erro ao limpar carrinho")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshCart = async () => {
    try {
      setIsLoading(true)

      dispatch({ type: "REFRESH_CART" })
      toast.success("🔄 Carrinho atualizado")
    } catch (error) {
      console.error("Error refreshing cart:", error)
      toast.error("Erro ao atualizar carrinho")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
        isLoading,
        lastAddedItem: state.lastAddedItem,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
