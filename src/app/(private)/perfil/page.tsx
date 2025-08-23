"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Order, OrderItem } from "@/generated/prisma"
import { getUserOrders } from "@/app/actions/order/orders"
import { updateUserProfile } from "@/app/actions/user-profile"
import { getUserProfile } from "@/app/actions/user-profile"
import ProfileNavigation from "@/components/profile/ProfileNavigation"
import ProfileDetails from "@/components/profile/tabs/ProfileDetails"
import OrdersTab from "@/components/profile/tabs/OrdersTab"
import AddressesTab from "@/components/profile/tabs/AddressesTab"
import NotificationsTab from "@/components/profile/tabs/NotificationsTab"
import ProfileHeader from "@/components/profile/Header"
import { useOrderUpdates } from "@/hooks/useOrderUpdate"
import { toast } from "sonner"
import Header from "@/components/header"
import FavoritesTab from "@/components/profile/tabs/FavoritesTab"
import AchievementsTab from "@/components/profile/tabs/AchievementsTab"

interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  phone?: string | null
  bio?: string | null
  birthDate?: string | null
  cpf?: string | null
  isAdmin: boolean | undefined
}

interface Achievement {
  title: string
  icon: any
  color: string
  earned: boolean
  date: string
}

export default function ProfilePage() {
  const { data: session } = useSession()

  const [activeTab, setActiveTab] = useState("perfil")
  const [isEditing, setIsEditing] = useState(false)
   const [orders, setOrders] = useState<Array<Order & { items: OrderItem[] }>>([]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [userInfo, setUserInfo] = useState<ExtendedUser | null>(null)


  const { orders: realtimeOrders, isConnected } = useOrderUpdates(session?.user?.email || "")

 
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash && ["perfil", "pedidos", "enderecos", "notificacoes", "configuracoes"].includes(hash)) {
        setActiveTab(hash)
      }
    }

    // Check initial hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    window.history.pushState(null, "", `/perfil#${newTab}`)
  }

  const stats = {
    orders: orders.length,
    favorites: 0,
    spent: orders.reduce((total, order) => total + order.total, 0),
    points: 0,
  }

  const achievements: Achievement[] = [
    {
      title: "Primeiro Pedido",
      icon: () => "🎉",
      color: "bg-green-500",
      earned: orders.length > 0,
      date: "01/01/2024",
    },
  ]

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const result = await getUserOrders()
        if (result.success) {
          setOrders(result.orders)
        }
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error)
        toast.error("Erro ao carregar pedidos")
      }
    }

    const getUserInfo = async () => {
      if (session?.user?.email) {
        try {
          const userProfile = await getUserProfile(session.user.email)
          if (userProfile) {
            setUserInfo({
              name: userProfile.name,
              email: userProfile.email,
              image: userProfile.image,
              phone: userProfile.phone,
              bio: userProfile.bio,
              birthDate: userProfile.birthDate,
              cpf: userProfile.cpf,
              isAdmin: userProfile.isAdmin,
            })
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error)
          toast.error("Erro ao carregar dados do perfil")
        }
      }
    }

    if (session?.user?.email) {
      loadOrders()
      getUserInfo()
    }
  }, [session])

  
 useEffect(() => {
  if (realtimeOrders.length > 0) {
    const ordersWithItems = realtimeOrders.map((order) => ({
      ...order,
      items: [], // or some other default value
    }));
    setOrders(ordersWithItems);
  }
}, [realtimeOrders]);

  // Show connection status
  useEffect(() => {
    if (isConnected) {
      toast.success("Conectado - atualizações em tempo real ativas")
    }
  }, [isConnected])

  const handleSave = async (updatedFields: Partial<ExtendedUser>) => {
    try {
      if (!session?.user?.email) {
        toast.error("Usuário não autenticado")
        return
      }

      const updateData = {
        name: updatedFields.name || undefined,
        bio: updatedFields.bio || undefined,
        birthDate: updatedFields.birthDate || undefined,
        phone: updatedFields.phone || undefined,
        cpf: updatedFields.cpf?.replace(/\D/g, "") || undefined,
        image: updatedFields.image || undefined,
        isAdmin: updatedFields.isAdmin || undefined,
      }

      const result = await updateUserProfile(updateData)

      if (result.success) {
        setUserInfo((prev) => ({
          ...prev,
          ...updateData,
        }))

        toast.success("Perfil atualizado com sucesso!")
      } else {
        toast.error("Erro ao salvar perfil")
      }
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar perfil")
    }
  }

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header key="header" />

      <div className="container mx-auto px-4 py-8">
        <ProfileNavigation activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Connection Status Indicator */}
        {activeTab === "pedidos" && (
          <div className="mb-4">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                isConnected ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-yellow-500"}`} />
              {isConnected ? "Atualizações em tempo real ativas" : "Conectando..."}
            </div>
          </div>
        )}

        <div className="transition-all duration-300">
          {activeTab === "perfil" && (
            <ProfileDetails
              user={userInfo}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSave={handleSave}
              stats={stats}
              achievements={achievements}
              orders={orders}
            />
          )}
          {activeTab === "pedidos" && <OrdersTab orders={orders} onViewOrderDetails={handleViewOrderDetails} />}
          {activeTab === "enderecos" && <AddressesTab address={[]} />}
          {activeTab === "notificacoes" && <NotificationsTab />}
          {activeTab === "favoritos" && <FavoritesTab />}
          {activeTab === "conquistas" && <AchievementsTab />}
          {activeTab === "configuracoes" && (
            <div className="pb-20 md:pb-0">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Configurações</h3>
                <p className="text-gray-600">Em breve...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
