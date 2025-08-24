"use client"
import { User, Package, MapPin, Settings, Bell, Heart, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const tabs = [
  {
    id: "perfil",
    label: "Perfil",
    icon: User,
    color: "text-orange-600",
  },
  {
    id: "pedidos",
    label: "Pedidos",
    icon: Package,
    color: "text-orange-600",
  },
  {
    id: "enderecos",
    label: "Endereços",
    icon: MapPin,
    color: "text-orange-600",
  },
  {
    id: "favoritos", // Added favorites tab
    label: "Favoritos",
    icon: Heart,
    color: "text-red-600",
  },
  // {
  //   id: "notificacoes",
  //   label: "Notificações",
  //   icon: Bell,
  //   color: "text-orange-600",
  // },
  // {
  //   id: "configuracoes",
  //   label: "Config",
  //   icon: Settings,
  //   color: "text-orange-600",
  // },
]

export default function ProfileNavigation({ activeTab, setActiveTab }: ProfileNavigationProps) {
  return (
    <>
      {/* Desktop Tabs */}
      <div className="hidden md:block mb-8">
        <div className="bg-white rounded-2xl p-2  shadow-lg border border-gray-100">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-5 ml-20 p-10 px-15 py-3 rounded-xl font-medium transition-all duration-300 flex-shrink-0 justify-center min-w-fit",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden lg:inline text-sm">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
        <div className="flex overflow-x-auto ">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-shrink-0 flex flex-col items-center justify-center py-2 px-7 ml-1 transition-all duration-300 min-w-fit",
                  activeTab === tab.id ? "text-orange-600 bg-orange-50" : "text-gray-500 hover:text-orange-600",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    activeTab === tab.id ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg" : "",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-b-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
