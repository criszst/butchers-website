"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus } from "lucide-react"

interface Address {
  id: number
  name: string
  address: string
  isDefault: boolean
}

interface AddressesTabProps {
  addresses: Address[]
}

export default function AddressesTab({ addresses }: AddressesTabProps) {
  return (
    <Card className="border-gray-200 bg-white rounded-xl shadow-md">
      <CardHeader className="border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Meus Endereços</h3>
              <p className="text-sm text-gray-500">Gerencie seus endereços de entrega</p>
            </div>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Endereço
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-200"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{address.name}</h4>
                    {address.isDefault && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">Padrão</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{address.address}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="transition-colors bg-transparent hover:bg-gray-50">
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent transition-colors"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
