"use client"

import { useState, useEffect, useCallback } from "react"
import { signOut, useSession } from "next-auth/react"

import { useToast } from "@/app/hooks/use-toast"

import { getUserProfileDetails, updateUserProfileDetails, checkUserExistsInDatabase } from "@/app/actions/user-info"

import { Target, Crown, Sparkles, Beef } from "lucide-react"

import ProfileHeader from "@/components/profile/Header"
import ProfileTabs from "@/components/profile/ProfileTab"
import ProfileTab from "@/components/profile/tabs/profile"
import AddressesTab from "@/components/profile/tabs/AddressesTab"
import OrdersTab from "@/components/profile/tabs/OrdersTab"
import SettingsTab from "@/components/profile/tabs/SettingsTab"
import OrderDetailDialog from "@/components/profile/OrderDetail"

import prisma from "@/lib/prisma"
import { Order, OrderItem } from "@/generated/prisma"

// Interface que combina os campos do session com campos adicionais
interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  phone?: string | null
  bio?: string | null
  birthDate?: string | null
  cpf?: string | null
}

export default function ProfilePage() {
  const { toast } = useToast()
  const { data: session, status } = useSession()

  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("perfil")

  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | OrderItem>()

  const [userExistsInDB, setUserExistsInDB] = useState<boolean | null>(null)
  const [activeNumber, setActiveNumber] = useState<number>(4)

  const shouldRedirect =
    status !== "loading" &&
    userExistsInDB !== null &&
    (
      status === "unauthenticated" ||
      (status === "authenticated" && (!session?.user?.email || userExistsInDB === false))
    )
  
  const getOrders = useCallback(async () => {
    if (session?.user?.email) {
      const orders = await prisma.order.findMany({
        where: { user: { email: session.user.email } },
        include: { items: true },
      })
      return orders
    }
    }, [session, prisma, setOrders])

  

  const getOrdersItems = useCallback(async () => {
    if (orders.length > 0) {
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: { in: orders.map(order => order.id) } },
      })
      return orderItems
    }
    }, [session, prisma, orders, setOrderItems])


  // INTERVAL USE EFFECT
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (shouldRedirect) {
      interval = setInterval(() => {
        setActiveNumber((prev) => {
          if (prev === 0) {
            clearInterval(interval)
            window.location.href = "/register"
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [shouldRedirect, status])


  // USER DATA USE EFFECT
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUser(true)

      if (status === "authenticated" && session.user?.email) {

        const userExists = await checkUserExistsInDatabase(session.user.email)
        setUserExistsInDB(userExists)

        if (userExists) {

          const additionalDetails = await getUserProfileDetails(session.user.email)


          const combinedUser: ExtendedUser = {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            phone: additionalDetails.phone,
            bio: additionalDetails.bio,
            birthDate: additionalDetails.birthDate,
            cpf: additionalDetails.cpf,
          }
          setCurrentUser(combinedUser)
        } else {
          console.log("Usuário não encontrado no banco de dados")
          setCurrentUser(null)
        }
      } else if (status === "unauthenticated") {
        setUserExistsInDB(false)
        setCurrentUser(null)
      }

      setIsLoadingUser(false)
    }

    fetchUserData()
  }, [session, status])


  // ORDERS USE EFFECT
  useEffect(() => {
  const fetchOrders = async () => {
    const orders = await getOrders();
    setOrders(orders || []);
  };
  fetchOrders();
}, [session?.user?.email]);

useEffect(() => {
  const fetchOrderItems = async () => {
    const orderItems = await getOrdersItems();
    setOrderItems(orderItems || []);
  };
  fetchOrderItems();
}, [orders]);


  const handleUpdateProfile = useCallback(
    async (updatedFields: Partial<ExtendedUser>) => {
      if (!session?.user?.email) {
        toast({
          title: "❌ Erro",
          description: "Email do usuário não encontrado para salvar as alterações.",
          variant: "destructive",
        })
        return
      }

      try {

        const { phone, bio, birthDate, cpf } = updatedFields
        const result = await updateUserProfileDetails(session.user.email, { phone, bio, birthDate, cpf })

        if (result.success) {
          setCurrentUser((prev) => (prev ? { ...prev, ...updatedFields } : null))
          setIsEditing(false)
          toast({
            title: "✅ Perfil atualizado!",
            description: "Suas informações foram salvas com sucesso.",
          })
        } else {
          toast({
            title: "❌ Erro",
            description: result.message || "Não foi possível salvar as alterações.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to save profile:", error)
        toast({
          title: "❌ Erro",
          description: "Ocorreu um erro ao salvar as alterações.",
          variant: "destructive",
        })
      }
    },
    [session?.user?.email, toast],
  )

  const stats = {
    orders: 24,
    favorites: 12,
    spent: 2840.5,
    points: 340,
  }

  const achievements = [
    { title: "Primeiro Pedido", icon: Target, color: "bg-green-500", earned: true, date: "14/01/2023" },
    { title: "Cliente Fiel", icon: Crown, color: "bg-orange-500", earned: true, date: "19/06/2023" },
    { title: "Explorador", icon: Sparkles, color: "bg-purple-500", earned: true, date: "09/08/2023" },
    { title: "Mestre do Churrasco", icon: Beef, color: "bg-red-500", earned: false, date: "" },
  ]

  const addresses = [
    { id: 1, name: "Casa", address: "Rua das Flores, 123 - Centro", isDefault: true },
    { id: 2, name: "Trabalho", address: "Av. Paulista, 456 - Bela Vista", isDefault: false },
  ]

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDetailOpen(true)
  }


  if (shouldRedirect) {
    let message = "Você precisa estar logado para acessar essa página."

    if (status === "authenticated" && userExistsInDB === false && session?.user?.email === null) {
      message = "Usuário não encontrado no banco de dados. Você precisa se registrar."
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 mb-4">{message}</p>
          <p className="text-sm text-gray-500">
            Será redirecionado para a página de registro em {activeNumber} segundos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho Modular */}
      <ProfileHeader userName={currentUser?.name} notificationCount={3} cartItemCount={1}  />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegação por Abas Modular */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {/* Conteúdo das Abas */}
        <div className="space-y-6">
          {activeTab === "perfil" && (
            <ProfileTab
              user={currentUser}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSave={handleUpdateProfile}
              stats={stats}
              achievements={achievements}
            />
          )}
          {activeTab === "enderecos" && <AddressesTab addresses={addresses} />}
          {activeTab === "pedidos" && <OrdersTab orders={orders} onViewOrderDetails={handleViewOrderDetails} />}
          {activeTab === "configuracoes" && <SettingsTab />}
        </div>
      </div>
      {/* Modal de Detalhes do Pedido */}
      <OrderDetailDialog order={selectedOrder as Order | null} items={orderItems} isOpen={isOrderDetailOpen} onClose={() => setIsOrderDetailOpen(false)} />
    </div>
  )
}
