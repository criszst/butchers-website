"use client"

import { Button } from "@/components/ui/button"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, DollarSign, ListOrdered, Truck, MapPin, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"


import { Order, OrderItem } from "@/generated/prisma"
import { useState } from "react"

interface TrackingInfo {
  status: string
  estimatedDelivery: string
  trackingNumber: string
}

interface OrderDetailDialogProps {
  order: Order | null
  items: OrderItem[]
  isOpen: boolean
  onClose: () => void
}

const orderNotFound = () => {
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Pedido não encontrado</DialogTitle>
          <DialogDescription className="text-gray-600">
            Não foi possível encontrar o pedido solicitado.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}


export default function OrderDetailDialog({ order, items, isOpen, onClose }: OrderDetailDialogProps) {

  if (!order && !isOpen) return null;

  if (!order) return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {orderNotFound()}
    </Dialog>
  )
  
  if (!items || items.length === 0) {
      <Dialog open={isOpen} onOpenChange={onClose}>
      {orderNotFound()}
    </Dialog>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <Package className="h-6 w-6 mr-2 text-orange-600" />
            Detalhes do Pedido #{order?.id}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Informações completas sobre seu pedido e status de entrega.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Informações Gerais do Pedido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Data do Pedido</p>
                <p className="font-medium">{order.createdAt.toString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium">R$ {order.total.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:col-span-2">
              <CheckCircle className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className="bg-green-100 text-green-800 border-green-200">{order.status}</Badge>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Itens do Pedido */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <ListOrdered className="h-5 w-5 mr-2 text-orange-600" />
              Itens
            </h3>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-600">
                    {item.quantity}x - R$ {item.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Informações de Rastreamento */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-orange-600" />
              Rastreamento
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Status:</p>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">{order.status}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Previsão de Entrega:</p>
                <p className="font-medium">{order.date.toString()}</p>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 transition-colors"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Ver no Mapa
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
