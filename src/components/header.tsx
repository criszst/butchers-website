"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, ChevronDown, Settings, User, Heart, Package, LogOut, Bell, X, Crown } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/components/cart/context"
import MiniCart from "@/components/cart/mini-cart"
import ModernLogo from "@/components/ModernLogo"
import EnhancedCartButton from "@/components/cart/ButtonCart"
import type { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { getUserProfile } from "@/app/actions/user-profile"

export default function Header() {
  const { itemCount } = useCart()
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const [user, setUser] = useState<Session | null>(session)
  const [isAdmin, setAdmin] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      getUserProfile(session?.user?.email as string).then((user) => {
        if (user?.isAdmin) {
          setAdmin(true)
        }
      })
    }
    fetchUser()
  }, [session?.user?.email])

  const openMiniCart = (item?: any) => {
    if (item) setLastAddedItem(item)
    setIsMiniCartOpen(true)
  }

  const closeMiniCart = () => {
    setIsMiniCartOpen(false)
    setLastAddedItem(null)
  }

  const handleLogout = () => {
    setUser(null)
    setIsUserMenuOpen(false)
  }

  useEffect(() => {
    if (session) {
      setUser(session)
    }
  }, [session])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo - Responsiva */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <ModernLogo size="sm" className="sm:hidden" />
              <ModernLogo size="md" className="hidden sm:block" />
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Cart Button - Sempre visível mas responsivo */}
              <div className="block sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 transition-all duration-300 p-2"
                  onClick={() => openMiniCart()}
                >
                  <div className="relative">
                    <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                      />
                    </svg>
                    {itemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-600 to-red-700 animate-pulse shadow-lg border-2 border-white">
                        {itemCount}
                      </Badge>
                    )}
                  </div>
                </Button>
              </div>

              {/* Cart Button Desktop */}
              <div className="hidden sm:block">
                <EnhancedCartButton onClick={() => openMiniCart()} />
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg"
                  >
                    {/* Avatar */}
                    {user.user?.image ? (
                      <img
                        src={user.user.image || "/placeholder.svg"}
                        alt={user.user.name ?? undefined}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-gray-300 object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-xs sm:text-sm border-2 border-gray-300">
                        {user.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    {/* Nome do usuário - apenas em telas maiores */}
                    <span className="hidden md:block text-sm font-semibold text-gray-800 max-w-[80px] lg:max-w-[100px] truncate">
                      {user.user?.name?.toString() || "Usuário"}
                    </span>
                    {/* Ícone de dropdown */}
                    <ChevronDown
                      className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-600 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      {/* Overlay */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                      {/* Menu */}
                      <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
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
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-lg border-2 border-red-200">
                                {user.user?.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 text-sm truncate">
                                {user.user?.name || "Usuário"}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {user.user?.email || "usuario@email.com"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/perfil"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4 text-gray-500" />
                            <span>Meu Perfil</span>
                          </Link>
                          <Link
                            href="/perfil"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Package className="h-4 w-4 text-gray-500" />
                            <span>Meus Pedidos</span>
                            <Badge className="ml-auto bg-red-100 text-red-800 text-xs">3</Badge>
                          </Link>
                          <Link
                            href="/favoritos"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="h-4 w-4 text-gray-500" />
                            <span>Favoritos</span>
                          </Link>
                          <Link
                            href="/notificacoes"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Bell className="h-4 w-4 text-gray-500" />
                            <span>Notificações</span>
                            <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
                          </Link>
                          <div className="border-t border-gray-100 my-2"></div>
                          <Link
                            href="/configuracoes"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4 text-gray-500" />
                            <span>Configurações</span>
                          </Link>
                          {isAdmin ? (
                            <Link
                              href="/admin"
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Crown className="h-4 w-4 text-gray-500" />
                              <span>Admin</span>
                            </Link>
                          ) : (
                            <></>
                          )}
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
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
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white xl:inline-flex px-4 lg:px-6 py-2 h-10 text-sm"
                >
                  <Link href="/register" className="block w-full h-full">
                    <span className="hidden sm:inline">Criar conta</span>
                    <span className="sm:hidden">Entrar</span>
                  </Link>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>

              {/* Fazer Pedido Button - Hidden on mobile */}
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 hidden xl:inline-flex px-4 lg:px-6 py-2 h-10 text-sm"
              >
                Fazer Pedido
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden animate-in slide-in-from-right duration-300">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-600 to-red-700">
              <h2 className="text-lg font-semibold text-white">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Content */}
            <div className="p-4 space-y-4">
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Início
                </Link>
                <a
                  href="#produtos"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Produtos
                </a>
                <a
                  href="#sobre"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sobre
                </a>
                <a
                  href="#contato"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contato
                </a>
              </nav>
              <div className="border-t pt-4">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Fazer Pedido
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mini Cart */}
      <MiniCart isOpen={isMiniCartOpen} onClose={closeMiniCart} lastAddedItem={lastAddedItem} />
    </>
  )
}
