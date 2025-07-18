"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/app/hooks/use-toast"
import { Target, Crown, Sparkles, Beef } from "lucide-react"
import ProfileHeader from "@/components/profile/Header"
import ProfileTabs from "@/components/profile/ProfileTab"
import ProfileTab from "@/components/profile/tabs/profile"
import AddressesTab from "@/components/profile/tabs/AddressesTab"
import OrdersTab from "@/components/profile/tabs/OrdersTab"
import SettingsTab from "@/components/profile/tabs/SettingsTab"
import OrderDetailDialog from "@/components/profile/OrderDetail"
import { useSession } from "next-auth/react"
import { getUserProfileDetails, updateUserProfileDetails, checkUserExistsInDatabase } from "@/app/mock/user-info"

// Interface que combina os campos do session com campos adicionais
interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  // Campos adicionais que vêm do banco de dados
  phone?: string | null
  bio?: string | null
  birthDate?: string | null
  cpf?: string | null
}

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface TrackingInfo {
  status: string
  estimatedDelivery: string
  trackingNumber: string
}

interface Order {
  id: string
  date: string
  total: number
  status: string
  items: OrderItem[]
  trackingInfo: TrackingInfo
}

export default function ModernProfilePage() {
  const { toast } = useToast()
  const { data: session, status } = useSession()

  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("perfil")
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [userExistsInDB, setUserExistsInDB] = useState<boolean | null>(null)
  const [activeNumber, setActiveNumber] = useState<number>(4)

  const shouldRedirect = session?.user?.email === null && !currentUser || userExistsInDB === false

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (shouldRedirect && status !== "loading") {
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

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUser(true)

      if (status === "authenticated" && session?.user?.email) {
        // Primeiro, verificar se o usuário existe no banco de dados
        const userExists = await checkUserExistsInDatabase(session.user.email)
        setUserExistsInDB(userExists)

        if (userExists) {
          // Se existe, buscar os detalhes adicionais
          const additionalDetails = await getUserProfileDetails(session.user.email)

          // Combinar dados do session com dados adicionais
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

  // Estados para o modal de detalhes do pedido
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

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

  const orders: Order[] = [
    {
      id: "001",
      date: "15/01/2024",
      total: 89.9,
      status: "Entregue",
      items: [
        { name: "Picanha Maturada (500g)", quantity: 1, price: 55.0 },
        { name: "Linguiça Artesanal (1kg)", quantity: 1, price: 34.9 },
      ],
      trackingInfo: {
        status: "Entregue em 15/01/2024 às 14:30",
        estimatedDelivery: "15/01/2024",
        trackingNumber: "BR123456789BR",
      },
    },
    {
      id: "002",
      date: "10/01/2024",
      total: 156.5,
      status: "Em transporte",
      items: [
        { name: "Costela Bovina (2kg)", quantity: 1, price: 120.0 },
        { name: "Carvão Premium (5kg)", quantity: 1, price: 36.5 },
      ],
      trackingInfo: {
        status: "Em transporte - Chegará hoje",
        estimatedDelivery: "10/01/2024",
        trackingNumber: "BR987654321BR",
      },
    },
    {
      id: "003",
      date: "05/01/2024",
      total: 234.8,
      status: "Preparando",
      items: [
        { name: "Filé Mignon (1kg)", quantity: 1, price: 150.0 },
        { name: "Cerveja Artesanal (6un)", quantity: 1, price: 84.8 },
      ],
      trackingInfo: {
        status: "Preparando seu pedido",
        estimatedDelivery: "05/01/2024",
        trackingNumber: "BR112233445BR",
      },
    },
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
      <ProfileHeader userName={currentUser?.name} notificationCount={3} cartItemCount={2} />
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
      <OrderDetailDialog order={selectedOrder} isOpen={isOrderDetailOpen} onClose={() => setIsOrderDetailOpen(false)} />
    </div>
  )
}
