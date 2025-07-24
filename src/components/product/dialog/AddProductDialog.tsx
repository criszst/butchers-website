"use client"

import React, { useState } from "react"
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
import { Loader2, Plus } from "lucide-react"
import { createProduct } from "@/app/actions/product"

interface AddProductDialogProps {
  onSuccess: () => Promise<void>
}

export function AddProductDialog({ onSuccess }: AddProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    weightAmount: "",
    weightUnit: "",
    category: "",
    stock: "",
    image: "",
  })

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
        weightPrice: Number.parseFloat(newProduct.weightAmount),
        priceWeightAmount: Number.parseInt(newProduct.weightAmount) || null,
        priceWeightUnit: newProduct.weightUnit || null,
      })

      if (result.success) {
        setSuccess(result.message)
        setNewProduct({
          name: "",
          description: "",
          price: "",
          weightAmount: "",
          weightUnit: "",
          category: "",
          stock: "",
          image: "",
        })
        setIsOpen(false)
        await onSuccess()
      } else {
        setError(result.message)
      }
    } catch {
      setError("Erro ao criar produto")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full lg:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          <span className="lg:hidden">Adicionar</span>
          <span className="hidden lg:inline">Novo Produto</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Adicionar Novo Produto</DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* COLUNA 1 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: Picanha Premium"
                  required
                />
              </div>

              <div className="w-full ">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={newProduct.category}
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

              <div>
                <Label htmlFor="price">Preço</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className="w-32"
                    required
                  />
                  <span className="text-sm">reais a cada</span>
                  <Input
                    id="weight_amount"
                    type="number"
                    step="1"
                    min="1"
                    value={newProduct.weightAmount}
                    onChange={(e) => handleInputChange("weightAmount", e.target.value)}
                    placeholder="1"
                    className="w-20"
                    required
                  />
                  <Select
                    value={newProduct.weightUnit}
                    onValueChange={(value) => handleInputChange("weightUnit", value)}
                  >
                    <SelectTrigger className="w-26">
                      <SelectValue placeholder="Kg" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grama">Gramas</SelectItem>
                      <SelectItem value="Kilo">Kilos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* COLUNA 2 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descrição detalhada do produto..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={newProduct.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Deixe em branco para deixar a IA gerar uma imagem (beta)
                </p>
              </div>
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex flex-col md:flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Produto
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
