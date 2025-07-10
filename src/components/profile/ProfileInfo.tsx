"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, Camera, Edit3, Save, X, CheckCircle, Crown, Calendar, FileText } from "lucide-react"

interface ProfileInfoProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  setUser: (user: any) => void
}

export default function ProfileInfo({ user, setUser }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false)

  // Mock data for fields not in NextAuth
  const [mockData, setMockData] = useState({
    phone: "(11) 99999-9999",
    birthDate: "1990-01-01",
    cpf: "123.456.789-00",
    bio: "Cliente fiel do Açougue Premium há mais de 2 anos. Adoro carnes de qualidade!",
  })

  const handleInputChange = (field: string, value: string) => {
    if (field === "name" || field === "email") {
      setUser({ ...user, [field]: value })
    } else {
      setMockData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log("Dados salvos:", { ...user, ...mockData })
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUser({ ...user, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gray-800 text-white p-8">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <User className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Informações Pessoais</CardTitle>
              <p className="text-white/80 text-sm">Gerencie seus dados pessoais</p>
            </div>
          </div>
          <Button
            variant={isEditing ? "destructive" : "secondary"}
            size="lg"
            onClick={() => setIsEditing(!isEditing)}
            className={`${
              isEditing ? "bg-red-500/20 hover:bg-red-500/30" : "bg-white/20 hover:bg-white/30"
            } border-0 text-white transition-all duration-300 rounded-xl px-6`}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="relative group">
            {user?.image ? (
              <img
                src={user.image || "/placeholder.svg"}
                alt="Avatar"
                className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            {isEditing && (
              <label className="absolute -bottom-3 -right-3 bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-2xl cursor-pointer hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                <Camera className="h-5 w-5" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{user?.name || "Usuário"}</h3>
            <p className="text-gray-600 mb-4 text-lg">{user?.email || "usuario@email.com"}</p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 px-4 py-2 text-sm font-medium rounded-xl">
                <Crown className="h-4 w-4 mr-2" />
                Cliente Premium
              </Badge>
              <Badge className="bg-gray-100 text-gray-700 border-0 px-4 py-2 text-sm font-medium rounded-xl">
                <CheckCircle className="h-4 w-4 mr-2" />
                Verificado
              </Badge>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>Nome Completo</span>
            </Label>
            <Input
              id="name"
              value={user?.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!isEditing}
              className="h-12 border-2 border-gray-200 focus:border-gray-400 rounded-xl transition-all duration-300 bg-white text-gray-800"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>Email</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              className="h-12 border-2 border-gray-200 focus:border-gray-400 rounded-xl transition-all duration-300 bg-white text-gray-800"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>Telefone</span>
            </Label>
            <Input
              id="phone"
              value={mockData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              className="h-12 border-2 border-gray-200 focus:border-gray-400 rounded-xl transition-all duration-300 bg-white text-gray-800"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="birthDate" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Data de Nascimento</span>
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={mockData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              disabled={!isEditing}
              className="h-12 border-2 border-gray-200 focus:border-gray-400 rounded-xl transition-all duration-300 bg-white text-gray-800"
            />
          </div>
          <div className="space-y-3 md:col-span-2">
            <Label htmlFor="cpf" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>CPF</span>
            </Label>
            <Input
              id="cpf"
              value={mockData.cpf}
              onChange={(e) => handleInputChange("cpf", e.target.value)}
              disabled={!isEditing}
              className="h-12 border-2 border-gray-200 focus:border-gray-400 rounded-xl transition-all duration-300 bg-white text-gray-800"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="bio" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span>Sobre mim</span>
          </Label>
          <Textarea
            id="bio"
            value={mockData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="border-2 border-gray-200 focus:border-gray-400 rounded-xl transition-all duration-300 bg-white resize-none text-gray-800"
          />
        </div>

        {isEditing && (
          <div className="flex space-x-4 pt-6">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
