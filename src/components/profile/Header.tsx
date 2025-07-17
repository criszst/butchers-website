"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Beef, LogOut, Search, Bell, ShoppingCart, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ProfileHeaderProps {
  userName: string | null | undefined
  notificationCount?: number
  cartItemCount?: number
  onSignOut?: () => void
}

export default function ProfileHeader({
  userName,
  notificationCount = 3,
  cartItemCount = 2,
  onSignOut,
}: ProfileHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const notifications = [
    { id: 1, message: "Seu pedido #001 foi entregue", time: "2h atrás", unread: true },
    { id: 2, message: "Nova promoção: 20% off em carnes premium", time: "1 dia atrás", unread: true },
    { id: 3, message: "Avalie seu último pedido", time: "3 dias atrás", unread: false },
  ]

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Seção Esquerda - Logo e Navegação */}
          <div className="flex items-center space-x-4">
            <Link href={'/'}>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Voltar ao início</span>
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Beef className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
                <p className="text-sm text-gray-600">Gerencie suas informações e preferências</p>
              </div>
            </div>
          </div>

          {/* TODO: implement a function that searchs across configurations */}
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar produtos, pedidos, configurações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
              />
            </div>
          </div>

          {/* Seção Direita - Ações do Usuário */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Barra de Pesquisa Mobile */}
            <Button variant="ghost" size="sm" className="md:hidden text-gray-600 hover:text-gray-800">
              <Search className="h-5 w-5" />
            </Button>

            {/* Carrinho */}
            <Button variant="ghost" size="sm" className="relative text-gray-600 hover:text-gray-800 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center p-0">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Notificações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center p-0">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                      <div className="flex items-start space-x-3 w-full">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? "bg-orange-600" : "bg-gray-300"}`}
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

            {/* Menu Mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden text-gray-600 hover:text-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Botão Sair (Desktop) */}
            <Button
              variant="outline"
              className="hidden sm:flex text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent transition-colors"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar produtos, pedidos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
              />
            </div>
            <Button
              variant="outline"
              className="w-full text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent transition-colors justify-center"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
