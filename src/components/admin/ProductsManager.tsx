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
  Eye,
  Package,
  Star,
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { getProductsAction, getProductCategoriesAction, deleteProduct } from "@/app/actions/product"
import { ConfirmDeleteDialog } from "@/components/product/dialog/DeleteProductDialog"
import { AddProductDialog } from "@/components/product/dialog/AddProductDialog"
import { UpdateProductDialog } from "@/components/product/dialog/UpdateProductDialog"
import { ViewProductDialog } from "@/components/product/dialog/ViewProductDialog"

interface Product {
  id: number
  name: string
  description: string
  price: number
  priceWeightAmount: number | null
  priceWeightUnit: string | null
  image?: string | null
  category: string
  discount?: number | null
  stock: number
  available: boolean
  createdAt: Date
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchProductsAndCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      const [productsResult, categoriesResult] = await Promise.all([
        getProductsAction({ search: searchQuery, category: selectedCategory }),
        getProductCategoriesAction(),
      ])

      if (productsResult.success) {
        setProducts(productsResult.products)
      }

      if (categoriesResult.success) {
        setCategories(categoriesResult.categories)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setError("Erro ao carregar produtos e categorias")
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    fetchProductsAndCategories()
  }, [fetchProductsAndCategories])

  const handleDeleteProduct = useCallback(
    async (id: number) => {
      if (!id) return

      const result = await deleteProduct(id)
      if (result) {
        setSuccess("Produto deletado com sucesso!")
        fetchProductsAndCategories()
      } else {
        setError("Erro ao deletar o produto.")
      }
    },
    [fetchProductsAndCategories],
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Sem Estoque", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    if (stock <= 5) return { label: "Estoque Baixo", color: "bg-yellow-100 text-yellow-800", icon: TrendingDown }
    return { label: "Disponível", color: "bg-green-100 text-green-800", icon: TrendingUp }
  }

  const getRandomImage = () => {
    const meatImages = [
      "/placeholder.svg?height=200&width=200&text=Picanha",
      "/placeholder.svg?height=200&width=200&text=Alcatra",
      "/placeholder.svg?height=200&width=200&text=Costela",
      "/placeholder.svg?height=200&width=200&text=Filé",
      "/placeholder.svg?height=200&width=200&text=Fraldinha",
    ]
    return meatImages[Math.floor(Math.random() * meatImages.length)]
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calcular estatísticas
  const totalProducts = products.length
  
  const totalStockValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
 const lowStockProducts = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
const outOfStockProducts = products.filter((product) => product.stock === 0).length;



  // Mobile Product Card Component
  const ProductCard = ({ product }: { product: Product }) => {
    const stockStatus = getStockStatus(product.stock)
    const StatusIcon = stockStatus.icon

    return (
      <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="relative">
          <img src={product.image || getRandomImage()} alt={product.name} className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2">
            <Badge className={`${stockStatus.color} text-xs`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {stockStatus.label}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg truncate">{product.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Preço</p>
                <p className="font-bold text-green-600 text-lg">{formatPrice(product.price)}</p>
                {product.priceWeightAmount && (
                  <p className="text-xs text-gray-500">
                    por {product.priceWeightAmount}
                    {product.priceWeightUnit}
                  </p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-xs">Estoque</p>
                <p className="font-semibold text-gray-900">{product.stock} {product.priceWeightUnit}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <ViewProductDialog
                product={product}
                trigger={
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                }
              />

              <div className="flex items-center space-x-1">
                <UpdateProductDialog product={product} onSuccess={fetchProductsAndCategories} />

                <ConfirmDeleteDialog
                  message={`Tem certeza que deseja excluir o produto "${product.name}"?`}
                  onConfirm={() => handleDeleteProduct(product.id)}
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
        <span className="ml-2 text-gray-600">Carregando produtos...</span>
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
            <h1 className="text-2xl lg:text-3xl font-bold">Gestão de Produtos</h1>
            <p className="text-red-100 mt-1">Gerencie o estoque do seu açougue de forma eficiente</p>
            <p className="text-sm text-red-200 mt-1">{totalProducts} produtos cadastrados</p>
          </div>
          <AddProductDialog onSuccess={fetchProductsAndCategories} />
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
                  placeholder="Buscar produtos..."
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
              <Button variant="outline" className="lg:hidden bg-transparent">
                <Filter className="h-4 w-4" />
              </Button>
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
                <p className="text-sm text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">estável</Badge>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total do Estoque</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(totalStockValue)}</p>
                <Badge className="bg-green-100 text-green-800 text-xs mt-1">positivo</Badge>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockProducts}</p>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs mt-1">atenção</Badge>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sem Estoque</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
                <Badge className="bg-red-100 text-red-800 text-xs mt-1">crítico</Badge>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Produtos */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center text-lg">
            <Package className="h-5 w-5 mr-2 text-orange-600" />
            Produtos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600 text-center">
                {searchQuery || selectedCategory !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece adicionando seu primeiro produto"}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile View - Grid de Cards */}
              <div className="lg:hidden p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock)
                      const StatusIcon = stockStatus.icon

                      return (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.image || getRandomImage()}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-600 max-w-xs truncate">{product.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="font-semibold text-green-600">{formatPrice(product.price)}</span>
                              {product.priceWeightAmount && (
                                <p className="text-xs text-gray-500">
                                  por {product.priceWeightAmount}
                                  {product.priceWeightUnit}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-900">{product.stock} {product.priceWeightUnit}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={stockStatus.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {stockStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <ViewProductDialog
                                product={product}
                                trigger={
                                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                }
                              />

                              <UpdateProductDialog product={product} onSuccess={fetchProductsAndCategories} />

                              <ConfirmDeleteDialog
                                message={`Tem certeza que deseja excluir o produto "${product.name}"?`}
                                onConfirm={() => handleDeleteProduct(product.id)}
                                trigger={
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                }
                              />
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
