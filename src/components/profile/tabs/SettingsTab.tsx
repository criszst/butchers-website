"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Shield, Bell, CreditCard, Lock, HelpCircle, Palette, Globe, Download } from "lucide-react"

export default function SettingsTab() {
  const settingsOptions = [
    {
      icon: Shield,
      title: "Alterar senha",
      description: "Segurança da conta",
      color: "text-blue-500",
    },
    {
      icon: Bell,
      title: "Notificações",
      description: "Preferências de notificação",
      color: "text-yellow-500",
    },
    {
      icon: CreditCard,
      title: "Gerenciar Pagamentos",
      description: "Cartões e métodos de pagamento",
      color: "text-purple-500",
    },
    {
      icon: Lock,
      title: "Privacidade",
      description: "Controle de dados pessoais",
      color: "text-green-500",
    },
    {
      icon: Palette,
      title: "Aparência",
      description: "Tema e personalização",
      color: "text-pink-500",
    },
    {
      icon: Globe,
      title: "Idioma e Região",
      description: "Configurações de localização",
      color: "text-indigo-500",
    },
    {
      icon: Download,
      title: "Exportar Dados",
      description: "Baixar seus dados pessoais",
      color: "text-gray-500",
    },
    {
      icon: HelpCircle,
      title: "Ajuda e Suporte",
      description: "FAQ, contato e documentação",
      color: "text-blue-500",
    },
  ]

  return (
    <Card className="border-gray-200 bg-white rounded-xl shadow-md">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-orange-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
            <p className="text-sm text-gray-500">Gerencie suas preferências e configurações</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsOptions.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-16 border-gray-200 hover:bg-gray-50 hover:border-orange-200 bg-transparent transition-all duration-300 group"
            >
              <option.icon className={`h-5 w-5 mr-3 ${option.color} group-hover:scale-110 transition-transform`} />
              <div className="text-left">
                <div className="font-medium text-gray-900">{option.title}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
