"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Edit } from "lucide-react"
import { updateSupplier } from "@/app/actions/admin/suppliers"

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
}

interface UpdateSupplierDialogProps {
  supplier: Supplier
  onSuccess: () => Promise<void>
}

export function UpdateSupplierDialog({ supplier, onSuccess }: UpdateSupplierDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [updatedSupplier, setUpdatedSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cnpj: "",
    contact: "",
    rating: "",
    isActive: true,
  })

  useEffect(() => {
    if (isOpen) {
      setUpdatedSupplier({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone || "",
        address: supplier.address || "",
        cnpj: supplier.cnpj || "",
        contact: supplier.contact || "",
        rating: supplier.rating?.toString() || "",
        isActive: supplier.isActive,
      })
      setError("")
    }
  }, [isOpen, supplier])

  const handleInputChange = (field: string, value: string | boolean) => {
    setUpdatedSupplier((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const result = await updateSupplier(supplier.id, {
        name: updatedSupplier.name,
        email: updatedSupplier.email,
        phone: updatedSupplier.phone || undefined,
        address: updatedSupplier.address || undefined,
        cnpj: updatedSupplier.cnpj || undefined,
        contact: updatedSupplier.contact || undefined,
        rating: updatedSupplier.rating ? Number.parseFloat(updatedSupplier.rating) : undefined,
      })

      if (result.success) {
        setIsOpen(false)
        await onSuccess()
      } else {
        setError(result.message)
      }
    } catch {
      setError("Erro ao atualizar fornecedor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Editar Fornecedor</DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                value={updatedSupplier.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={updatedSupplier.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={updatedSupplier.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={updatedSupplier.cnpj}
                onChange={(e) => handleInputChange("cnpj", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contact">Nome do Contato</Label>
              <Input
                id="contact"
                value={updatedSupplier.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="rating">Avaliação (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={updatedSupplier.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={updatedSupplier.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={updatedSupplier.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Fornecedor Ativo</Label>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-2 pt-4">
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
                  Atualizando...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Atualizar Fornecedor
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
