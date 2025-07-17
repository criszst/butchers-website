"use client"

import type React from "react"
import { useState, useEffect, useTransition } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Edit, Save, Camera, Crown, Package, Heart, Award, TrendingUp, CheckCircle } from "lucide-react"

// Interface que combina os campos do session com campos adicionais
interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
  // Campos adicionais que vêm do banco de dados
  phone?: string | null
  bio?: string | null
  birthDate?: string | null
  cpf?: string | null
}

interface Achievement {
  title: string
  icon: any
  color: string
  earned: boolean
  date: string
}

interface ProfileTabProps {
  user: ExtendedUser | null
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onSave: (updatedFields: Partial<ExtendedUser>) => Promise<void>
  stats: {
    orders: number
    favorites: number
    spent: number
    points: number
  }
  achievements: Achievement[]
}

export default function ProfileTab({ user, isEditing, setIsEditing, onSave, stats, achievements }: ProfileTabProps) {
  const [formFields, setFormFields] = useState<Partial<ExtendedUser>>({})
  const [isPending, startTransition] = useTransition()

  // Inicializar formFields quando o user prop mudar
  useEffect(() => {
    if (user) {
      setFormFields({
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        bio: user.bio,
        birthDate: user.birthDate,
        cpf: user.cpf,
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormFields((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveClick = () => {
    startTransition(async () => {
      await onSave(formFields)
    })
  }

  // Lidar com o caso onde user pode ser null
  if (!user) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Coluna Esquerda - Informações do Perfil */}
      <div className="lg:col-span-1">
        <Card className="border-gray-200 bg-slate-800 text-white rounded-xl shadow-md">
          <CardHeader className="border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-white" />
                <h3 className="text-lg font-semibold">Informações Pessoais</h3>
              </div>
              <Button
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="bg-orange-600 hover:bg-orange-700 text-white transition-colors"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-4 mb-6">
              <div className="relative inline-block">
                <Avatar className="w-20 h-20 border-4 border-orange-500/30 transition-transform hover:scale-105">
                  <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "User Avatar"} />
                  <AvatarFallback className="text-xl font-bold bg-orange-600 text-white">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "UN"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0 bg-orange-600 hover:bg-orange-700 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-slate-300 text-sm">{user.email}</p>
                <div className="flex justify-center mt-2">
                  <Badge className="bg-orange-600 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Cliente Premium
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Telefone:</span>
                <span className="text-white">{user.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Data de Nascimento:</span>
                <span className="text-white">{user.birthDate || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CPF:</span>
                <span className="text-white">{user.cpf || "N/A"}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <h4 className="text-sm font-medium text-white mb-2">Sobre mim</h4>
              <p className="text-slate-300 text-sm">{user.bio || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Coluna Direita - Estatísticas e Detalhes / Formulário de Edição */}
      <div className="lg:col-span-2 space-y-6 relative overflow-hidden">
        {/* Conteúdo do Modo de Visualização */}
        <div
          className={`space-y-6 transition-all duration-500 ease-in-out ${
            isEditing ? "opacity-0 max-h-0 pointer-events-none" : "opacity-100 max-h-screen pointer-events-auto"
          }`}
        >
          {/* Seção de Estatísticas */}
          <Card className="border-gray-200 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
            <CardHeader className="border-b border-gray-200 bg-slate-800 text-white rounded-t-xl">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Estatísticas</h3>
                <span className="text-sm text-slate-300">Seu desempenho</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Package className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.orders}</div>
                  <div className="text-sm text-gray-500">Pedidos</div>
                </div>
                <div className="text-center">
                  <Heart className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.favorites}</div>
                  <div className="text-sm text-gray-500">Favoritos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Conquistas */}
          <Card className="border-gray-200 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Conquistas</h3>
                <span className="text-sm text-gray-500">Seus marcos</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-orange-600 text-white p-4 rounded-lg mb-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6" />
                  <div>
                    <h4 className="font-semibold">Conquistas</h4>
                    <p className="text-sm opacity-90">Seus marcos</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {achievements
                  .filter((a) => a.earned)
                  .map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-sm"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${achievement.color}`}>
                        <achievement.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{achievement.title}</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-500">Conquistado em {achievement.date}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Conteúdo do Modo de Edição */}
        <div
          className={`absolute top-0 left-0 w-full space-y-6 transition-all duration-500 ease-in-out ${
            isEditing ? "opacity-100 max-h-screen pointer-events-auto" : "opacity-0 max-h-0 pointer-events-none"
          }`}
        >
          <Card className="border-gray-200 bg-white rounded-xl shadow-md">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Editar Informações</h3>
                <Button
                  onClick={handleSaveClick}
                  disabled={isPending}
                  className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  {isPending ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Salvar
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700">Nome Completo</Label>
                  <Input
                    name="name"
                    value={formFields.name || ""}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                    disabled // Nome é gerenciado pelo NextAuth, não editável diretamente
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Email</Label>
                  <Input
                    name="email"
                    value={formFields.email || ""}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                    disabled // Email é gerenciado pelo NextAuth, não editável diretamente
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Telefone</Label>
                  <Input
                    name="phone"
                    value={formFields.phone || ""}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Data de Nascimento</Label>
                  <Input
                    type="date"
                    name="birthDate"
                    value={formFields.birthDate || ""}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-700">CPF</Label>
                  <Input
                    name="cpf"
                    value={formFields.cpf || ""}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-700">Sobre mim</Label>
                  <Textarea
                    name="bio"
                    value={formFields.bio || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 resize-none transition-colors"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
