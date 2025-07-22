"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Search, Settings, LogOut, User, Beef, Sparkles, X } from "lucide-react"

export default function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const notifications = [
    { id: 1, message: "Novo pedido #1247 recebido", time: "2 min atrás", unread: true },
    { id: 2, message: "Estoque baixo: Picanha Premium", time: "15 min atrás", unread: true },
    { id: 3, message: "Pagamento confirmado #1245", time: "1h atrás", unread: false },
  ]

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between py-3 lg:py-4">
          {/* Logo e Título */}
          <div className="flex items-center space-x-2 lg:space-x-4 min-w-0">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="relative">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Beef className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-1 w-1 lg:h-1.5 lg:w-1.5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate">Admin Panel</h1>
                <p className="text-xs lg:text-sm text-gray-600 truncate">Casa de Carnes Duarte</p>
              </div>
            </div>
          </div>

          {/* Barra de Pesquisa Central - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar produtos, pedidos, usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Ações do Admin */}
          <div className="flex items-center space-x-1 lg:space-x-4">
            {/* Pesquisa Mobile */}
            <div className="md:hidden">
              {isMobileSearchOpen ? (
                <div className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full"
                        autoFocus
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsMobileSearchOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 p-2"
                  onClick={() => setIsMobileSearchOpen(true)}
                >
                  <Search className="h-4 w-4 lg:h-5 lg:w-5" />
                </Button>
              )}
            </div>

            {/* Notificações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative text-gray-600 hover:text-gray-800 p-2">
                  <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center p-0">
                    2
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 lg:w-80">
                <div className="p-3 border-b">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                      <div className="flex items-start space-x-3 w-full">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.unread ? "bg-red-600" : "bg-gray-300"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <Button variant="ghost" size="sm" className="w-full text-orange-600 hover:text-orange-700">
                    Ver todas as notificações
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Menu do Admin */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs lg:text-sm">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 lg:w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">Admin</p>
                    <p className="w-[180px] lg:w-[200px] truncate text-xs text-muted-foreground">
                      admin@casadecarnesduarte.com
                    </p>
                  </div>
                </div>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
