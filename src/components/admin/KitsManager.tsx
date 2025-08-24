"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Trash2,
  Search,
  Filter,
  Package,
  AlertCircle,
  Loader2,
  TrendingUp,
  DollarSign,
  Layers,
  Edit,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { getKitsAction, getKitCategoriesAction, deleteKit } from "@/app/actions/kit"
import { AddKitDialog } from "@/components/kit/dialog/AddKitDialog"
import { EditKitDialog } from "@/components/kit/dialog/EditKitDialog"
import { ViewKitDialog } from "@/components/kit/dialog/ViewKitDialog"
import type { Kit } from "@/interfaces/kit"

export default function KitsManager() {
  const [kits, setKits] = useState<Kit[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchKitsAndCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      const [kitsResult, categoriesResult] = await Promise.all([
        getKitsAction({ search: searchQuery, category: selectedCategory }),
        getKitCategoriesAction(),
      ])

      if (kitsResult.success) {
        setKits(kitsResult.kits)
      }

      if (categoriesResult.success) {
        setCategories(categoriesResult.categories)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setError("Erro ao carregar kits e categorias")
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    fetchKitsAndCategories()
  }, [fetchKitsAndCategories])

  const handleDeleteKit = useCallback(
    async (id: number) => {
      if (!id) return

      const result = await deleteKit(id)
      if (result.success) {
        setSuccess("Kit deletado com sucesso!")
        fetchKitsAndCategories()
      } else {
        setError("Erro ao deletar o kit.")
      }
    },
    [fetchKitsAndCategories],
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const calculateKitPrice = (kit: Kit) => {
    const totalPrice = kit.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return kit.discount ? totalPrice - (totalPrice * kit.discount) / 100 : totalPrice
  }

  const filteredKits = kits.filter((kit) => {
    const matchesSearch =
      kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kit.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || kit.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calcular estatísticas
  const totalKits = kits.length
  const totalKitsValue = kits.reduce((sum, kit) => sum + calculateKitPrice(kit), 0)
  const averageItemsPerKit = kits.length > 0 ? kits.reduce((sum, kit) => sum + kit.items.length, 0) / kits.length : 0

  // Mobile Kit Card Component
  const KitCard = ({ kit }: { kit: Kit }) => {
    const kitPrice = calculateKitPrice(kit)

    return (
      <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="relative">
          <img
            src={kit.image || "/placeholder.svg?height=200&width=200&text=Kit"}
            alt={kit.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              <Layers className="h-3 w-3 mr-1" />
              {kit.items.length} itens
            </Badge>
          </div>
          {kit.discount && kit.discount > 0 && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-600 text-white text-xs">-{kit.discount}%</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg truncate">{kit.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{kit.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {kit.category}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-xs">{kit.items.length} produtos</Badge>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-gray-500 text-xs">Preço do Kit</p>
                <p className="font-bold text-green-600 text-lg">{formatPrice(kitPrice)}</p>
              </div>
              <div className="text-xs text-gray-600">
                <p>Produtos inclusos:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {kit.items.slice(0, 3).map((item) => (
                    <Badge key={item.id} variant="outline" className="text-xs">
                      {item.quantity}x {item.product.name}
                    </Badge>
                  ))}
                  {kit.items.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{kit.items.length - 3} mais
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <ViewKitDialog kitId={kit.id} />

              <div className="flex items-center space-x-1">
                <EditKitDialog
                  kitId={kit.id}
                  onSuccess={fetchKitsAndCategories}
                  trigger={
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  }
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o kit "{kit.name}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteKit(kit.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir Kit
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
        <span className="ml-2 text-gray-600">Carregando kits...</span>
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

      {/* Header com gradiente laranja/vermelho */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Gestão de Kits</h1>
            <p className="text-red-100 mt-1">Gerencie os kits de produtos do seu açougue</p>
            <p className="text-sm text-red-200 mt-1">{totalKits} kits cadastrados</p>
          </div>
          <AddKitDialog onSuccess={fetchKitsAndCategories} />
        </div>
      </div>

      {/* Filtros */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar kits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48 border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Kits</p>
                <p className="text-2xl font-bold text-gray-900">{totalKits}</p>
                <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">ativos</Badge>
              </div>
              <Layers className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total dos Kits</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(totalKitsValue)}</p>
                <Badge className="bg-green-100 text-green-800 text-xs mt-1">disponível</Badge>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Média de Itens</p>
                <p className="text-2xl font-bold text-orange-600">{averageItemsPerKit.toFixed(1)}</p>
                <Badge className="bg-orange-100 text-orange-800 text-xs mt-1">por kit</Badge>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorias</p>
                <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
                <Badge className="bg-purple-100 text-purple-800 text-xs mt-1">diferentes</Badge>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Kits */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center text-lg">
            <Layers className="h-5 w-5 mr-2 text-orange-600" />
            Kits ({filteredKits.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredKits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Layers className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum kit encontrado</h3>
              <p className="text-gray-600 text-center">
                {searchQuery || selectedCategory !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando seu primeiro kit de produtos"}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile View - Grid de Cards */}
              <div className="lg:hidden p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredKits.map((kit) => (
                    <KitCard key={kit.id} kit={kit} />
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kit</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Desconto</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKits.map((kit) => {
                      const kitPrice = calculateKitPrice(kit)

                      return (
                        <TableRow key={kit.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={kit.image || "/placeholder.svg?height=48&width=48&text=Kit"}
                                alt={kit.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{kit.name}</p>
                                <p className="text-sm text-gray-600 max-w-xs truncate">{kit.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{kit.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-green-600">{formatPrice(kitPrice)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge className="bg-blue-100 text-blue-800 text-xs">{kit.items.length} produtos</Badge>
                              <div className="text-xs text-gray-500">
                                {kit.items.slice(0, 2).map((item) => (
                                  <div key={item.id}>
                                    {item.quantity}x {item.product.name}
                                  </div>
                                ))}
                                {kit.items.length > 2 && <div>+{kit.items.length - 2} mais...</div>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {kit.discount && kit.discount > 0 ? (
                              <Badge className="bg-green-100 text-green-800">{kit.discount}%</Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <ViewKitDialog kitId={kit.id} />

                              <EditKitDialog
                                kitId={kit.id}
                                onSuccess={fetchKitsAndCategories}
                                trigger={
                                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                  </Button>
                                }
                              />

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o kit "{kit.name}"? Esta ação não pode ser
                                      desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteKit(kit.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir Kit
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
