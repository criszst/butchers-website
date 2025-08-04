"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import type { Order } from "@/generated/prisma"
import { getUserOrders } from "@/app/actions/order/orders"
import ProfileTabs from "@/components/profile/ProfileTab"
import ProfileTab from "@/components/profile/tabs/profile"
import OrdersTab from "@/components/profile/tabs/OrdersTab"
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
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // Mock data - substitua pelos dados reais
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

    if (session?.user?.email) {
      loadOrders()
    }
  }, [session])

  const handleSave = async (updatedFields: Partial<ExtendedUser>) => {
    try {
      // Implementar a lógica de salvamento aqui
      console.log("Salvando:", updatedFields)
      toast.success("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar perfil")
    }
  }

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const user: ExtendedUser | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        phone: null, // Buscar do banco de dados
        bio: null, // Buscar do banco de dados
        birthDate: null, // Buscar do banco de dados
        cpf: null, // Buscar do banco de dados
      }
    : null

  return (
   <div className="container mx-auto px-4 py-8">
  <div className="flex space-x-4 border-b border-gray-200 mb-6">
    <button
      onClick={() => setActiveTab("perfil")}
      className={`px-4 py-2 font-medium ${
        activeTab === "perfil"
          ? "border-b-2 border-black text-black"
          : "text-gray-500 hover:text-black"
      }`}
    >
      Perfil
    </button>
    <button
      onClick={() => setActiveTab("pedidos")}
      className={`px-4 py-2 font-medium ${
        activeTab === "pedidos"
          ? "border-b-2 border-black text-black"
          : "text-gray-500 hover:text-black"
      }`}
    >
      Pedidos
    </button>

    {/* Se quiser adicionar mais abas, pode seguir o mesmo padrão */}
  </div>
 
 

      {activeTab === "perfil" && (
        <ProfileTabs
          user={user}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={handleSave}
          stats={stats}
          achievements={achievements}
          orders={orders}
        />
      )}

      {activeTab === "pedidos" && <OrdersTab orders={orders} onViewOrderDetails={handleViewOrderDetails} />}

      {/* Modal de detalhes do pedido */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  Detalhes do Pedido #{selectedOrder.id.toString().padStart(4, "0")}
                </h3>
                <button onClick={() => setShowOrderDetails(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              {/* Conteúdo do modal aqui */}
              <div className="space-y-4">
                <p>Status: {selectedOrder.status}</p>
                <p>Total: R$ {selectedOrder.total.toFixed(2)}</p>
                <p>Data: {new Date(selectedOrder.createdAt).toLocaleDateString("pt-BR")}</p>
                {/* Adicionar mais detalhes conforme necessário */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
