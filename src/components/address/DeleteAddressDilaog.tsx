"use client"
import { useState } from "react"
import type React from "react"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteAddress } from "@/app/actions/address"
import { toast } from "sonner"

interface ConfirmDeleteAddressDialogProps {
  addressId: string
  addressName: string
  onSuccess: () => void
  trigger: React.ReactNode
}

export function ConfirmDeleteAddressDialog({
  addressId,
  addressName,
  onSuccess,
  trigger,
}: ConfirmDeleteAddressDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteAddress(addressId)
      if (result.success) {
        toast.success("Endereço removido com sucesso!")
        onSuccess()
        setIsOpen(false)
      } else {
        toast.error(result.message || "Erro ao remover endereço.")
      }
    } catch (err) {
      console.error("Erro ao deletar endereço:", err)
      toast.error("Erro interno. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Endereço</DialogTitle>
        </DialogHeader>
        <p>
          Tem certeza que deseja remover o endereço <strong>{addressName}</strong>?
        </p>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white" disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Removendo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Remover
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
