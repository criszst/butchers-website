"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { createAddress } from "@/app/actions/address"

interface AddAddressDialogProps {
  onSuccess: () => void
}

export function AddAddressDialog({ onSuccess }: AddAddressDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    address: "",
    isDefault: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createAddress(form)

      if (result.success) {
        setForm({ name: "", address: "", isDefault: false })
        setIsOpen(false)
        onSuccess()
      } else {
        console.error(result.message)
      }
    } catch (err) {
      console.error("Erro ao adicionar endereço:", err)
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
            <Label htmlFor="name">Identificação</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Casa, Trabalho, etc."
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Endereço Completo</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Rua, número, bairro, cidade..."
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isSubmitting}
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
