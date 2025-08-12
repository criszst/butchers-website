"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus } from "lucide-react"
import { createSupplier } from "@/app/actions/admin/suppliers"

interface AddSupplierDialogProps {
  onSuccess: () => Promise<void>
}

export function AddSupplierDialog({ onSuccess }: AddSupplierDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cnpj: "",
    contact: "",
    rating: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setNewSupplier((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const result = await createSupplier({
        name: newSupplier.name,
        email: newSupplier.email,
        phone: newSupplier.phone || undefined,
        address: newSupplier.address || undefined,
        cnpj: newSupplier.cnpj || undefined,
        contact: newSupplier.contact || undefined,
        rating: newSupplier.rating ? Number.parseFloat(newSupplier.rating) : undefined,
      })

      if (result.success) {
        setNewSupplier({
          name: "",
          email: "",
          phone: "",
          address: "",
          cnpj: "",
          contact: "",
          rating: "",
        })
        setIsOpen(false)
        await onSuccess()
      } else {
        setError(result.message)
      }
    } catch {
      setError("Erro ao criar fornecedor")
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
          <span className="hidden lg:inline">Novo Fornecedor</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Adicionar Novo Fornecedor</DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                value={newSupplier.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Frigorífico São Paulo"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newSupplier.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contato@empresa.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={newSupplier.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={newSupplier.cnpj}
                onChange={(e) => handleInputChange("cnpj", e.target.value)}
                placeholder="00.000.000/0001-00"
              />
            </div>

            <div>
              <Label htmlFor="contact">Nome do Contato</Label>
              <Input
                id="contact"
                value={newSupplier.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                placeholder="João Silva"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={newSupplier.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Rua das Flores, 123 - Centro - São Paulo/SP"
                rows={3}
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
                value={newSupplier.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
                placeholder="4.5"
              />
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
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Fornecedor
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
