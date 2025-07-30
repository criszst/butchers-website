"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { updateAddress } from "@/app/actions/address"
import type { Address } from "@/generated/prisma"
import { toast } from "sonner"

interface EditAddressDialogProps {
  address: Address
  onSuccess: () => void
  trigger: React.ReactNode
}

export function EditAddressDialog({ address, onSuccess, trigger }: EditAddressDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<Address>(address)

  useEffect(() => {
    setForm(address)
  }, [address])

  const handleChange = (field: keyof Address, value: string | boolean) => {
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
      const result = await updateAddress(form)
      if (result.success) {
        toast.success("Endereço atualizado com sucesso!")
        setIsOpen(false)
        onSuccess()
      } else {
        toast.error(result.message || "Erro ao atualizar endereço.")
      }
    } catch (err) {
      console.error("Erro ao atualizar endereço:", err)
      toast.error("Erro interno. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Editar Endereço</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div>
            <Label htmlFor="name">Identificação *</Label>
            <Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
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
                value={form.complement || ""}
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
            <Label htmlFor="isDefault">Definir como padrão</Label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
