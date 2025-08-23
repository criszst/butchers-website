"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2, Info, Calculator, Upload } from "lucide-react"
import { toast } from "sonner"
import { createProduct } from "@/app/actions/product"
import type ProductData from "@/interfaces/product"

interface AddProductDialogProps {
  onSuccess: () => void
}

export function AddProductDialog({ onSuccess }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    priceWeightAmount: null,
    priceWeightUnit: "",
    category: "",
    stock: 0,
    image: "",
    available: true,
    discount: 0,
  })

  const handleInputChange = (field: keyof ProductData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({ ...prev, image: data.url }))
        setImagePreview(data.url)
        toast.success("Imagem enviada com sucesso!")
      } else {
        toast.error("Erro ao enviar imagem")
      }
    } catch (error) {
      toast.error("Erro ao enviar imagem")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Arquivo muito grande. Máximo 5MB.")
        return
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Apenas arquivos de imagem são permitidos.")
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (imageFile && !formData.image) {
        await handleImageUpload(imageFile)
      }

      const result = await createProduct(formData)

      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        setImageFile(null)
        setImagePreview("")
        setFormData({
          name: "",
          description: "",
          price: 0,
          priceWeightAmount: null,
          priceWeightUnit: "",
          category: "",
          stock: 0,
          image: "",
          available: true,
          discount: 0,
        })
        onSuccess()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Erro ao criar produto")
    } finally {
      setIsLoading(false)
    }
  }

  const formatStockDisplay = () => {
    if (!formData.stock || !formData.priceWeightUnit) return ""

    const total = formData.stock

    return `${total.toFixed(2)} kg`
  }

  const preco = formData.price

  // Quantidade e unidade
  const quantidade = formData.priceWeightAmount
  const unidade = formData.priceWeightUnit

  const precoPorKg = preco

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-red-600 hover:bg-red-50 border border-red-200">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha as informações do produto. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exemplo de Como Funciona */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center text-blue-800">
                <Calculator className="h-4 w-4 mr-2" />
                Como Funciona o Sistema de Preços
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700 space-y-2">
              <p>
                <strong>Exemplo:</strong> Picanha vendida por Quilograma
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs bg-white p-3 rounded border">
                <div>
                  <strong>Preço:</strong> R$ 45,00
                </div>
                <div>
                  <strong>Quantidade:</strong> 1
                </div>
                <div>
                  <strong>Unidade:</strong> Kg (quilogramas)
                </div>
              </div>
              <p className="text-xs">
                ✅ Cliente pode comprar: 500g por R$ 22,50 | 1,2kg por R$ 54,00 | 750g por R$ 33,75
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Picanha Premium, Alcatra Especial"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Nome que aparecerá para os clientes</p>
            </div>

            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
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
              <p className="text-xs text-gray-500 mt-1">Categoria para organização</p>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição do Produto *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Ex: Picanha premium, macia e suculenta, ideal para churrasco..."
              rows={3}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Descrição detalhada que aparecerá na página do produto</p>
          </div>

          {/* Sistema de Preços */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Configuração de Preços
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Preço do Produto (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                  placeholder="45.00"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Preço que você cobra</p>
              </div>

              <div>
                <Label htmlFor="priceWeightAmount">Por Quantidade *</Label>
                <Input
                  id="priceWeightAmount"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.priceWeightAmount || ""}
                  onChange={(e) => handleInputChange("priceWeightAmount", Number.parseFloat(e.target.value) || null)}
                  placeholder="1.0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Ex: 1,0 para 1 quilograma ( 1kg)</p>
              </div>

              <div>
                <Label htmlFor="priceWeightUnit">Unidade *</Label>
                <Select
                  value={formData.priceWeightUnit || ""}
                  onValueChange={(value) => handleInputChange("priceWeightUnit", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Unidade de medida</p>
              </div>
            </div>

            {formData.price && formData.priceWeightAmount && formData.priceWeightUnit && (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Resultado:</strong> R$ {preco.toFixed(2)} por {quantidade} kg (equivalente a R${" "}
                  {quantidade !== null && quantidade > 1 ? (precoPorKg / 2).toFixed(2) : precoPorKg?.toFixed(2)} por kg)
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Cliente pode comprar qualquer quantidade e o preço será calculado proporcionalmente
                </p>
              </div>
            )}
          </div>

          {/* Estoque */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">Controle de Estoque (Opcional)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Quantidade em Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.stock || ""}
                  onChange={(e) => handleInputChange("stock", Number.parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 12.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Quantidade total disponível quilogramas (kg) no estoque. Deixe vazio se não controlar estoque.
                </p>
              </div>

              <div>
                <Label>Estoque Total Calculado</Label>
                <div className="h-10 px-3 py-2 bg-white border rounded-md flex items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {formatStockDisplay() || "Sem controle de estoque"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Total disponível para venda</p>
              </div>
            </div>
          </div>

          {/* Imagem do Produto */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">Imagem do Produto</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image-upload">Enviar Imagem</Label>
                <div className="space-y-2">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    disabled={isUploadingImage}
                    className="w-full"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Escolher Arquivo
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500">Máximo 5MB - JPG, PNG, GIF</p>
                </div>
              </div>

              <div>
                <Label htmlFor="image-url">Ou URL da Imagem</Label>
                <Input
                  id="image-url"
                  type="url"
                  value={formData.image || ""}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Link direto da imagem</p>
              </div>
            </div>

            {/* Image Preview */}
            {(imagePreview || formData.image) && (
              <div className="mt-4">
                <Label>Pré-visualização</Label>
                <div className="mt-2 border rounded-lg p-2 bg-white">
                  <img
                    src={(imagePreview || formData.image) as string}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded mx-auto"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desconto */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <Label htmlFor="discount">Desconto (%) - Opcional</Label>
              <Input
                id="discount"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.discount || ""}
                onChange={(e) => handleInputChange("discount", Number.parseFloat(e.target.value) || 0)}
                placeholder="10"
              />
              <p className="text-xs text-gray-500 mt-1">Desconto promocional (deixe vazio se não houver)</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Produto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
