"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus } from "lucide-react"
import { AddAddressDialog } from "@/components/address/AddAddressDialog"
import { useCallback, useEffect, useState } from "react"
import { getAddresses } from "@/app/actions/address"
import { EditAddressDialog } from "@/components/address/EditAddressDialog"
import { ConfirmDeleteAddressDialog } from "@/components/address/DeleteAddressDilaog"
import { Skeleton } from "@/components/ui/skeleton"

interface Address {
  id: string
  name: string
  address: string
  isDefault: boolean
}

interface AddressesTabProps {
  address: Address[]
}


export default function AddressesTab({ address }: AddressesTabProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refetchEnderecos = () => getAddresses().then((data) => {
    if (Array.isArray(data)) {
      setAddresses(data)
      setIsLoading(false)
    }
  })

  useEffect(() => {
    refetchEnderecos()
  }, [address])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-10 w-64" /> 
                <Skeleton className="h-10 w-128" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-16" /> 
                <Skeleton className="h-10 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (addresses.length === 0) {
    return <p className="text-gray-500">Nenhum endereço cadastrado.</p>
  }


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

            <AddAddressDialog onSuccess={refetchEnderecos} />
          </Button>


        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">


          <div className="space-y-4">
            {addresses
              .sort((a: any, b: any) => b.isDefault - a.isDefault)
              .map((address) => (
                <div
                  key={address.id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-200"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{address.name}</h4>
                        {address.isDefault && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            Padrão
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{address.address}</p>
                    </div>

                    <div className="flex space-x-2">
                      <EditAddressDialog
                        address={address}
                        onSuccess={refetchEnderecos}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="transition-colors bg-transparent hover:bg-gray-50"
                          >
                            Editar
                          </Button>
                        }
                      />
                      <ConfirmDeleteAddressDialog
                        addressId={address.id}
                        addressName={address.name}
                        onSuccess={refetchEnderecos}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent transition-colors"
                          >
                            Remover
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
