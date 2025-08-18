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
  BarChart3,
  Users,
  Truck,
  Home,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAdminNotifications, getUnreadNotificationsCount } from "@/app/actions/dashboard/notifications"
import type { Notification } from "@/app/actions/dashboard/notifications"
import { toast } from "react-hot-toast"

interface AdminHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function AdminHeader({ activeTab, onTabChange }: AdminHeaderProps) {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "produtos", label: "Produtos", icon: Package },
    { id: "pedidos", label: "Pedidos", icon: ShoppingCart },
    { id: "usuarios", label: "Usuários", icon: Users },
    { id: "fornecedores", label: "Fornecedores", icon: Truck },
    { id: "analises", label: "Análises", icon: BarChart3 },
    { id: "configs", label: "Configurações", icon: Settings },
  ]

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



  return (
    <>
      {/* Header Principal */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-sm  transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo com animação */}
            <div className="flex items-center space-x-3 group">
              <div className="relative transform transition-all duration-300 hover:scale-105 group-hover:rotate-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl hover:from-red-700 hover:to-orange-700">
                  <Beef className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:bg-yellow-300">
                  <Sparkles className="h-2 w-2 text-white animate-pulse" />
                </div>
              </div>
              <div className="hidden sm:block transition-all duration-300 group-hover:translate-x-1">
                <h1 className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                  Painel Admin
                </h1>
                <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-orange-500">
                  Casa de Carnes Duarte
                </p>
              </div>
            </div>

            {/* Ações Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Desktop Search com animação */}
  

              {/* Notificações com animação */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative transition-all duration-300 hover:bg-orange-50 hover:scale-105 active:scale-95"
                  >
                    <Bell className="h-5 w-5 text-gray-600 transition-all duration-300 hover:text-orange-600" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-600 text-white rounded-full p-0 flex items-center justify-center animate-pulse transition-all duration-300 hover:scale-110">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 animate-in slide-in-from-top-2 duration-300">
                  <div className="p-3 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notificações</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadNotifications}
                      disabled={isLoadingNotifications}
                      className="text-xs transition-all duration-300 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {isLoadingNotifications ? <div className="animate-spin">⟳</div> : "Atualizar"}
                    </Button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className="p-3 cursor-pointer hover:bg-gray-50 transition-all duration-200 animate-in slide-in-from-right-1"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start space-x-3 w-full">
                            <div className="flex-shrink-0 mt-1 transition-transform duration-300 hover:scale-110">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 animate-pulse" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500 animate-in fade-in duration-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300 animate-pulse" />
                        <p className="text-sm">Nenhuma notificação</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t animate-in slide-in-from-bottom-1 duration-300">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-all duration-300"
                      >
                        Ver todas ({notifications.length})
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Avatar com animação */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    <Avatar className="h-8 w-8 transition-all duration-300 hover:ring-2 hover:ring-orange-300">
                      {session?.user?.image ? (
                        <AvatarImage src={session.user.image || "/placeholder.svg"} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-red-600 to-orange-600 text-white transition-all duration-300 hover:from-red-700 hover:to-orange-700">
                          {session?.user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-in slide-in-from-top-2 duration-300">
                  <div className="p-2 animate-in fade-in duration-500">
                    <p className="font-medium text-sm">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild className="transition-all duration-200 hover:bg-orange-50">
                    <Link href="/perfil">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 transition-transform duration-300 hover:scale-110" />
                        Perfil
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="transition-all duration-200 hover:bg-red-50">
                    <Button
                      variant="destructive"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full justify-start transition-all duration-300 hover:scale-105"
                    >
                      <LogOut className="mr-2 h-4 w-4 transition-transform duration-300 hover:translate-x-1" />
                      Sair
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Ações Mobile */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Mobile Search Toggle com animação */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="transition-all duration-300 hover:bg-orange-50 hover:scale-105 active:scale-95"
              >
                <Search
                  className={`h-5 w-5 transition-all duration-300 ${isMobileSearchOpen ? "text-orange-600 rotate-90" : "text-gray-600"}`}
                />
              </Button>

              {/* Mobile Menu com animação */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative transition-all duration-300 hover:bg-orange-50 hover:scale-105 active:scale-95"
                  >
                    <Menu className="h-5 w-5 transition-all duration-300 hover:text-orange-600" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-600 text-white rounded-full p-0 flex items-center justify-center animate-bounce">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 animate-in slide-in-from-right duration-300">
                  <div className="flex flex-col space-y-4 mt-6">
                    {/* User Info com animação */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-orange-50 animate-in slide-in-from-top-1">
                      <Avatar className="h-10 w-10 transition-all duration-300 hover:scale-105">
                        {session?.user?.image ? (
                          <AvatarImage src={session.user.image || "/placeholder.svg"} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                            {session?.user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{session?.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                      </div>
                    </div>

                    {/* Notifications com animação */}
                    <div className="space-y-2 animate-in slide-in-from-top-2" style={{ animationDelay: "100ms" }}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">Notificações</h3>
                        <Badge variant="secondary" className="animate-pulse">
                          {unreadCount}
                        </Badge>
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {notifications.slice(0, 3).map((notification, index) => (
                          <div
                            key={notification.id}
                            className="p-2 bg-gray-50 rounded text-xs transition-all duration-300 hover:bg-orange-50 animate-in slide-in-from-right-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-gray-600 truncate">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Menu Items com animação */}
                    <div className="space-y-2 animate-in slide-in-from-top-3" style={{ animationDelay: "200ms" }}>
                      <Link href="/profile">
                        <Button
                          variant="ghost"
                          className="w-full justify-start transition-all duration-300 hover:bg-orange-50 hover:translate-x-1"
                        >
                          <User className="mr-2 h-4 w-4 transition-transform duration-300 hover:scale-110" />
                          Perfil
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full justify-start transition-all duration-300 hover:scale-105"
                      >
                        <LogOut className="mr-2 h-4 w-4 transition-transform duration-300 hover:translate-x-1" />
                        Sair
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>


        </div>

        {/* Desktop Tabs com animações */}
        <div className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList className="h-12 bg-transparent border-none p-0 space-x-8">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="h-12 px-6 bg-transparent border-b-4 rounded-12 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent  text-gray-600 data-[state=active]:text-orange-600 hover:text-orange-500 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group relative"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center space-x-2 transition-all duration-300">
                        <Icon
                          className={`h-4 w-4 transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                        />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      {/* Indicador de hover */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation com animações */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg animate-in slide-in-from-bottom duration-500">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id.toString())}
                className={`flex-shrink-0 flex flex-col items-center justify-center px-3 py-2 min-w-[80px] transition-all duration-300 relative group ${
                  isActive
                    ? "text-orange-600 bg-orange-50 scale-105"
                    : "text-gray-600 hover:text-orange-500 hover:bg-gray-50 hover:scale-105"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon
                  className={`h-5 w-5 mb-1 transition-all duration-300 ${
                    isActive ? "text-orange-600 scale-110" : "text-gray-600 group-hover:scale-110"
                  }`}
                />
                <span
                  className={`text-xs font-medium truncate transition-all duration-300 ${
                    isActive ? "text-orange-600" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-600 animate-in slide-in-from-left duration-300" />
                )}
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-lg bg-orange-200 opacity-0 scale-0 transition-all duration-300 group-active:opacity-30 group-active:scale-100" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="md:hidden h-16" />
    </>
  )
}
