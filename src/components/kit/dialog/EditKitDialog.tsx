"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, X, Search, Plus } from "lucide-react"
import { toast } from "sonner"

import { updateKit, getKitById } from "@/app/actions/kit"
import { getProductsAction } from "@/app/actions/product"
import type { Product } from "@/generated/prisma"
import type { Kit } from "@/interfaces/kit"

interface EditKitDialogProps {
  kitId: number
  onSuccess?: () => void
  trigger?: React.ReactNode
}

interface KitItem {
  productId: number
  quantity: number
  product: Product
}

export function EditKitDialog({ kitId, onSuccess, trigger }: EditKitDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<KitItem[]>([])
  const [kit, setKit] = useState<Kit | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    discount: 0,
    image: "",
  })

  const loadKit = async () => {
    try {
      const result = await getKitById(kitId)
      if (result.success && result.kit) {
        const kitData = result.kit
        setKit(kitData)
        setFormData({
          name: kitData.name,
          description: kitData.description,
          category: kitData.category,
          discount: kitData.discount || 0,
          image: kitData.image || "",
        })

        // Convert kit items to the format expected by the form
        const kitItems: KitItem[] = kitData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          product: item.product,
        }))
        setSelectedItems(kitItems)
      }
    } catch (error) {
      console.error("Erro ao carregar kit:", error)
      toast.error("Erro ao carregar dados do kit")
    }
  }

  const loadProducts = async () => {
    try {
      const result = await getProductsAction({ search: searchTerm })
      if (result.success) {
        setProducts(result.products)
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      loadKit()
      loadProducts()
    } else {
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        discount: 0,
        image: "",
      })
      setSelectedItems([])
      setSearchTerm("")
      setKit(null)
    }
  }

  const addProductToKit = (product: Product) => {
    const existingItem = selectedItems.find((item) => item.productId === product.id)
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setSelectedItems([...selectedItems, { productId: product.id, quantity: 1, product }])
    }
  }

  const removeProductFromKit = (productId: number) => {
    setSelectedItems(selectedItems.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromKit(productId)
      return
    }
    setSelectedItems(selectedItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const calculateTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    if (selectedItems.length === 0) {
      toast.error("Adicione pelo menos um produto ao kit")
      return
    }

    setIsLoading(true)

    try {
      const result = await updateKit(kitId, {
        ...formData,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })

      if (result.success) {
        toast.success("Kit atualizado com sucesso!")
        setOpen(false)
        onSuccess?.()
      } else {
        toast.error(result.message || "Erro ao atualizar kit")
      }
    } catch (error) {
      console.error("Erro ao atualizar kit:", error)
      toast.error("Erro interno do servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedItems.some((item) => item.productId === product.id),
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Edit className="h-5 w-5 mr-2 text-blue-600" />
            Editar Kit
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Kit *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Kit Churrasco Premium"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kit Churrasco">Kit Churrasco</SelectItem>
                  <SelectItem value="Kit Família">Kit Família</SelectItem>
                  <SelectItem value="Kit Premium">Kit Premium</SelectItem>
                  <SelectItem value="Kit Econômico">Kit Econômico</SelectItem>
                  <SelectItem value="Kit Especial">Kit Especial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o kit e seus benefícios..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Desconto (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          {/* Produtos Selecionados */}
          {selectedItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Produtos no Kit ({selectedItems.length})</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total:</p>
                  <p className="text-xl font-bold text-green-600">{formatPrice(calculateTotalPrice())}</p>
                  {formData.discount > 0 && (
                    <p className="text-sm text-green-600">
                      Com desconto: {formatPrice(calculateTotalPrice() * (1 - formData.discount / 100))}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedItems.map((item) => (
                  <Card key={item.productId} className="border border-gray-200">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.product.name}</h4>
                          <p className="text-xs text-gray-600">{formatPrice(item.product.price)} cada</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                            className="w-16 h-8 text-center"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProductFromKit(item.productId)}
                            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Buscar e Adicionar Produtos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Adicionar Produtos</h3>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  loadProducts()
                }}
                className="pl-10"
              />
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? "Nenhum produto encontrado" : "Carregue produtos para adicionar"}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="p-3 hover:bg-gray-50 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-xs text-gray-600">{formatPrice(product.price)}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {product.category}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addProductToKit(product)}
                        className="ml-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedItems.length === 0}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isLoading ? "Atualizando..." : "Atualizar Kit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
