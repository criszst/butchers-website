"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingCart,
  CreditCard,
  Home,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react"
import { type UserWithDetails, toggleUserAdminStatus, deleteUser } from "@/app/actions/admin/users"
import { toast } from "react-hot-toast"

interface UserDetailsModalProps {
  user: UserWithDetails | null
  isOpen: boolean
  onClose: () => void
  onUserUpdated: () => void
}

export default function UserDetailsModal({ user, isOpen, onClose, onUserUpdated }: UserDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!user) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date))
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  const formatCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, "")
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Entregue":
        return "bg-green-100 text-green-800"
      case "Enviado":
        return "bg-blue-100 text-blue-800"
      case "Preparando":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleToggleAdmin = async () => {
    setIsLoading(true)
    try {
      const result = await toggleUserAdminStatus(user.id, !user.isAdmin)
      if (result.success) {
        toast.success(`Usuário ${!user.isAdmin ? "promovido a" : "removido de"} administrador`)
        onUserUpdated()
        onClose()
      } else {
        toast.error(result.message || "Erro ao alterar status")
      }
    } catch (error) {
      toast.error("Erro ao alterar status do usuário")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      return
    }

    setIsLoading(true)
    try {
      const result = await deleteUser(user.id)
      if (result.success) {
        toast.success("Usuário excluído com sucesso")
        onUserUpdated()
        onClose()
      } else {
        toast.error(result.message || "Erro ao excluir usuário")
      }
    } catch (error) {
      toast.error("Erro ao excluir usuário")
    } finally {
      setIsLoading(false)
    }
  }

  const totalSpent = user.Order.reduce((sum, order) => sum + order.total, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user.name || "Usuário sem nome"}</h2>
              <div className="flex items-center space-x-2">
                <Badge variant={user.isAdmin ? "default" : "secondary"}>
                  {user.isAdmin ? "Administrador" : "Cliente"}
                </Badge>
                <span className="text-sm text-gray-500">Membro desde {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{user.email}</span>
              </div>

              {user.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formatPhone(user.phone)}</span>
                </div>
              )}

              {user.cpf && (
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formatCPF(user.cpf)}</span>
                </div>
              )}

              {user.birthDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formatDate(user.birthDate)}</span>
                </div>
              )}

              {user.bio && (
                <div className="pt-2">
                  <h4 className="font-medium text-sm mb-2">Bio:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{user.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 w-full">
                <ShoppingCart className="h-5 w-5" />
                <span>Estatísticas de Compras</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user._count.Order}</div>
                  <div className="text-sm text-gray-600">Total de Pedidos</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(totalSpent)}</div>
                  <div className="text-sm text-gray-600">Total Gasto</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereços */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Endereços ({user.Address.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.Address.length > 0 ? (
                <div className="space-y-3">
                  {user.Address.map((address) => (
                    <div key={address.id} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Home className="h-4 w-4 text-gray-400" />
                            {address.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Principal
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">
                            {address.street}, {address.number}
                            {address.complement && `, ${address.complement}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.neighborhood}, {address.city} - {address.state}
                          </p>
                          <p className="text-sm text-gray-600">CEP: {address.cep}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum endereço cadastrado</p>
              )}
            </CardContent>
          </Card>

          {/* Pedidos Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Pedidos Recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.Order.length > 0 ? (
                <div className="space-y-3">
                  {user.Order.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">#{order.id}</p>
                        <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum pedido encontrado</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleToggleAdmin}
            disabled={isLoading}
            variant={user.isAdmin ? "destructive" : "default"}
            className="flex-1"
          >
            {user.isAdmin ? (
              <>
                <UserX className="h-4 w-4 mr-2" />
                Remover Admin
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Tornar Admin
              </>
            )}
          </Button>

          <Button
            onClick={handleDeleteUser}
            disabled={isLoading || user._count.Order > 0}
            variant="outline"
            className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Usuário
          </Button>

          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Fechar
          </Button>
        </div>

        {user._count.Order > 0 && (
          <p className="text-xs text-gray-500 text-center">* Usuários com pedidos não podem ser excluídos</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
