"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Search,
  Eye,
  UserPlus,
  Shield,
  ShoppingCart,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getAllUsers, getUserById, getUserStats, type UserWithDetails } from "@/app/actions/admin/users"
import UserDetailsModal from "@/components/admin/modals/UserDetailsModal"
import { toast } from "react-hot-toast"

export default function UsersManager() {
  const [users, setUsers] = useState<UserWithDetails[]>([])
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    adminUsers: 0,
    usersWithOrders: 0,
  })

  const loadUsers = async (page = 1, search?: string) => {
    setIsLoading(true)
    try {
      const result = await getAllUsers(page, 10, search)
      setUsers(result.users)
      setTotalPages(result.pages)
      setCurrentPage(result.currentPage)
    } catch (error) {
      toast.error("Erro ao carregar usuários")
      console.error("Erro ao carregar usuários:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const userStats = await getUserStats()
      setStats(userStats)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    }
  }

  useEffect(() => {
    loadUsers()
    loadStats()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadUsers(1, searchTerm)
  }

  const handleViewUser = async (userId: string) => {
    try {
      const user = await getUserById(userId)
      if (user) {
        setSelectedUser(user)
        setIsModalOpen(true)
      } else {
        toast.error("Usuário não encontrado")
      }
    } catch (error) {
      toast.error("Erro ao carregar detalhes do usuário")
    }
  }

  const handleUserUpdated = () => {
    loadUsers(currentPage, searchTerm)
    loadStats()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const formatPhone = (phone: string | null) => {
    if (!phone) return "Não informado"
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Gerenciar Usuários</h2>
          <p className="text-sm lg:text-base text-gray-600">Visualize e gerencie todos os usuários da plataforma</p>
        </div>
        <Button
          onClick={() => {
            loadUsers(currentPage, searchTerm)
            loadStats()
          }}
          disabled={isLoading}
          className="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium opacity-90">Total de Usuários</CardTitle>
            <Users className="h-3 w-3 lg:h-4 lg:w-4 opacity-90" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs opacity-90">Usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Novos Este Mês</CardTitle>
            <UserPlus className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{stats.newUsersThisMonth}</div>
            <p className="text-xs text-gray-600">Novos cadastros</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Administradores</CardTitle>
            <Shield className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{stats.adminUsers}</div>
            <p className="text-xs text-gray-600">Com privilégios admin</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">Com Pedidos</CardTitle>
            <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">{stats.usersWithOrders}</div>
            <p className="text-xs text-gray-600">Fizeram compras</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-red-600" />
              <span className="ml-2">Carregando usuários...</span>
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead className="hidden md:table-cell">Telefone</TableHead>
                      <TableHead className="hidden lg:table-cell">Cadastro</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Pedidos</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.image || ""} alt={user.name || ""} />
                              <AvatarFallback>
                                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.name || "Sem nome"}</p>
                              <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm">{formatPhone(user.phone)}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isAdmin ? "default" : "secondary"}>
                            {user.isAdmin ? "Admin" : "Cliente"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center space-x-1">
                            <ShoppingCart className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{user._count.Order}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewUser(user.id)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Ver Mais</span>
                            <span className="sm:hidden">Ver</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newPage = currentPage - 1
                        setCurrentPage(newPage)
                        loadUsers(newPage, searchTerm)
                      }}
                      disabled={currentPage === 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newPage = currentPage + 1
                        setCurrentPage(newPage)
                        loadUsers(newPage, searchTerm)
                      }}
                      disabled={currentPage === totalPages || isLoading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">{searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  )
}
