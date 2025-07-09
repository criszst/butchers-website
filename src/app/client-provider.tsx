"use client"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/components/cart/context"

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  )
}