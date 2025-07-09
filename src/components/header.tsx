"use client"

import { useEffect, useState } from "react"


import Link from "next/link"

import { useSession } from "next-auth/react"
import { Session } from "next-auth"

import MiniCart from "@/components/cart/mini-cart"
import { useCart } from "@/components/cart/context"


import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { ShoppingCart, Beef, Menu, User } from 'lucide-react'

export default function Header() {
  const { itemCount } = useCart()
  const { data: session } = useSession()

  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)
  const [user, setUser] = useState<Session | null>(null)


  useEffect(() => {
    setUser(session)
  }, [session])

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
            <span className="text-xs whitespace-nowrap sm:text-2xl md:text-xl font-bold text-red-600">
              Casa de Carne Duarte
            </span>
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

          <div className="flex items-center space-x-2 sm:space-x-4">

            <Button
              variant="outline"
              size="sm"
              className="relative bg-transparent hover:bg-red-50 border-red-200"
              onClick={() => openMiniCart()}
            >
              <ShoppingCart className="h-4 w-4 sm:h-4 sm:w-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-600 hover:bg-red-700 animate-bounce">
                  {itemCount}
                </Badge>
              )}

            </Button>

            {user ? (
              <>
                <div className="flex items-center space-x-2 px-2 py-1 rounded-full bg-amber-50 shadow border border-gray-500">
                  {/* Avatar */}
                  {user.user?.image ? (
                    <img
                      src={user.user.image}
                      alt={user.user.name ?? undefined}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-amber-500 text-white font-bold text-lg border-2 border-gray-200">
                      {user.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Nome do usuário */}
                  <span className="text-sm font-semibold text-gray-900 max-w-[120px] truncate">
                    {user.user?.name}
                  </span>
                </div>
              </>
            ) :
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 px-3 py-1"
                >

                  <Link href="/register" className="block w-full h-full">
                    Criar conta
                  </Link>

                </Button>

                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </>
            }


          </div>
        </div>
      </header>

      {/* Mini Cart */}
      <MiniCart isOpen={isMiniCartOpen} onClose={closeMiniCart} lastAddedItem={lastAddedItem} />
    </>
  )
}
