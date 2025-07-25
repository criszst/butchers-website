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
import { Pencil, Loader2 } from "lucide-react"
import { updateAddress } from "@/app/actions/address"

interface EditAddressDialogProps {
  address: {
    id: string
    name: string
    address: string
    isDefault: boolean
  }
  onSuccess: () => void
  trigger: React.ReactNode
}

export function EditAddressDialog({ address, onSuccess, trigger }: EditAddressDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ ...address })

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateAddress(form)

      if (result.success) {
        setIsOpen(false)
        onSuccess()
      }
    } catch (err) {
      console.error("Erro ao atualizar endereço:", err)
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
            <Label htmlFor="name">Identificação</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Endereço Completo</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
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
            <Button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white">
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
