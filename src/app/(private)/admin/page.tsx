"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, Settings, ImageIcon, Target, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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

interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  isAdmin: boolean
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null)
   const { data: session, status } = useSession()

 useEffect(() => {
  if (!session?.user?.email) {
    setCurrentUser(null)
    return;
  }

  const fetchUserData = async () => {
    const userExists = await checkUserExistsInDatabase(session?.user?.email as string)
    if (!userExists) {
      setCurrentUser(null)
      return;
    }

    const user = await getUserProfile(session?.user?.email as string)
    setCurrentUser(user)
  }

  fetchUserData()
}, [session?.user?.email])



 useEffect(() => {
  if (status === "loading") return; // Ainda carregando sessão

  if (currentUser === null) return; // Ainda buscando usuário ou não existe

  if (!currentUser.isAdmin) {
    window.location.href = "/"
  }
}, [currentUser, status])

  // Mock data para demonstração
  const dashboardStats = {
    totalRevenue: 45680.5,
    totalOrders: 1247,
    totalProducts: 156,
    totalUsers: 892,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    productsGrowth: 5.2,
    usersGrowth: 15.7,
  }

  const tabItems = [
    { value: "dashboard", label: "Dashboard", icon: BarChart3, shortLabel: "Dash" },
    { value: "products", label: "Produtos", icon: Package, shortLabel: "Prod" },
    { value: "orders", label: "Pedidos", icon: ShoppingCart, shortLabel: "Ped" },
    { value: "analytics", label: "Vendas", icon: TrendingUp, shortLabel: "Vend" },
    { value: "carousel", label: "Carousel", icon: ImageIcon, shortLabel: "Car" },
    { value: "promotions", label: "Promoções", icon: Target, shortLabel: "Prom" },
    { value: "settings", label: "Config", icon: Settings, shortLabel: "Conf" },
  ]

  const TabNavigation = ({ isMobile = false }) => (
    <TabsList
      className={`${isMobile ? "flex flex-col h-auto space-y-1 bg-transparent p-0" : "grid grid-cols-4 lg:grid-cols-7 gap-8 bg-transparent"}`}
    >
      {tabItems.map((item) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          className={`${
            isMobile
              ? "w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
              : "data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
          }`}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <item.icon className="h-4 w-4 mr-2" />
          <span className={isMobile ? "block" : "hidden sm:inline"}>{item.label}</span>
          <span className={isMobile ? "hidden" : "sm:hidden"}>{item.shortLabel}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
          {/* Desktop Navigation */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <TabNavigation />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {tabItems.find((item) => item.value === activeTab)?.label}
                </h2>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64">
                    <div className="py-4">
                      <h3 className="text-lg font-semibold mb-4">Menu Admin</h3>
                      <TabNavigation isMobile />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="dashboard" className="space-y-4 lg:space-y-6">
            <DashboardOverview stats={dashboardStats} />
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
        </Tabs>
      </div>
    </div>
  )
}
