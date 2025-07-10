"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, Mail, Phone } from "lucide-react"

export default function SettingsTab() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: true,
    orderUpdates: true,
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="bg-gray-800 text-white p-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Notificações</CardTitle>
              <p className="text-white/80 text-sm">Configure suas preferências</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="font-semibold text-gray-800">Notificações por Email</p>
              <p className="text-sm text-gray-600">Receba atualizações por email</p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, emailNotifications: checked }))}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-600 data-[state=checked]:to-orange-600"
            />
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="font-semibold text-gray-800">SMS</p>
              <p className="text-sm text-gray-600">Receba SMS sobre pedidos</p>
            </div>
            <Switch
              checked={preferences.smsNotifications}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, smsNotifications: checked }))}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-600 data-[state=checked]:to-orange-600"
            />
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="font-semibold text-gray-800">Emails Promocionais</p>
              <p className="text-sm text-gray-600">Ofertas e promoções especiais</p>
            </div>
            <Switch
              checked={preferences.promotionalEmails}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, promotionalEmails: checked }))}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-600 data-[state=checked]:to-orange-600"
            />
          </div>
          <Separator className="bg-gray-200" />
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="font-semibold text-gray-800">Atualizações de Pedidos</p>
              <p className="text-sm text-gray-600">Status de preparação e entrega</p>
            </div>
            <Switch
              checked={preferences.orderUpdates}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, orderUpdates: checked }))}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-600 data-[state=checked]:to-orange-600"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="bg-gray-800 text-white p-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Segurança</CardTitle>
              <p className="text-white/80 text-sm">Proteja sua conta</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <Button
            variant="outline"
            className="w-full justify-start h-16 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-2xl"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mr-4">
              <Shield className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800 text-lg">Alterar Senha</p>
              <p className="text-sm text-gray-600">Atualize sua senha de acesso</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start h-16 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-2xl"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mr-4">
              <Mail className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800 text-lg">Verificar Email</p>
              <p className="text-sm text-gray-600">Confirme seu endereço de email</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start h-16 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-2xl"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mr-4">
              <Phone className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800 text-lg">Verificar Telefone</p>
              <p className="text-sm text-gray-600">Confirme seu número de telefone</p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
