"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import type { Order, OrderItem } from "@/generated/prisma"
import { getUserOrders } from "@/app/actions/order/orders"
import { updateUserProfile } from "@/app/actions/user-profile"
import { getUserProfile } from "@/app/actions/user-profile" // Assuming this function is needed to fetch user info
import ProfileNavigation from "@/components/profile/ProfileNavigation"
import ProfileDetails from "@/components/profile/tabs/ProfileDetails"
import OrdersTab from "@/components/profile/tabs/OrdersTab"
import AddressesTab from "@/components/profile/tabs/AddressesTab"
import ProfileHeader from "@/components/profile/Header"
import { toast } from "sonner"

interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  phone?: string | null
  bio?: string | null
  birthDate?: string | null
  cpf?: string | null
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
      const ordersWithItems = result.orders.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          category: item.category,

          orderId: item.orderId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      }))
      setOrders(ordersWithItems)
    }
  }  catch (error) {
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

  const handleSave = async (updatedFields: Partial<ExtendedUser>) => {
    try {
      if (!session?.user?.email) {
        toast.error("Usuário não autenticado")
        return
      }

      // Preparar dados para envio
      const updateData = {
        name: updatedFields.name || undefined,
        bio: updatedFields.bio || undefined,
        birthDate: updatedFields.birthDate || undefined,
        phone: updatedFields.phone || undefined,
        cpf: updatedFields.cpf?.replace(/\D/g, "") || undefined, // Remove formatação do CPF
        image: updatedFields.image || undefined,
      }

      // Chamar a Server Action
      const result = await updateUserProfile(updateData)

      if (result.success) {
        // Atualizar o estado local com os novos dados
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
      <ProfileHeader userName={userInfo?.name} />

      <div className="container mx-auto px-4 py-8">
        <ProfileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

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
