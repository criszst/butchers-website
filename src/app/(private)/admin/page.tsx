"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import AdminHeader from "@/components/admin/AdminHeader"
import DashboardOverview from "@/components/admin/DashboardOverview"
import ProductsManager from "@/components/admin/ProductsManager"
import OrdersManager from "@/components/admin/OrdersManager"
import UsersManager from "@/components/admin/UsersManager"
import SalesAnalytics from "@/components/admin/SalesAnalytics"
import SuppliersManager from "@/components/admin/SuppliersManager"
import { useRouter } from "next/navigation"


function SettingsManager() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Configurações do Sistema</h2>
        <p className="text-gray-600">Configurações em desenvolvimento...</p>
      </div>
    </div>
  )
}



export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('')

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
        if (search && ["dashboard", "produtos", "pedidos", "usuarios", "fornecedores", 'analises', 'configs'].includes(search)) {
          setActiveTab(search.match(/^[a-z]+/)?.[0] || "dashboard")
        }
      }
  

      handleRouterChange()
  
      
      window.addEventListener("navigate", handleRouterChange)
  
      return () => {
        window.removeEventListener("navigate", handleRouterChange)
      }
    }, [router])
    

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6 hover:bg-background transition-colors duration-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="space-y-4 lg:space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="produtos" className="space-y-4 lg:space-y-6">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="pedidos" className="space-y-4 lg:space-y-6">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-4 lg:space-y-6">
            <UsersManager />
          </TabsContent>

          <TabsContent value="fornecedores" className="space-y-4 lg:space-y-6">
            <SuppliersManager />
          </TabsContent>

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
