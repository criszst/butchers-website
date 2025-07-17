"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, MapPin, Package, Settings } from "lucide-react"

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    {
      value: "perfil",
      label: "Perfil",
      icon: User,
    },
    {
      value: "enderecos",
      label: "Endereços",
      icon: MapPin,
    },
    {
      value: "pedidos",
      label: "Pedidos",
      icon: Package,
    },
    {
      value: "configuracoes",
      label: "Configurações",
      icon: Settings,
    },
  ]

  return (
    <div className="w-full mb-6 sm:mb-5">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full space-x-3 h-full grid-cols-2 sm:grid-cols-4 bg-white border border-gray-200 p-2 rounded-xl shadow-sm">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-slate-800 pr-4 data-[state=active]:text-white text-gray-600 font-medium py-3 px-2 sm:px-4 rounded-lg transition-all hover:bg-gray-100 active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
