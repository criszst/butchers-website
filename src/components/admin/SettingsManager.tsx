"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Settings, Store, Bell, Shield } from "lucide-react"

export default function SettingsManager() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "Açougue Premium",
    storeDescription: "Os melhores cortes de carne da região",
    storeAddress: "Rua das Carnes, 123 - Centro",
    storePhone: "(11) 99999-9999",
    storeEmail: "contato@acougue.com",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    stockAlerts: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,

    // Appearance Settings
    primaryColor: "#dc2626",
    secondaryColor: "#ea580c",
    darkMode: false,

    // Business Settings
    deliveryFee: 10.0,
    freeDeliveryMinimum: 150.0,
    businessHours: "08:00 - 18:00",
    deliveryRadius: 10,
  })

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success message
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
          <p className="text-sm lg:text-base text-gray-600">Gerencie as configurações gerais da aplicação</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full lg:w-auto"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Store className="h-5 w-5 mr-2 text-orange-600" />
              Informações da Loja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Nome da Loja</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => handleInputChange("storeName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="storeDescription">Descrição</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => handleInputChange("storeDescription", e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="storeAddress">Endereço</Label>
              <Input
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => handleInputChange("storeAddress", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storePhone">Telefone</Label>
                <Input
                  id="storePhone"
                  value={settings.storePhone}
                  onChange={(e) => handleInputChange("storePhone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="storeEmail">Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleInputChange("storeEmail", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Settings className="h-5 w-5 mr-2 text-orange-600" />
              Configurações de Negócio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  step="0.01"
                  value={settings.deliveryFee}
                  onChange={(e) => handleInputChange("deliveryFee", Number.parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="freeDeliveryMinimum">Frete Grátis a partir de (R$)</Label>
                <Input
                  id="freeDeliveryMinimum"
                  type="number"
                  step="0.01"
                  value={settings.freeDeliveryMinimum}
                  onChange={(e) => handleInputChange("freeDeliveryMinimum", Number.parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessHours">Horário de Funcionamento</Label>
                <Input
                  id="businessHours"
                  value={settings.businessHours}
                  onChange={(e) => handleInputChange("businessHours", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="deliveryRadius">Raio de Entrega (km)</Label>
                <Input
                  id="deliveryRadius"
                  type="number"
                  value={settings.deliveryRadius}
                  onChange={(e) => handleInputChange("deliveryRadius", Number.parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Bell className="h-5 w-5 mr-2 text-orange-600" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Notificações por Email</Label>
                <p className="text-sm text-gray-600">Receber notificações por email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">Notificações por SMS</Label>
                <p className="text-sm text-gray-600">Receber notificações por SMS</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleInputChange("smsNotifications", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="orderNotifications">Notificações de Pedidos</Label>
                <p className="text-sm text-gray-600">Alertas para novos pedidos</p>
              </div>
              <Switch
                id="orderNotifications"
                checked={settings.orderNotifications}
                onCheckedChange={(checked) => handleInputChange("orderNotifications", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="stockAlerts">Alertas de Estoque</Label>
                <p className="text-sm text-gray-600">Alertas quando estoque estiver baixo</p>
              </div>
              <Switch
                id="stockAlerts"
                checked={settings.stockAlerts}
                onCheckedChange={(checked) => handleInputChange("stockAlerts", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="h-5 w-5 mr-2 text-orange-600" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorAuth">Autenticação de Dois Fatores</Label>
                <p className="text-sm text-gray-600">Adicionar camada extra de segurança</p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
              />
            </div>
            <Separator />
            <div>
              <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange("sessionTimeout", Number.parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
