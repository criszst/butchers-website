"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import AdminHeader from "@/components/admin/AdminHeader"
import DashboardOverview from "@/components/admin/DashboardOverview"
import ProductsManager from "@/components/admin/ProductsManager"
import OrdersManager from "@/components/admin/OrdersManager"
import UsersManager from "@/components/admin/UsersManager"
import SalesAnalytics from "@/components/admin/SalesAnalytics"
import { useRouter } from "next/navigation"
import SettingsManager from "@/components/admin/SettingsManager"
import KitsManager from "@/components/admin/KitsManager"
import { useSession } from "next-auth/react"

import type { UserProfile } from "@/interfaces/user"
import { getUserProfile } from "@/app/actions/user-profile"
import { getAllOrders } from "@/app/actions/order/orders"

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("")
  const { data: session } = useSession()
  const [user, setUser] = useState<UserProfile | null>()
  type Order = {
    id: string
    orderNumber: string
    customer: { name: string; email: string; phone: string }
    items: { id: string; name: string; quantity: number; price: number; category: string }[]
    total: number
    status: string
    createdAt: string
  
    paymentMethod: string
    
    deliveryDate: Date | null
    deliveryFee: number
    deliveryAddress: string | null
  }
  const [orders, setOrders] = useState<Order[]>([])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`/admin?tab=${tab}`)
  }

  useEffect(() => {
    const handleRouterChange = () => {
      const search = window.location.search.replace("?tab=", "")

      console.log("Search:", search)
      if (!search) {
        setActiveTab("dashboard")
      }
      if (
        search &&
        ["dashboard", "produtos", "pedidos", "usuarios", "fornecedores", "analises", "configs", "kits"].includes(search)
      ) {
        setActiveTab(search.match(/^[a-z]+/)?.[0] || "dashboard")
      }
    }

    handleRouterChange()

    window.addEventListener("navigate", handleRouterChange)

    return () => {
      window.removeEventListener("navigate", handleRouterChange)
    }
  }, [router])

  useEffect(() => {
    const getUser = async (email: string) => {
      try {
        await getUserProfile(email).then((response) => {
          setUser(response)
        })
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    getUser(session?.user?.email ?? "")
  }, [session?.user?.email])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getAllOrders()
        if (result.success) {
          setOrders(result.orders)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    fetchOrders()
  }, [])

  if (!session?.user?.email && !user?.isAdmin) {
    // TODO: fake page that shows "No founded page 404"
    return (
      <div>
        <h1>404 - Page not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="max-w-7xl mx-auto px-4 py-7 pb-20 md:pb-6 hover:bg-background transition-colors duration-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="space-y-4 lg:space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="produtos" className="space-y-4 lg:space-y-6">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="kits" className="space-y-4 lg:space-y-6">
            <KitsManager />
          </TabsContent>

          <TabsContent value="pedidos" className="space-y-4 lg:space-y-6">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-4 lg:space-y-6">
            <UsersManager />
          </TabsContent>

          {/* <TabsContent value="fornecedores" className="space-y-4 lg:space-y-6">
            <SuppliersManager />
          </TabsContent> */}

          <TabsContent value="analises" className="space-y-4 lg:space-y-6">
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value="configs" className="space-y-4 lg:space-y-6">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
