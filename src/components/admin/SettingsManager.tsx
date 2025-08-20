"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Store, Bell, Shield, Truck, Palette } from "lucide-react"
import { toast } from "sonner"
import { getStoreSettings, updateStoreSettings, type StoreSettingsData } from "@/app/actions/store-settings"

export default function SettingsManager() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [settings, setSettings] = useState<StoreSettingsData>({
    // Store Settings
    storeName: "Açougue Premium",
    storeDescription: "Os melhores cortes de carne da região",
    storeAddress: "Rua das Carnes, 123 - Centro",
    storePhone: "(11) 99999-9999",
    storeEmail: "contato@acougue.com",

    // Delivery Settings
    deliveryFee: 10.0,
    freeDeliveryMinimum: 150.0,
    averageDeliveryTime: 60,
    deliveryRadius: 10,
    businessHours: "08:00 - 18:00",

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
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const result = await getStoreSettings()
      if (result.success && result.settings) {
        setSettings(result.settings as StoreSettingsData)
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
      toast.error("Erro ao carregar configurações")
    } finally {
      setIsFetching(false)
    }
  }

  const handleInputChange = (field: keyof StoreSettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const result = await updateStoreSettings(settings)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast.error("Erro ao salvar configurações")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Configurações da Loja</h2>
          <p className="text-sm lg:text-base text-gray-600">Gerencie as configurações gerais do açougue</p>
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
                placeholder="Ex: Açougue Premium"
              />
            </div>
            <div>
              <Label htmlFor="storeDescription">Descrição</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => handleInputChange("storeDescription", e.target.value)}
                rows={3}
                placeholder="Descreva sua loja..."
              />
            </div>
            <div>
              <Label htmlFor="storeAddress">Endereço Completo</Label>
              <Textarea
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => handleInputChange("storeAddress", e.target.value)}
                rows={2}
                placeholder="Rua, número, bairro, cidade - estado, CEP"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storePhone">Telefone</Label>
                <Input
                  id="storePhone"
                  value={settings.storePhone}
                  onChange={(e) => handleInputChange("storePhone", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="storeEmail">Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleInputChange("storeEmail", e.target.value)}
                  placeholder="contato@acougue.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Settings */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Truck className="h-5 w-5 mr-2 text-orange-600" />
              Configurações de Entrega
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
                  min="0"
                  value={settings.deliveryFee}
                  onChange={(e) => handleInputChange("deliveryFee", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="freeDeliveryMinimum">Frete Grátis a partir de (R$)</Label>
                <Input
                  id="freeDeliveryMinimum"
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.freeDeliveryMinimum}
                  onChange={(e) => handleInputChange("freeDeliveryMinimum", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="averageDeliveryTime">Tempo Médio de Entrega (min)</Label>
                <Input
                  id="averageDeliveryTime"
                  type="number"
                  min="1"
                  value={settings.averageDeliveryTime}
                  onChange={(e) => handleInputChange("averageDeliveryTime", Number.parseInt(e.target.value) || 60)}
                />
              </div>
              <div>
                <Label htmlFor="deliveryRadius">Raio de Entrega (km)</Label>
                <Input
                  id="deliveryRadius"
                  type="number"
                  min="1"
                  value={settings.deliveryRadius}
                  onChange={(e) => handleInputChange("deliveryRadius", Number.parseInt(e.target.value) || 10)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="businessHours">Horário de Funcionamento</Label>
              <Input
                id="businessHours"
                value={settings.businessHours}
                onChange={(e) => handleInputChange("businessHours", e.target.value)}
                placeholder="Ex: 08:00 - 18:00"
              />
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
                min="5"
                max="480"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange("sessionTimeout", Number.parseInt(e.target.value) || 30)}
              />
              <p className="text-xs text-gray-500 mt-1">Entre 5 e 480 minutos (8 horas)</p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-white border border-gray-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Palette className="h-5 w-5 mr-2 text-orange-600" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primaryColor">Cor Primária</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    placeholder="#dc2626"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor">Cor Secundária</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={settings.secondaryColor}
                    onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    placeholder="#ea580c"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode">Modo Escuro</Label>
                  <p className="text-sm text-gray-600">Tema escuro por padrão</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleInputChange("darkMode", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
