"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  Package,
  Star,
  AlertCircle,
  MoreVertical,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { createProduct, getProductsAction, getProductCategoriesAction, deleteProduct } from "@/app/actions/product"
import { ConfirmDeleteDialog } from "../product/dialog/DeleteProductDialog"
import { AddProductDialog } from "../product/dialog/AddProductDialog"
import { UpdateProductDialog } from "../product/dialog/UpdateProductDialog"

interface Product {
  id: number
  name: string
  description: string
  price: number
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
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  })



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


  const handleDeleteProduct = useCallback(async (id: number) => {
    if (!id) return

    const confirmed = <DialogTrigger asChild><Button variant="destructive" size="sm">Deletar</Button></DialogTrigger>
    if (!confirmed) return

    const result = await deleteProduct(id)
    if (result) {
      setSuccess("Produto deletado com sucesso!")
      fetchProductsAndCategories()
    } else {
      setError("Erro ao deletar o produto.")
    }
  }, [fetchProductsAndCategories])


  const handleInputChange = (field: string, value: string) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const result = await createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: Number.parseFloat(newProduct.price),
        category: newProduct.category,
        stock: Number.parseInt(newProduct.stock),
        image: newProduct.image || undefined,
      })

      if (result.success) {
        setSuccess(result.message)
        setNewProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          image: "",
        })
        setIsAddProductOpen(false)
        await fetchProductsAndCategories()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Erro ao criar produto")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Esgotado", color: "bg-red-100 text-red-800" }
    if (stock <= 5) return { label: "Baixo", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Disponível", color: "bg-green-100 text-green-800" }
  }

  const getRandomImage = () => {
    const meatImages = [
      "/placeholder.svg?height=60&width=60&text=Picanha",
      "/placeholder.svg?height=60&width=60&text=Alcatra",
      "/placeholder.svg?height=60&width=60&text=Costela",
      "/placeholder.svg?height=60&width=60&text=Filé",
      "/placeholder.svg?height=60&width=60&text=Fraldinha",
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

  // Mobile Product Card Component
  const ProductCard = ({ product }: { product: Product }) => {
    const stockStatus = getStockStatus(product.stock)

    return (
      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <img
              src={product.image || getRandomImage()}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{product.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <Badge className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()} 
                      className="p-0">
                      <UpdateProductDialog product={product} onSuccess={fetchProductsAndCategories} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()} 
                      className="p-0"
                    >
                      <ConfirmDeleteDialog
                        message={`Tem certeza que deseja excluir o produto "${product.name}"?`}
                        onConfirm={() => handleDeleteProduct(product.id)}
                        trigger={
                          <div className="flex items-center w-full text-sm text-red-600 cursor-pointer hover:bg-red-50 rounded-sm">
                           <Button variant="ghost" size="lg" className="text-red-600 hover:text-red-700">
                                     <Trash2 className="h-7 w-7" />
                                     Excluir
                                   </Button>
                          </div>
                        }
                      />
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <p className="text-gray-500">Preço</p>
                  <p className="font-semibold text-green-600">{formatPrice(product.price)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estoque</p>
                  <p className="font-semibold text-gray-900">{product.stock} un.</p>
                </div>
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
    <div className="space-y-4 lg:space-y-6">
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
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
          <p className="text-sm lg:text-base text-gray-600">Adicione, edite e gerencie o catálogo de produtos</p>
        </div>
      <AddProductDialog onSuccess={fetchProductsAndCategories} />
      </div>

      {/* Filters */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
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
        </CardContent>
      </Card>

      {/* Products Display */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center text-base lg:text-lg">
            <Package className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
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
              {/* Mobile View */}
              <div className="lg:hidden">
                <div className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="p-4">
                      <ProductCard product={product} />
                    </div>
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
                      <TableHead>Avaliação</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock)
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
                            <span className="font-semibold text-green-600">{formatPrice(product.price)}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-900">{product.stock} un.</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                <Eye className="h-4 w-4" />
                              </Button>
                             
    
                      <UpdateProductDialog product={product} onSuccess={fetchProductsAndCategories} />
            

                              <ConfirmDeleteDialog
                                message={`Tem certeza que deseja excluir o produto "${product.name}"?`}
                                onConfirm={() => handleDeleteProduct(product.id)}
                                trigger={
                                  <div className="flex items-center w-full px-2 py-1.5 text-sm text-red-600 cursor-pointer hover:bg-red-50 rounded-sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir
                                  </div>
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
