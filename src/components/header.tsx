"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Menu,
  ChevronDown,
  Settings,
  User,
  Heart,
  Package,
  LogOut,
  Bell,
  X,
  Crown,
  Search,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import { useCart } from "@/components/cart/context"
import MiniCart from "@/components/cart/mini-cart"
import ModernLogo from "@/components/ModernLogo"
import EnhancedCartButton from "@/components/cart/ButtonCart"
import type { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { getUserProfile } from "@/app/actions/user-profile"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { getProductsAction } from "@/app/actions/product"

interface SearchSuggestion {
  id: string
  name: string
  category: string
  price: number
}

function SearchDropdown({
  query,
  suggestions,
  onSelect,
  isOpen,
}: {
  query: string
  suggestions: SearchSuggestion[]
  onSelect: (suggestion: SearchSuggestion) => void
  isOpen: boolean
}) {
  if (!isOpen || !query.trim()) return null

  return (
    <AnimatePresence>
      <motion.div
        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-80 overflow-y-auto"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {suggestions.length > 0 ? (
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                onClick={() => onSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-500">{suggestion.category}</div>
                </div>
                <div className="text-red-600 font-semibold">R$ {suggestion.price.toFixed(2)}</div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Nenhum produto encontrado</p>
            <p className="text-sm">Tente buscar por outro termo</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default function Header() {
  const { itemCount } = useCart()
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data: session } = useSession()
  const [user, setUser] = useState<Session | null>(session)
  const [isAdmin, setAdmin] = useState(false)

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchSuggestions([])
        setIsSearchOpen(false)
        return
      }

      setIsSearching(true)
      try {
        const { products } = await getProductsAction({
          search: searchQuery,
          category: "all",
        })

        const suggestions = products.slice(0, 5).map((product) => ({
          id: product.id.toString(),
          name: product.name,
          category: product.category,
          price: product.price,
        }))

        setSearchSuggestions(suggestions)
        setIsSearchOpen(true)
      } catch (error) {
        console.error("Erro na busca:", error)
        setSearchSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSelect = (suggestion: SearchSuggestion) => {
    router.push(`/product/${suggestion.id}`)
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        getUserProfile(session.user.email).then((user) => {
          if (user?.isAdmin) {
            setAdmin(true)
          }
        })
      }
    }
    fetchUser()
  }, [session?.user?.email])

  useEffect(() => {
    if (session) {
      setUser(session)
    }
  }, [session])

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

  const menuItems = [
    { href: "/", label: "Início", icon: Package },
    { href: "/product", label: "Produtos", icon: Package },
    // { href: "/#sobre", label: "Sobre", icon: User },
    // { href: "/#contato", label: "Contato", icon: Bell },
  ]

  const userMenuItems = [
    { href: "/perfil#perfil", label: "Meu Perfil", icon: User },
    { href: "/perfil#pedidos", label: "Meus Pedidos", icon: Package, badge: "3" },
    { href: "/favoritos", label: "Favoritos", icon: Heart },
    { href: "/perfil#notificacoes", label: "Notificações", icon: Bell, hasNotification: true },
    { href: "/perfil#configuracoes", label: "Configurações", icon: Settings },
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: Crown, isAdmin: true }] : []),
  ]

  const openMiniCart = () => {
    setIsMiniCartOpen(true)
  }

  const closeMiniCart = () => {
    setIsMiniCartOpen(false)
  }

  return (
    <>
      <motion.header
        className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4">
          {/* Mobile Header */}
          <div className="flex lg:hidden h-16 items-center justify-between">
            {/* Mobile Menu Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 hover:bg-red-50 rounded-xl transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <motion.div animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }} transition={{ duration: 0.3 }}>
                  <Menu className="h-6 w-6 text-gray-700" />
                </motion.div>
              </Button>
            </motion.div>

            {/* Mobile Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            >
              <Link href="/" className="flex items-center">
                <ModernLogo size="sm" />
              </Link>
            </motion.div>

            {/* Mobile Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
              <Button
                variant="outline"
                size="sm"
                className="relative bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 transition-all duration-300 p-2 rounded-xl shadow-sm hover:shadow-md"
                onClick={() => openMiniCart()}
              >
                <motion.div
                  className="relative"
                  animate={itemCount > 0 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <ShoppingCart className="h-5 w-5 text-red-600" />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge className="h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-600 to-red-700 animate-pulse shadow-lg border-2 border-white flex items-center justify-center">
                          {itemCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Button>
            </motion.div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex h-16 items-center justify-between">
            {/* Left - Search */}
            <motion.div
              className="flex-1 max-w-md"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 focus:border-red-500 rounded-lg transition-all duration-300 hover:shadow-sm"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </form>
                <SearchDropdown
                  query={searchQuery}
                  suggestions={searchSuggestions}
                  onSelect={handleSearchSelect}
                  isOpen={isSearchOpen}
                />
              </div>
            </motion.div>

            {/* Center - Logo */}
            <motion.div
              className="flex-shrink-0 mx-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            >
              <Link href="/" className="flex items-center">
                <ModernLogo size="md" />
              </Link>
            </motion.div>

            {/* Right - User & Cart */}
            <motion.div
              className="flex-1 flex items-center justify-end space-x-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Navigation Links */}
              <nav className="hidden xl:flex items-center space-x-6 mr-6">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200 relative group"
                    >
                      {item.label}
                      <motion.div
                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"
                        whileHover={{ width: "100%" }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Cart Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <EnhancedCartButton onClick={() => openMiniCart()} />
              </motion.div>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {user.user?.image ? (
                      <motion.img
                        src={user.user.image || "/placeholder.svg"}
                        alt={user.user.name ?? undefined}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 object-cover"
                        whileHover={{ scale: 1.1 }}
                      />
                    ) : (
                      <motion.div
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-sm border-2 border-gray-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        {user.user?.name?.charAt(0).toUpperCase() || "U"}
                      </motion.div>
                    )}
                    <span className="text-sm font-semibold text-gray-800 max-w-[100px] truncate">
                      {user.user?.name?.toString() || "Usuário"}
                    </span>
                    <motion.div animate={{ rotate: isUserMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                        <motion.div
                          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
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

                          <div className="py-2">
                            {userMenuItems.map((item, index) => {
                              const Icon = item.icon
                              return (
                                <motion.div
                                  key={item.label}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <Link
                                    href={item.href}
                                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                                    onClick={() => setIsUserMenuOpen(false)}
                                  >
                                    <Icon className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
                                    <span className="group-hover:text-gray-900">{item.label}</span>
                                    {item.badge && (
                                      <Badge className="ml-auto bg-red-100 text-red-800 text-xs">{item.badge}</Badge>
                                    )}
                                    {item.hasNotification && (
                                      <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
                                    )}
                                  </Link>
                                </motion.div>
                              )
                            })}
                            <div className="border-t border-gray-100 my-2"></div>

                            <motion.button
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left group"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: (userMenuItems.length + 1) * 0.05 }}
                            >
                              <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-700 transition-colors" />
                              <span className="group-hover:text-red-700">Sair</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 h-10 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Link href="/register" className="block w-full h-full">
                      Criar conta
                    </Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Mobile Menu Header */}
              <motion.div
                className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-600 to-red-700"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Mobile Search */}
              <motion.div
                className="p-4 border-b bg-gray-50"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar produtos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-red-500 transition-all duration-300"
                    />
                  </div>
                </form>
              </motion.div>

              {/* Mobile Menu Content */}
              <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                {/* User Info */}
                {user && (
                  <motion.div
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {user.user?.image ? (
                      <img
                        src={user.user.image || "/placeholder.svg"}
                        alt={user.user.name ?? undefined}
                        className="w-12 h-12 rounded-full border-2 border-red-200 object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-lg border-2 border-red-200">
                        {user.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{user.user?.name || "Usuário"}</p>
                      <p className="text-xs text-gray-600 truncate">{user.user?.email || "usuario@email.com"}</p>
                    </div>
                  </motion.div>
                )}

                <nav className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-300 group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5 text-gray-500 group-hover:text-red-600 transition-colors" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </motion.div>
                    )
                  })}

                  {user && (
                    <>
                      <motion.div
                        className="border-t pt-4 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        {userMenuItems.map((item, index) => {
                          const Icon = item.icon
                          return (
                            <motion.div
                              key={item.label}
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.9 + index * 0.1 }}
                            >
                              <Link
                                href={item.href}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-300 group"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <Icon className="h-5 w-5 text-gray-500 group-hover:text-red-600 transition-colors" />
                                <span className="font-medium">{item.label}</span>
                                {item.badge && (
                                  <Badge className="ml-auto bg-red-100 text-red-800 text-xs">{item.badge}</Badge>
                                )}
                                {item.hasNotification && (
                                  <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
                                )}
                              </Link>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    </>
                  )}
                </nav>

                <motion.div
                  className="border-t pt-4"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {user ? (
                    <motion.button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Sair</span>
                    </motion.button>
                  ) : (
                    <Link href="/register">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Criar Conta
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mini Cart */}
      <MiniCart isOpen={isMiniCartOpen} onClose={closeMiniCart} />
    </>
  )
}
