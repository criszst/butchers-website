"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { AddressModal } from "@/components/address/AddressModal"
import { useCallback, useEffect, useState } from "react"
import { getUserAddresses } from "@/app/actions/address"
import { Skeleton } from "@/components/ui/skeleton"
import type { Address } from "@/generated/prisma"

interface AddressesTabProps {
  address: Address[]
}

export default function AddressesTab({ address }: AddressesTabProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [showAddressModal, setShowAddressModal] = useState(false)

  const refetchEnderecos = useCallback(async () => {
    setIsLoading(true)
    const result = await getUserAddresses()
    if (result.success && result.addresses) {
      setAddresses(result.addresses)
      const defaultAddress = result.addresses.find((addr) => addr.isDefault)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress)
      } else if (result.addresses.length > 0) {
        setSelectedAddress(result.addresses[0])
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetchEnderecos()
  }, [refetchEnderecos])

 const handleAddressSelect = (address: Address) => {
  setSelectedAddress(address)
  setShowAddressModal(false)
}

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg shadow-sm">
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

  return (
    <>
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
            <Button
              onClick={() => setShowAddressModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white transition-colors"
            >
              Gerenciar Endereços
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Clique em "Gerenciar Endereços" para adicionar, editar ou selecionar seus endereços de entrega.
            </p>

            {selectedAddress ? (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Endereço Atual:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{selectedAddress.name}</span>
                    {selectedAddress.isDefault && (
                      <Badge className="bg-orange-100 text-orange-800 text-xs">Padrão</Badge>
                    )}
                  </div>
                  <p>
                    {selectedAddress.street}, {selectedAddress.number}
                    {selectedAddress.complement && `, ${selectedAddress.complement}`}
                  </p>
                  <p>
                    {selectedAddress.neighborhood}, {selectedAddress.city} - {selectedAddress.state}
                  </p>
                  <p>CEP: {selectedAddress.cep}</p>
                  <p>{selectedAddress.country}</p>
                </div>
              </div>
            ) : (
              /* Added empty state when no address is selected */
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Nenhum endereço selecionado.</p>
                <Button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Adicionar Primeiro Endereço
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelectAddress={handleAddressSelect} 
        selectedAddressId={selectedAddress?.id}
        showSelectButton={true}
      />
    </>
  )
}
