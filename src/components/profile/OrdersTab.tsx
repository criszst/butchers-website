"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle } from "lucide-react"

const recentOrders = [
  {
    id: "#12345",
    date: "2024-01-15",
    status: "Entregue",
    items: 3,
    products: ["Picanha", "Fraldinha", "Linguiça"],
    total: 89.9,
  },
  {
    id: "#12344",
    date: "2024-01-10",
    status: "Entregue",
    items: 2,
    products: ["Alcatra", "Costela"],
    total: 65.5,
  },
  {
    id: "#12343",
    date: "2024-01-05",
    status: "Entregue",
    items: 4,
    products: ["Maminha", "Contrafilé", "Bacon", "Calabresa"],
    total: 124.8,
  },
]

export default function OrdersTab() {
  return (
    <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
      <CardHeader className="bg-gray-800 text-white p-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Pedidos Recentes</CardTitle>
            <p className="text-white/80 text-sm">Histórico das suas compras</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 border-2 border-gray-200 rounded-3xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="h-7 w-7 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-bold text-xl text-gray-800">{order.id}</p>
                    <p className="text-sm text-gray-600 flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(order.date).toLocaleDateString("pt-BR")}</span>
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-0 px-4 py-2 rounded-xl">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {order.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">{order.items} itens</p>
                  <p className="text-xs text-gray-500">{order.products.join(", ")}</p>
                </div>
                <p className="font-bold text-2xl text-red-600">R$ {order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 px-8 py-3 rounded-xl"
          >
            Ver Todos os Pedidos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
