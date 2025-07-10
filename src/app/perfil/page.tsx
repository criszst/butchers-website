"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, MapPin, Package, Settings, ArrowLeft, Beef, Home } from "lucide-react"
import Link from "next/link"
import Image from "next"
import { useSession } from "next-auth/react"


import ProfileInfo from "@/components/profile/ProfileInfo"
import UserStats from "@/components/profile/UserStats"
import Achievements from "@/components/profile/achievements"
import AddressesTab from "@/components/profile/AddressesTab"
import OrdersTab from "@/components/profile/OrdersTab"
import SettingsTab from "@/components/profile/SettingsTab"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("perfil")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (session?.user) {
      setUser(session.user)
    } else {
      // Simular usuário logado para desenvolvimento
      const simulatedUser = {
        name: "João Silva",
        email: "joao@email.com",
        image: null,
      }
      setUser(simulatedUser)
    }
  }, [session])

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header Limpo */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="outline"
                  className="bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <Home className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Voltar ao Início</span>
                </Button>
              </Link>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center space-x-3">
                {/* TODO: implement a unique logo with a beaultiful recort */}
                <div className="w-20 h-20 rounded flex items-center justify-center shadow-lg">
                  <img src="https://butchers-website.vercel.app/logo/logo.jpg"/>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Meu Perfil
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">Gerencie suas informações e preferências</p>
                </div>
              </div>
            </div>
            {/* Stats Neutras */}
           
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Tabs Neutras */}
          <div className="bg-white rounded-3xl p-2 shadow-lg border border-gray-100">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-transparent">
              <TabsTrigger
                value="perfil"
                className="flex items-center space-x-2 py-4 px-6 rounded-2xl data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-gray-50 text-gray-700 font-medium"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger
                value="enderecos"
                className="flex items-center space-x-2 py-4 px-6 rounded-2xl data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-gray-50 text-gray-700 font-medium"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Endereços</span>
              </TabsTrigger>
              <TabsTrigger
                value="pedidos"
                className="flex items-center space-x-2 py-4 px-6 rounded-2xl data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-gray-50 text-gray-700 font-medium"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
              <TabsTrigger
                value="configuracoes"
                className="flex items-center space-x-2 py-4 px-6 rounded-2xl data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-gray-50 text-gray-700 font-medium"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Configurações</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab: Perfil */}
          <TabsContent value="perfil" className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Informações Pessoais */}
              <div className="lg:col-span-2">
                <ProfileInfo user={user} setUser={setUser} />
              </div>

              {/* Sidebar com Estatísticas e Conquistas */}
              <div className="space-y-8">
                <UserStats />
                <Achievements />
              </div>
            </div>
          </TabsContent>

          {/* Tab: Endereços */}
          <TabsContent value="enderecos" className="space-y-8 animate-in fade-in duration-500">
            <AddressesTab />
          </TabsContent>

          {/* Tab: Pedidos */}
          <TabsContent value="pedidos" className="space-y-8 animate-in fade-in duration-500">
            <OrdersTab />
          </TabsContent>

          {/* Tab: Configurações */}
          <TabsContent value="configuracoes" className="space-y-8 animate-in fade-in duration-500">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
