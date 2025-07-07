"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Beef } from "lucide-react"
import Link from "next/link"
import { useCart } from "../components/cart/context"

export default function Header() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Beef className="h-8 w-8 text-red-600" />
          <span className="text-2xl font-bold text-red-600">Casa de Carnes Duarte</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-red-600 transition-colors">
            Início
          </Link>
          <Link href="#produtos" className="text-sm font-medium hover:text-red-600 transition-colors">
            Produtos
          </Link>
          <Link href="#sobre" className="text-sm font-medium hover:text-red-600 transition-colors">
            Sobre
          </Link>
        </nav>

        <Link href="/cart">
          <Button variant="outline" size="sm" className="relative bg-transparent">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{itemCount}</Badge>
            )}
          </Button>
        </Link>
      </div>
    </header>
  )
}
