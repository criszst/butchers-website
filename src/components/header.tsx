"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, ChevronDown, Settings, User, Heart, Package, LogOut, Bell } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/components/cart/context"
import MiniCart from "@/components/cart/mini-cart"
import ModernLogo from "@/components/ModernLogo"
import EnhancedCartButton from "@/components/cart/ButtonCart"

import type { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

export default function Header() {
  const { itemCount } = useCart()
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { data: session } = useSession()
  const [user, setUser] = useState<Session | null>(session)

  const openMiniCart = (item?: any) => {
    if (item) setLastAddedItem(item)
    setIsMiniCartOpen(true)
  }

  const closeMiniCart = () => {
    setIsMiniCartOpen(false)
    setLastAddedItem(null)
  }

  const handleLogout = () => {
    // Simular logout
    setUser(null)
    setIsUserMenuOpen(false)
  }

    useEffect(() => {
    if (session) {   
    setUser(session)
    }
  }, [session])



  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo Moderna */}
          <Link href="/" className="flex items-center">
            <ModernLogo size="sm" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              Início
            </Link>
            <a
              href="#produtos"
              className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              Produtos
            </a>
            <a
              href="#sobre"
              className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              Sobre
            </a>
            <a
              href="#contato"
              className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              Contato
            </a>
          </nav>

          {/* Right Side */}
        
            {/* Enhanced Cart Button */}
            <EnhancedCartButton onClick={() => openMiniCart()} />
            <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-gray-200 shadow-md border border-gray-200 transition-discrete duration-300 hover:shadow-lg"
                >
                  {/* Avatar */}
                  {user.user?.image ? (
                    <img
                      src={user.user.image || "/placeholder.svg"}
                      alt={user.user.name ?? undefined}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-sm border-2 border-gray-300">
                      {user.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  {/* Nome do usuário - apenas em telas maiores */}
                  <span className="hidden sm:block text-sm font-semibold text-gray-800 max-w-[100px] truncate">
                    {user.user?.name || "Usuário"}
                  </span>

                  {/* Ícone de dropdown */}
                  <ChevronDown
                    className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    {/* Overlay para fechar o menu */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                      {/* Header do Menu */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                        <div className="flex items-center space-x-3">
                          {user.user?.image ? (
                            <img
                              src={user.user.image || "/placeholder.svg"}
                              alt={user.user.name ?? undefined}
                              className="w-10 h-10 rounded-full border-2 border-red-200 object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-amber-500 text-white font-bold text-lg border-2 border-red-200">
                              {user.user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{user.user?.name || "Usuário"}</p>
                            <p className="text-xs text-gray-600">{user.user?.email || "usuario@email.com"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/perfil"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 bg-gradient-to-r to-orange-20 hover:from-amber-100 hover:to-gray-100 transition-colors duration-500"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 text-gray-500" />
                          <span>Meu Perfil</span>
                        </Link>

                        <Link
                          href="/pedidos"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 bg-gradient-to-r to-orange-20 hover:from-amber-100 hover:to-gray-100  transition-colors duration-500"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="h-4 w-4 text-gray-500" />
                          <span>Meus Pedidos</span>
                          <Badge className="ml-auto bg-red-100 text-red-800 text-xs">3</Badge>
                        </Link>

                        <Link
                          href="/favoritos"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 bg-gradient-to-r  to-orange-20 hover:from-amber-100 hover:to-gray-100  transition-colors duration-500"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4 text-gray-500" />
                          <span>Favoritos</span>
                        </Link>

                        <Link
                          href="/notificacoes"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 bg-gradient-to-r to-orange-20 hover:from-amber-100 hover:to-gray-100  transition-colors duration-500"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Bell className="h-4 w-4 text-gray-500" />
                          <span>Notificações</span>
                          <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
                        </Link>

                        <div className="border-t border-gray-100 my-2"></div>

                        <Link
                          href="/configuracoes"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 bg-gradient-to-r to-orange-20 hover:from-amber-100 hover:to-gray-100 transition-colors duration-500"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 text-gray-500" />
                          <span>Configurações</span>
                        </Link>

                        <button
                          onClick={() => signOut({ callbackUrl: '/'})}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4 text-red-500" />
                          <span>Sair</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Button variant="secondary" size="sm" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2">
                  <Link href="/register" className="block w-full h-full">
                    Criar conta
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </>
            )}

            <Button size="sm" className="bg-red-600 hover:bg-red-700 hidden lg:inline-flex px-6 py-2 h-10">
              Fazer Pedido
            </Button>
          </div>
        </div>
      </header>

      {/* Mini Cart */}
      <MiniCart isOpen={isMiniCartOpen} onClose={closeMiniCart} lastAddedItem={lastAddedItem} />
    </>
  )
}
