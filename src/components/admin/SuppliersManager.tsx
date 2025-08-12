"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Trash2, Eye, Users, ShoppingCart, TrendingUp, AlertCircle, Loader2, Star, Phone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { getSuppliersAction, deleteSupplier, getSupplierAnalytics } from "@/app/actions/admin/suppliers"
import { AddSupplierDialog } from "@/components/admin/modals/AddSupplierDialog"
import { UpdateSupplierDialog } from "@/components/admin/modals/UpdateSupplierDialog"
import { SupplierDetailsModal } from "@/components/admin/modals/SupplierDetailsModal"
import { ConfirmDeleteDialog } from "@/components/product/dialog/DeleteProductDialog"

interface Supplier {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  cnpj?: string | null
  contact?: string | null
  rating?: number | null
  isActive: boolean
  createdAt: Date
  ProductSupplier: any[]
  PurchaseOrder: any[]
}

interface Analytics {
  totalSuppliers: number
  activeSuppliers: number
  totalPurchaseOrders: number
  pendingOrders: number
  totalSpent: number
  topSuppliers: any[]
}

export default function SuppliersManager() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [suppliersResult, analyticsResult] = await Promise.all([getSuppliersAction(), getSupplierAnalytics()])

      if (suppliersResult.success) {
        setSuppliers(suppliersResult.suppliers)
      }

      if (analyticsResult.success) {
        setAnalytics(analyticsResult.analytics)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setError("Erro ao carregar fornecedores")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDeleteSupplier = useCallback(
    async (id: string) => {
      const result = await deleteSupplier(id)
      if (result.success) {
        setSuccess("Fornecedor excluído com sucesso!")
        fetchData()
      } else {
        setError(result.message)
      }
    },
    [fetchData],
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (supplier.contact && supplier.contact.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Mobile Supplier Card Component
  const SupplierCard = ({ supplier }: { supplier: Supplier }) => {
    const totalOrders = supplier.PurchaseOrder.length
    const totalProducts = supplier.ProductSupplier.length

    return (
      <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{supplier.name}</h3>
                <p className="text-sm text-gray-600 truncate">{supplier.email}</p>
                {supplier.contact && <p className="text-sm text-gray-500">Contato: {supplier.contact}</p>}
              </div>
              <Badge className={supplier.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {supplier.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {supplier.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span className="truncate">{supplier.phone}</span>
                </div>
              )}
              {supplier.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                  <span>{supplier.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Produtos</p>
                <p className="font-semibold text-gray-900">{totalProducts}</p>
              </div>
              <div>
                <p className="text-gray-500">Pedidos</p>
                <p className="font-semibold text-gray-900">{totalOrders}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <SupplierDetailsModal
                supplier={supplier}
                trigger={
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Mais
                  </Button>
                }
              />

              <div className="flex items-center space-x-1">
                <UpdateSupplierDialog supplier={supplier} onSuccess={fetchData} />

                <ConfirmDeleteDialog
                  message={`Tem certeza que deseja excluir o fornecedor "${supplier.name}"?`}
                  onConfirm={() => handleDeleteSupplier(supplier.id)}
                  trigger={
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-600">Carregando fornecedores...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Gestão de Fornecedores</h1>
            <p className="text-red-100 mt-1">Cadastro de fornecedores por produto</p>
            <p className="text-sm text-red-200 mt-1">{analytics?.totalSuppliers || 0} fornecedores cadastrados</p>
          </div>
          <AddSupplierDialog onSuccess={fetchData} />
        </div>
      </div>

      {/* Cards de Estatísticas */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Fornecedores</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalSuppliers}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">{analytics.activeSuppliers} ativos</Badge>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Gasto</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(analytics.totalSpent)}</p>
                  <Badge className="bg-green-100 text-green-800 text-xs mt-1">compras</Badge>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pedidos de Compra</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.totalPurchaseOrders}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">total</Badge>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pedidos Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{analytics.pendingOrders}</p>
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs mt-1">aguardando</Badge>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar fornecedores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Fornecedores */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center text-lg">
            <Users className="h-5 w-5 mr-2 text-orange-600" />
            Fornecedores ({filteredSuppliers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSuppliers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum fornecedor encontrado</h3>
              <p className="text-gray-600 text-center">
                {searchQuery ? "Tente ajustar os filtros de busca" : "Comece adicionando seu primeiro fornecedor"}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile View - Grid de Cards */}
              <div className="lg:hidden p-4">
                <div className="grid grid-cols-1 gap-4">
                  {filteredSuppliers.map((supplier) => (
                    <SupplierCard key={supplier.id} supplier={supplier} />
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Produtos</TableHead>
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Avaliação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{supplier.name}</p>
                            <p className="text-sm text-gray-600">{supplier.email}</p>
                            {supplier.cnpj && <p className="text-xs text-gray-500">CNPJ: {supplier.cnpj}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {supplier.contact && <p className="text-sm text-gray-900">{supplier.contact}</p>}
                            {supplier.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-3 w-3 mr-1" />
                                {supplier.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-900">{supplier.ProductSupplier.length}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-900">{supplier.PurchaseOrder.length}</span>
                        </TableCell>
                        <TableCell>
                          {supplier.rating ? (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span>{supplier.rating.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={supplier.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {supplier.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <SupplierDetailsModal
                              supplier={supplier}
                              trigger={
                                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              }
                            />

                            <UpdateSupplierDialog supplier={supplier} onSuccess={fetchData} />

                            <ConfirmDeleteDialog
                              message={`Tem certeza que deseja excluir o fornecedor "${supplier.name}"?`}
                              onConfirm={() => handleDeleteSupplier(supplier.id)}
                              trigger={
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
