"use client"

import { useState } from "react"
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
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function AdminHeader() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const notifications = [
    { id: 1, message: "Novo pedido #1247 recebido", time: "2 min atrás", unread: true },
    { id: 2, message: "Estoque baixo: Picanha Premium", time: "15 min atrás", unread: true },
    { id: 3, message: "Pagamento confirmado #1245", time: "1h atrás", unread: false },
  ]

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
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={() => setIsMobileSearchOpen(false)}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
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
                    <Link href="/perfil">
                      <Button variant="ghost">
                        <User className="mr-2 h-5 flex flex-wrap" />
                        Perfil
                      </Button>
                    </Link>
                    <Button variant="ghost">
                      <Settings className="mr-2 h-5 w-5" />
                      Configurações
                    </Button>
                    <Button variant="destructive" onClick={() => signOut()}>
                      <LogOut className="mr-2 h-5 w-5" />
                      Sair
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex w-72">
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

            {/* Notificações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-600 text-white rounded-full p-0 flex items-center justify-center">
                    2
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="p-3 border-b">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <DropdownMenuItem key={n.id} className="p-3">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${n.unread ? "bg-red-600" : "bg-gray-300"}`}
                        />
                        <div className="text-sm text-gray-900">
                          <p>{n.message}</p>
                          <p className="text-xs text-gray-500">{n.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <Button variant="ghost" size="sm" className="w-full text-orange-600 hover:text-orange-700">
                    Ver todas
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {session?.user?.image ? (
                      <AvatarImage src={session.user.image} />
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
                  <Link href="/perfil">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" /> Perfil
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Configurações
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })} className="w-full">
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
