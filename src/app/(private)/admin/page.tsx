"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Package, ShoppingCart, TrendingUp, Settings, ImageIcon, Target } from "lucide-react"
import AdminHeader from "@/components/admin/AdminHeader"
import DashboardOverview from "@/components/admin/DashboardOverview"
import ProductsManager from "@/components/admin/ProductsManager"
import OrdersManager from "@/components/admin/OrdersManager"
import SalesAnalytics from "@/components/admin/SalesAnalytics"
import CarouselManager from "@/components/admin/CarouselManager"
import PromotionsManager from "@/components/admin/PromotionsManager"
import SettingsManager from "@/components/admin/SettingsManager"
import { useSession } from "next-auth/react"
import { getUserProfile } from "@/app/actions/user-profile"
import { checkUserExistsInDatabase } from "@/app/actions/user-info"
import { Toaster } from "react-hot-toast"

interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  isAdmin: boolean
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (!session?.user?.email) {
      setCurrentUser(null)
      return
    }
    const fetchUserData = async () => {
      const userExists = await checkUserExistsInDatabase(session?.user?.email as string)
      if (!userExists) {
        setCurrentUser(null)
        return
      }
      const user = await getUserProfile(session?.user?.email as string)
      setCurrentUser(user)
    }
    fetchUserData()
  }, [session?.user?.email])

  useEffect(() => {
    if (status === "loading") return // Ainda carregando sessão
    if (currentUser === null) return // Ainda buscando usuário ou não existe
    if (!currentUser.isAdmin) {
      window.location.href = "/"
    }
  }, [currentUser, status])

  const tabItems = [
    { value: "dashboard", label: "Dashboard", icon: BarChart3, shortLabel: "Dash" },
    { value: "products", label: "Produtos", icon: Package, shortLabel: "Prod" },
    { value: "orders", label: "Pedidos", icon: ShoppingCart, shortLabel: "Ped" },
    { value: "analytics", label: "Vendas", icon: TrendingUp, shortLabel: "Vend" },
    { value: "carousel", label: "Carousel", icon: ImageIcon, shortLabel: "Car" },
    { value: "promotions", label: "Promoções", icon: Target, shortLabel: "Prom" },
    { value: "settings", label: "Config", icon: Settings, shortLabel: "Conf" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Toaster position="top-right" />

      {/* Header */}
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
          {/* Desktop Navigation */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <TabsList className="grid grid-cols-7 gap-2 bg-transparent">
              {tabItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
            <TabsList className="grid grid-cols-4 h-20 bg-transparent rounded-none">
              {tabItems.slice(0, 4).map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="flex-col h-full data-[state=active]:bg-gradient-to-t data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Second row for remaining tabs */}
            <TabsList className="grid grid-cols-8 h-14 items-center pl-20 bg-gray-50 rounded-none border-t border-gray-100">
              {tabItems.slice(4).map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="flex-col h-full data-[state=active]:bg-gradient-to-t data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                >
                  <item.icon className="h-12 w-20 mb-1" />
                  <span className="text-xs">{item.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="pb-32 lg:pb-0">
            <TabsContent value="dashboard" className="space-y-4 lg:space-y-6">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="products" className="space-y-4 lg:space-y-6">
              <ProductsManager />
            </TabsContent>

            <TabsContent value="orders" className="space-y-4 lg:space-y-6">
              <OrdersManager />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 lg:space-y-6">
              <SalesAnalytics />
            </TabsContent>

            <TabsContent value="carousel" className="space-y-4 lg:space-y-6">
              <CarouselManager />
            </TabsContent>

            <TabsContent value="promotions" className="space-y-4 lg:space-y-6">
              <PromotionsManager />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 lg:space-y-6">
              <SettingsManager />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
