"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Product } from "@/generated/prisma"
interface ViewProductDialogProps {
  product: {
    name: string;
    description: string;
    
    price: number;
    priceWeightAmount: number | null,
    priceWeightUnit: string | null,

    category: string;
    stock: number;
    image?: string | null | undefined;
    
    id: number;
    createdAt: Date;
    discount?: number | null | undefined;
    available: boolean;
  };
  trigger: React.ReactNode;
}

export function ViewProductDialog({ product, trigger }: ViewProductDialogProps) {
  const [open, setOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Esgotado", color: "bg-red-100 text-red-800" }
    if (stock <= 5) return { label: "Baixo", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Disponível", color: "bg-green-100 text-green-800" }
  }

  const stockStatus = getStockStatus(product.stock)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Preview do produto na página principal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 border border-gray-200 rounded-lg p-4">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-700">{product.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Categoria</p>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <div>
              <p className="text-gray-500">Estoque</p>
              <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
            </div>
            <div>
              <p className="text-gray-500">Preço</p>
              <p className="font-semibold text-green-600">{formatPrice(product.price)} a cada {product.priceWeightAmount} {product.priceWeightUnit}</p>
            </div>
            <div>
              <p className="text-gray-500">Id do produto (Código)</p>
              <p className="text-gray-900">{product.id}</p>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
