"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Package, Layers } from "lucide-react"
import { toast } from "sonner"

import { getKitById } from "@/app/actions/kit"
import type { Kit } from "@/interfaces/kit"

interface ViewKitDialogProps {
  kitId: number
  trigger?: React.ReactNode
}

export function ViewKitDialog({ kitId, trigger }: ViewKitDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [kit, setKit] = useState<Kit | null>(null)

  const loadKit = async () => {
    try {
      setIsLoading(true)
      const result = await getKitById(kitId)
      if (result.success && result.kit) {
        setKit(result.kit)
      } else {
        toast.error("Erro ao carregar dados do kit")
      }
    } catch (error) {
      console.error("Erro ao carregar kit:", error)
      toast.error("Erro ao carregar dados do kit")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      loadKit()
    } else {
      setKit(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const calculateKitPrice = () => {
    if (!kit) return 0
    const totalPrice = kit.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return kit.discount ? totalPrice - (totalPrice * kit.discount) / 100 : totalPrice
  }

  const calculateOriginalPrice = () => {
    if (!kit) return 0
    return kit.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Eye className="h-5 w-5 mr-2 text-green-600" />
            Detalhes do Kit
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Carregando...</span>
          </div>
        ) : kit ? (
          <div className="space-y-6">
            {/* Kit Header */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3">
                <img
                  src={kit.image || "/placeholder.svg?height=300&width=300&text=Kit"}
                  alt={kit.name}
                  className="w-full h-64 object-cover rounded-lg border"
                />
              </div>

              <div className="lg:w-2/3 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{kit.name}</h2>
                    <Badge className="bg-blue-100 text-blue-800">
                      <Layers className="h-3 w-3 mr-1" />
                      Kit
                    </Badge>
                  </div>
                  <p className="text-gray-600">{kit.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{kit.category}</Badge>
                  <Badge className="bg-blue-100 text-blue-800">{kit.items.length} produtos</Badge>
                  {kit.discount && kit.discount > 0 && (
                    <Badge className="bg-green-600 text-white">-{kit.discount}% OFF</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-green-600">{formatPrice(calculateKitPrice())}</span>
                    {kit.discount && kit.discount > 0 && (
                      <span className="text-lg line-through text-gray-400">
                        {formatPrice(calculateOriginalPrice())}
                      </span>
                    )}
                  </div>
                  {kit.discount && kit.discount > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Economize {formatPrice(calculateOriginalPrice() - calculateKitPrice())}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Kit Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2 text-orange-600" />
                Produtos Inclusos ({kit.items.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kit.items.map((item) => (
                  <Card key={item.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.image || "/placeholder.svg?height=60&width=60&text=Produto"}
                          alt={item.product.name}
                          className="w-15 h-15 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">{item.product.category}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-medium text-green-600">
                              {formatPrice(item.product.price)} cada
                            </span>
                            <Badge variant="outline" className="text-xs">
                              Qtd: {item.quantity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Subtotal: {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t pt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total do Kit:</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{formatPrice(calculateKitPrice())}</div>
                    {kit.discount && kit.discount > 0 && (
                      <div className="text-sm text-gray-500">
                        Preço original: {formatPrice(calculateOriginalPrice())}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Kit não encontrado</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
