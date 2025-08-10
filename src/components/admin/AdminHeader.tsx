"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  Beef,
  Sparkles,
  X,
  Menu,
  Package,
  ShoppingCart,
  AlertTriangle,
  CreditCard,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getAdminNotifications, getUnreadNotificationsCount } from "@/app/actions/dashboard/notifications"
import type { Notification } from "@/app/actions/dashboard/notifications"
import { toast } from "react-hot-toast"

export default function AdminHeader() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)

  const loadNotifications = async () => {
    setIsLoadingNotifications(true)
    try {
      const [notificationsData, unreadCountData] = await Promise.all([
        getAdminNotifications(),
        getUnreadNotificationsCount(),
      ])
      setNotifications(notificationsData)
      setUnreadCount(unreadCountData)
    } catch (error) {
      console.error("Erro ao carregar notificações:", error)
      toast.error("Erro ao carregar notificações")
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    // Atualizar notificações a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4 text-blue-600" />
      case "stock":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-green-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implementar busca global
      toast.success(`Buscando por: ${searchQuery}`)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3 flex-wrap gap-2">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <Beef className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">Painel Admin</h1>
              <p className="text-sm text-gray-600">Casa de Carnes Duarte</p>
            </div>
          </div>

          {/* Mobile Search Input */}
          {isMobileSearchOpen && (
            <div className="w-full md:hidden">
              <form onSubmit={handleSearch} className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar pedidos, produtos, clientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-12 py-2 w-full"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={() => setIsMobileSearchOpen(false)}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </Button>
              </form>
            </div>
          )}

          {/* Ações (Desktop + Mobile) */}
          <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-2">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 mt-6">
                    <Button variant="ghost" onClick={() => setIsMobileSearchOpen(true)}>
                      <Search className="mr-2 h-5 w-5" />
                      Buscar
                    </Button>
                    <Link href="/profile">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-5 w-5" />
                        Perfil
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-5 w-5" />
                      Configurações
                    </Button>
                    <Button variant="destructive" onClick={() => signOut()} className="w-full justify-start">
                      <LogOut className="mr-2 h-5 w-5" />
                      Sair
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex w-72">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar produtos, pedidos, usuários..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg text-sm"
                />
              </form>
            </div>

            {/* Notificações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-600 text-white rounded-full p-0 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadNotifications}
                    disabled={isLoadingNotifications}
                    className="text-xs"
                  >
                    {isLoadingNotifications ? "Carregando..." : "Atualizar"}
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer hover:bg-gray-50">
                        <div className="flex items-start space-x-3 w-full">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                              {notification.unread && <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Nenhuma notificação</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t">
                    <Button variant="ghost" size="sm" className="w-full text-orange-600 hover:text-orange-700">
                      Ver todas ({notifications.length})
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {session?.user?.image ? (
                      <AvatarImage src={session.user.image || "/placeholder.svg"} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                        {session?.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="p-2">
                  <p className="font-medium text-sm">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" /> Perfil
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Configurações
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="destructive"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
