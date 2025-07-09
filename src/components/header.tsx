"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Beef, Menu } from 'lucide-react'
import Link from "next/link"
import { useCart } from "@/components/cart/context"
import MiniCart from "@/components/cart/mini-cart"

export default function Header() {
  const { itemCount } = useCart()
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)

  const openMiniCart = (item?: any) => {
    if (item) setLastAddedItem(item)
    setIsMiniCartOpen(true)
  }

  const closeMiniCart = () => {
    setIsMiniCartOpen(false)
    setLastAddedItem(null)
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-1 sm:space-x-5">
            <Beef className="h-8 w-8 text-red-600 ml-1 sm:ml-10" />
            <span className="text-xl sm:text-2xl md:text-xl font-bold text-red-600">Casa de Carne Duarte</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-red-600 transition-colors">
              Início
            </Link>
            <a href="#produtos" className="text-sm font-medium hover:text-red-600 transition-colors">
              Produtos
            </a>
            <a href="#sobre" className="text-sm font-medium hover:text-red-600 transition-colors">
              Sobre
            </a>
            <a href="#contato" className="text-sm font-medium hover:text-red-600 transition-colors">
              Contato
            </a>
          </nav>

          <div className="flex items-end space-x-4">
            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              className="relative bg-transparent hover:bg-red-50 border-red-200"
              onClick={() => openMiniCart()}
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-600 hover:bg-red-700 animate-bounce">
                  {itemCount}
                </Badge>
              )}
            </Button>

              <div className="flex justify-end end">
              <Button
                variant="secondary"
                size="sm"
                className="relative bg-amber-600 hover:bg-amber-700"
              >
                <Link href="/register">
                  Criar conta
                </Link>
              </Button>
          </div>

            {/* <Button size="sm" className="bg-red-600 hover:bg-red-700 hidden sm:inline-flex">
              Fazer Pedido
            </Button> */}
          </div>
        </div>
      </header>

      {/* Mini Cart */}
      <MiniCart isOpen={isMiniCartOpen} onClose={closeMiniCart} lastAddedItem={lastAddedItem} />
    </>
  )
}
