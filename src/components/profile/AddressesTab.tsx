"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit3, Trash2, CheckCircle } from "lucide-react"

const initialAddresses = [
  {
    id: 1,
    name: "Casa",
    street: "Rua das Flores, 123",
    neighborhood: "Centro",
    city: "São Paulo",
    zipCode: "01234-567",
    isDefault: true,
  },
  {
    id: 2,
    name: "Trabalho",
    street: "Av. Paulista, 1000",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    zipCode: "01310-100",
    isDefault: false,
  },
]

export default function AddressesTab() {
  const [addresses, setAddresses] = useState(initialAddresses)

  const addAddress = () => {
    const newAddress = {
      id: addresses.length + 1,
      name: "Novo Endereço",
      street: "",
      neighborhood: "",
      city: "",
      zipCode: "",
      isDefault: false,
    }
    setAddresses([...addresses, newAddress])
  }

  const removeAddress = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  return (
    <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
      <CardHeader className="bg-gray-800 text-white p-8">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Meus Endereços</CardTitle>
              <p className="text-white/80 text-sm">Gerencie seus locais de entrega</p>
            </div>
          </div>
          <Button
            onClick={addAddress}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 border-0 text-white transition-all duration-300 rounded-xl px-6 py-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="relative p-6 border-2 border-gray-200 rounded-3xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:shadow-xl"
            >
              {address.isDefault && (
                <Badge className="absolute top-4 right-4 bg-green-100 text-green-700 border-0 rounded-xl px-3 py-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Padrão
                </Badge>
              )}
              <div className="space-y-4">
                <h4 className="font-bold text-xl flex items-center space-x-3 text-gray-800">
                  <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <span>{address.name}</span>
                </h4>
                <div className="ml-13 space-y-2">
                  <p className="text-gray-700 font-medium text-lg">{address.street}</p>
                  <p className="text-gray-600">
                    {address.neighborhood}, {address.city}
                  </p>
                  <p className="text-gray-600">CEP: {address.zipCode}</p>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-xl"
                >
                  <Edit3 className="h-3 w-3 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAddress(address.id)}
                  className="text-red-600 hover:text-red-700 bg-white border-gray-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300 rounded-xl"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
