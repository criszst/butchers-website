"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Edit, Info, Calculator } from "lucide-react"
import { updateProduct } from "@/app/actions/product"

interface Product {
  id: number
  name: string
  description: string
  price: number
  priceWeightAmount: number | null
  priceWeightUnit: string | null
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
    priceWeightAmount: "",
    priceWeightUnit: "",
  })

  useEffect(() => {
    if (isOpen) {
      setUpdatedProduct({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        image: product.image || "",
        priceWeightAmount: product.priceWeightAmount?.toString() || "",
        priceWeightUnit: product.priceWeightUnit || "",
      })
      setError("")
      setSuccess("")
    }
  }, [isOpen, product])

  const handleInputChange = (field: string, value: string) => {
    setUpdatedProduct((prev) => ({ ...prev, [field]: value }))
  }

  const formatStockDisplay = () => {
    const stock = Number.parseFloat(updatedProduct.stock)
    const amount = Number.parseInt(updatedProduct.priceWeightAmount)
    const unit = updatedProduct.priceWeightUnit

    if (!stock || !amount || !unit) return ""

    const totalAmount = stock * amount
    if (unit === "kg") {
      return totalAmount < 1000 ? `${(totalAmount).toFixed(2)} kg` : `${totalAmount / 1000} gramas`
    }
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
        stock: Number.parseFloat(updatedProduct.stock),
        image: updatedProduct.image || undefined,
        priceWeightAmount: Number.parseInt(updatedProduct.priceWeightAmount) || null,
        priceWeightUnit: updatedProduct.priceWeightUnit || null,
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
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={updatedProduct.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select value={updatedProduct.category} onValueChange={(value) => handleInputChange("category", value)}>
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

              {/* Sistema de Preços */}
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 flex items-center text-sm">
                  <Info className="h-4 w-4 mr-2" />
                  Configuração de Preços
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="price" className="text-xs">
                      Preço (R$) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={updatedProduct.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceWeightAmount" className="text-xs">
                      Quantidade *
                    </Label>
                    <Input
                      id="priceWeightAmount"
                      type="number"
                      value={updatedProduct.priceWeightAmount}
                      onChange={(e) => handleInputChange("priceWeightAmount", e.target.value)}
                      placeholder="1000"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceWeightUnit" className="text-xs">
                      Unidade *
                    </Label>
                    <Select
                      value={updatedProduct.priceWeightUnit}
                      onValueChange={(value) => handleInputChange("priceWeightUnit", value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Un." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center text-blue-800">
                    <Calculator className="h-4 w-4 mr-2" />
                    Sistema de Preços Atual
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-700">
                  {updatedProduct.price && updatedProduct.priceWeightAmount && updatedProduct.priceWeightUnit && (
                    <div className="bg-white p-3 rounded border">
                      <p>
                        <strong>Configuração:</strong> R$ {updatedProduct.price} por {updatedProduct.priceWeightAmount}
                        {updatedProduct.priceWeightUnit}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Cliente pode comprar qualquer quantidade e o preço será calculado proporcionalmente
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Estoque */}
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 text-sm">Controle de Estoque</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="stock" className="text-xs">
                      Quantidade *
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      step="0.1"
                      value={updatedProduct.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                      required
                      className="text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Em {updatedProduct.priceWeightUnit === "kg" ? "Kilos" : "Unidades"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs">Total Disponível</Label>
                    <div className="h-9 px-3 py-2 bg-white border rounded-md flex items-center">
                      <span className="text-sm font-medium text-gray-700">{formatStockDisplay() || "Configure"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={updatedProduct.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={6}
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
                <p className="text-xs text-muted-foreground mt-1">Deixe em branco para manter a imagem atual</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="w-full lg:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full lg:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
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
