"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Phone, Mail, MapPin, Building, User, Package, ShoppingCart, Calendar, DollarSign } from "lucide-react"

interface Supplier {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  cnpj?: string | null
  contact?: string | null
  rating?: number | null
  isActive: boolean
  createdAt: Date
  ProductSupplier: any[]
  PurchaseOrder: any[]
}

interface SupplierDetailsModalProps {
  supplier: Supplier
  trigger: React.ReactNode
}

export function SupplierDetailsModal({ supplier, trigger }: SupplierDetailsModalProps) {
  const [open, setOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date))
  }

  const totalOrders = supplier.PurchaseOrder.length
  const totalProducts = supplier.ProductSupplier.length
  const totalSpent = supplier.PurchaseOrder.reduce((sum, order) => sum + order.total, 0)
  const recentOrders = supplier.PurchaseOrder.slice(0, 5)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Detalhes do Fornecedor</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    {supplier.name}
                  </span>
                  <Badge className={supplier.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {supplier.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{supplier.email}</span>
                    </div>

                    {supplier.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{supplier.phone}</span>
                      </div>
                    )}

                    {supplier.contact && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Contato: {supplier.contact}</span>
                      </div>
                    )}

                    {supplier.cnpj && (
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">CNPJ: {supplier.cnpj}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {supplier.address && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span className="text-sm">{supplier.address}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Cadastrado em: {formatDate(supplier.createdAt)}</span>
                    </div>

                    {supplier.rating && (
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">Avaliação: {supplier.rating.toFixed(1)}/5.0</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Produtos Fornecidos ({totalProducts})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {supplier.ProductSupplier.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum produto cadastrado</p>
                ) : (
                  <div className="space-y-3">
                    {supplier.ProductSupplier.map((productSupplier: any) => (
                      <div key={productSupplier.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{productSupplier.product.name}</p>
                          <p className="text-sm text-gray-600">{productSupplier.product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{formatPrice(productSupplier.price)}</p>
                          {productSupplier.minOrder && (
                            <p className="text-xs text-gray-500">Min: {productSupplier.minOrder} un.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Histórico de Pedidos ({totalOrders})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum pedido encontrado</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Pedido #{order.orderNumber.slice(-8)}</p>
                          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{formatPrice(order.total)}</p>
                          <Badge
                            className={
                              order.status === "Recebido"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Pendente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "Enviado"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Pedidos</p>
                      <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Gasto</p>
                      <p className="text-2xl font-bold text-green-600">{formatPrice(totalSpent)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Produtos</p>
                      <p className="text-2xl font-bold text-orange-600">{totalProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {supplier.rating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400 fill-current" />
                    Avaliação do Fornecedor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold text-yellow-600">{supplier.rating.toFixed(1)}</div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${
                            i < Math.floor(supplier.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">de 5.0</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
