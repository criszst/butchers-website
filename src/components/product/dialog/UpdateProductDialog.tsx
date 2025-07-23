"use client"

import React, { useState, useEffect } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Edit } from "lucide-react"

import { updateProduct } from "@/app/actions/product"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  image?: string | null
}

interface UpdateProductProps {
  product: Product
  onSuccess: () => Promise<void>
}

export function UpdateProductDialog({ product, onSuccess }: UpdateProductProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  })

  // Preenche os campos quando o diálogo abrir, com dados do produto passado
  useEffect(() => {
    if (isOpen && product) {
      setUpdatedProduct({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        image: product.image || "",
      })
      setError("")
      setSuccess("")
    }
  }, [isOpen, product])

  const handleInputChange = (field: string, value: string) => {
    setUpdatedProduct((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const result = await updateProduct(product.id, {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: Number.parseFloat(updatedProduct.price),
        category: updatedProduct.category,
        stock: Number.parseInt(updatedProduct.stock),
        image: updatedProduct.image || undefined,
      })

      if (result.success) {
        setSuccess(result.message)
        setIsOpen(false)
        await onSuccess()
      } else {
        setError(result.message)
      }
    } catch {
      setError("Erro ao atualizar produto")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="lg" className="text-blue-500 hover:text-blue-700">
          <Edit className="h-7 w-7" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl mx-4">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 text-red-600 font-medium">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 font-medium">{success}</div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 py-4 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={updatedProduct.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: Picanha Premium"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={updatedProduct.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bovinos">Bovinos</SelectItem>
                    <SelectItem value="Suínos">Suínos</SelectItem>
                    <SelectItem value="Aves">Aves</SelectItem>
                    <SelectItem value="Peixes">Peixes</SelectItem>
                    <SelectItem value="Embutidos">Embutidos</SelectItem>
                    <SelectItem value="Especiais">Especiais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={updatedProduct.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Estoque *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={updatedProduct.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={updatedProduct.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descrição detalhada do produto..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={updatedProduct.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe em branco para usar uma imagem aleatória
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-end space-y-2 lg:space-y-0 lg:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full lg:w-auto"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full lg:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Atualizar Produto
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
