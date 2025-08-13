"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createAddress } from "@/app/actions/address"
import { toast } from "sonner"
import { Loader2, MapPin, Plus } from "lucide-react"

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onAddressCreated: () => void
}

export function AddressModal({ isOpen, onClose, onAddressCreated }: AddressModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
    cep: "",
    isDefault: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createAddress(formData)
      if (result.success) {
        toast.success("Endereço criado com sucesso!")
        onAddressCreated()
        onClose()
        setFormData({
          name: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          country: "Brasil",
          cep: "",
          isDefault: false,
        })
      } else {
        toast.error(result.message || "Erro ao criar endereço")
      }
    } catch (error) {
      toast.error("Erro interno. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-red-500" />
            <span>Novo Endereço</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Nome do endereço *</Label>
              <Input
                id="name"
                placeholder="Ex: Casa, Trabalho..."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                placeholder="00000-000"
                value={formData.cep}
                onChange={(e) => handleInputChange("cep", e.target.value)}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="street">Rua *</Label>
              <Input
                id="street"
                placeholder="Nome da rua"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                placeholder="123"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                placeholder="Apto, bloco, etc."
                value={formData.complement}
                onChange={(e) => handleInputChange("complement", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                placeholder="Nome do bairro"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                placeholder="Nome da cidade"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                placeholder="SP"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => handleInputChange("isDefault", checked as boolean)}
            />
            <Label htmlFor="isDefault" className="text-sm">
              Definir como endereço padrão
            </Label>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Salvar Endereço
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
