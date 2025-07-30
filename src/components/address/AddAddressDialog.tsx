"use client"
import { useState } from "react"
import type React from "react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { createAddress } from "@/app/actions/address"
import { toast } from "sonner"

interface AddAddressDialogProps {
  onSuccess: () => void
}

export function AddAddressDialog({ onSuccess }: AddAddressDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "São Paulo", // Default value
    country: "Brasil", // Default value
    cep: "",
    isDefault: false,
  })

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid =
    form.name && form.street && form.number && form.neighborhood && form.city && form.state && form.country && form.cep

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      toast.error("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createAddress(form)
      if (result.success) {
        toast.success("Endereço criado com sucesso!")
        setForm({
          name: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "São Paulo",
          country: "Brasil",
          cep: "",
          isDefault: false,
        })
        setIsOpen(false)
        onSuccess()
      } else {
        toast.error(result.message || "Erro ao adicionar endereço.")
      }
    } catch (err) {
      console.error("Erro ao adicionar endereço:", err)
      toast.error("Erro interno. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Endereço
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Novo Endereço</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div>
            <Label htmlFor="name">Identificação *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Casa, Trabalho, etc."
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3">
              <Label htmlFor="street">Rua/Avenida *</Label>
              <Input
                id="street"
                value={form.street}
                onChange={(e) => handleChange("street", e.target.value)}
                placeholder="Rua, Avenida..."
                required
              />
            </div>
            <div>
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                value={form.number}
                onChange={(e) => handleChange("number", e.target.value)}
                placeholder="123"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={form.complement}
                onChange={(e) => handleChange("complement", e.target.value)}
                placeholder="Apto, Bloco..."
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                value={form.neighborhood}
                onChange={(e) => handleChange("neighborhood", e.target.value)}
                placeholder="Nome do bairro"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Cidade"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
                placeholder="Estado"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cep">CEP *</Label>
            <Input
              id="cep"
              value={form.cep}
              onChange={(e) => handleChange("cep", e.target.value)}
              placeholder="00000-000"
              required
            />
          </div>
          <div>
            <Label htmlFor="country">País *</Label>
            <Input
              id="country"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="País"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={form.isDefault}
              onCheckedChange={(checked) => handleChange("isDefault", !!checked)}
            />
            <Label htmlFor="isDefault">Definir como endereço padrão</Label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Endereço"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
