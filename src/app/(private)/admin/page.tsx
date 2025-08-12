"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import AdminHeader from "@/components/admin/AdminHeader"
import DashboardOverview from "@/components/admin/DashboardOverview"
import ProductsManager from "@/components/admin/ProductsManager"
import OrdersManager from "@/components/admin/OrdersManager"
import UsersManager from "@/components/admin/UsersManager"
import SalesAnalytics from "@/components/admin/SalesAnalytics"
import SuppliersManager from "@/components/admin/SuppliersManager"


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
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6 hover:bg-background transition-colors duration-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="space-y-4 lg:space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="products" className="space-y-4 lg:space-y-6">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 lg:space-y-6">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="users" className="space-y-4 lg:space-y-6">
            <UsersManager />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4 lg:space-y-6">
            <SuppliersManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 lg:space-y-6">
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 lg:space-y-6">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
