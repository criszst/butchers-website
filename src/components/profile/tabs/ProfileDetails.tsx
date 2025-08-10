"use client"

import type React from "react"
import { useState, useEffect, useTransition } from "react"
import { parseDate } from "@/app/utils/parseDate"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Edit, Save, Camera, CheckCircle, X, Trophy, Star } from "lucide-react"
import type { Order } from "@/generated/prisma"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ExtendedUser {
  name?: string | null
  email?: string | null
  image?: string | null
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

interface ProfileDetailsProps {
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
  orders: Order[]
}

export default function ProfileDetails({
  user,
  isEditing,
  setIsEditing,
  onSave,
  stats,
  achievements,
  orders,
}: ProfileDetailsProps) {
  const [formFields, setFormFields] = useState<Partial<ExtendedUser>>({})
  const [isPending, startTransition] = useTransition()

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return value
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

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

    let formattedValue = value

    // Aplicar formatação específica para cada campo
    if (name === "cpf") {
      formattedValue = formatCPF(value)
    } else if (name === "phone") {
      formattedValue = formatPhone(value)
    }

    setFormFields((prev) => ({ ...prev, [name]: formattedValue }))
  }

  const handleSaveClick = () => {
    startTransition(async () => {
      await onSave(formFields)
      setIsEditing(false)
    })
  }

  const handleCancelEdit = () => {
    setFormFields({
      name: user?.name,
      email: user?.email,
      image: user?.image,
      phone: user?.phone,
      bio: user?.bio,
      birthDate: user?.birthDate,
      cpf: user?.cpf,
    })
    setIsEditing(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Profile Header Card */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 via-red-500 to-red-600">
        <CardContent className="p-0">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10">
              <div className="absolute inset-0 bg-[url('/meat-pattern.png')] opacity-10 bg-cover bg-center" />
            </div>

            <div className="relative p-8 text-white">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white/30 shadow-2xl">
                    {user.image ? (
                      <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "User Avatar"} />
                    ) : (
                      <AvatarFallback className="text-2xl font-bold bg-white/20 text-white backdrop-blur-sm">
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "UN"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </Button>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                      <p className="text-white/80 text-lg">{user.email}</p>
                      <Badge className="mt-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        <User className="h-4 w-4 mr-2" />
                        Cliente Premium
                      </Badge>
                    </div>

                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Button>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{orders.length}</div>
                      <div className="text-white/80 text-sm">Pedidos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.favorites}</div>
                      <div className="text-white/80 text-sm">Favoritos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">R$ {stats.spent.toFixed(0)}</div>
                      <div className="text-white/80 text-sm">Gasto Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.points}</div>
                      <div className="text-white/80 text-sm">Pontos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Mode */}
      {isEditing ? (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b height-16 flex items-center justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Edit className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm w-24 sm:text-xl font-bold text-gray-900">Editar Informações</h3>
                  <p className="hidden sm:block text-gray-600">Atualize seus dados pessoais</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveClick}
                  disabled={isPending}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Nome Completo</Label>
                <Input
                  name="name"
                  value={formFields.name || ""}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  disabled
                />
                <p className="text-xs text-gray-500">Nome gerenciado pelo sistema</p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Email</Label>
                <Input
                  name="email"
                  value={formFields.email || ""}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  disabled
                />
                <p className="text-xs text-gray-500">Email gerenciado pelo sistema</p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Telefone</Label>
                <Input
                  name="phone"
                  value={formFields.phone || ""}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500">
                  Digite apenas números, a formatação será aplicada automaticamente
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Data de Nascimento</Label>
                <Input
                  type="date"
                  min="1900-01-01"
                  id="birthDate"
                  placeholder="Data de Nascimento"
                  autoComplete="off"
                  lang="pt-BR"
                  pattern="\d{2}\/\d{2}\/\d{4}"
                  name="birthDate"
                  value={formFields.birthDate || ""}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-gray-700 font-medium">CPF</Label>
                <Input
                  name="cpf"
                  value={formFields.cpf || ""}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500">
                  Digite apenas números, a formatação será aplicada automaticamente
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-gray-700 font-medium">Sobre mim</Label>
                <Textarea
                  name="bio"
                  value={formFields.bio || ""}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Conte um pouco sobre você..."
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Informações Pessoais</h3>
                  <p className="text-gray-600">Seus dados cadastrais</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Telefone</span>
                  <span className="text-gray-900">{user.phone || "Não informado"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Data de Nascimento</span>
                  <span className="text-gray-900">
                    {parseDate(String(user.birthDate), { year: "numeric", month: "long", day: "numeric" }) ||
                      "Não informado"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">CPF</span>
                  <span className="text-gray-900">{user.cpf || "Não informado"}</span>
                </div>
                <div className="pt-4">
                  <h4 className="text-gray-600 font-medium mb-2">Sobre mim</h4>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                    {user.bio || "Nenhuma descrição adicionada."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Conquistas</h3>
                  <p className="text-gray-600">Seus marcos e realizações</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {achievements
                  .filter((a) => a.earned)
                  .map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">{achievement.title}</span>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-600">Conquistado em {achievement.date}</p>
                      </div>
                    </div>
                  ))}

                {achievements.filter((a) => a.earned).length === 0 && (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Nenhuma conquista ainda.</p>
                    <p className="text-sm text-gray-500">Faça pedidos para desbloquear conquistas!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
