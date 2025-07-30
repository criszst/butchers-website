"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, X, Plus, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createAddress } from "@/app/actions/address"
import { toast } from "sonner"

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onAddressCreated: () => void
}

export function AddressModal({ isOpen, onClose, onAddressCreated }: AddressModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [addressData, setAddressData] = useState({
    name: "Casa",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "São Paulo", // Default value
    country: "Brasil", // Default value
    cep: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid =
    addressData.name &&
    addressData.street &&
    addressData.number &&
    addressData.neighborhood &&
    addressData.city &&
    addressData.state &&
    addressData.country &&
    addressData.cep

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsLoading(true)

    try {
      const result = await createAddress({
        name: addressData.name,
        street: addressData.street,
        number: addressData.number,
        complement: addressData.complement,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        cep: addressData.cep,
        isDefault: true, // Still setting as default when created via modal
      })

      if (result.success) {
        toast.success("Endereço salvo com sucesso!")
        onAddressCreated()
        onClose()
        // Reset form fields
        setAddressData({
          name: "Casa",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "São Paulo",
          country: "Brasil",
          cep: "",
        })
      } else {
        toast.error(result.message || "Erro ao salvar endereço")
      }
    } catch (error) {
      toast.error("Erro interno. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="rounded-t-2xl shadow-2xl border-0 bg-white">
              <CardHeader className="border-b bg-gradient-to-r from-red-50 to-orange-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                    <MapPin className="h-5 w-5 mr-2 text-red-600" />
                    Adicionar Endereço
                  </CardTitle>
                  <motion.button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </motion.button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nome do Endereço *
                  </Label>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      type="button"
                      variant={addressData.name === "Casa" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange("name", "Casa")}
                      className={addressData.name === "Casa" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      <Home className="h-4 w-4 mr-1" />
                      Casa
                    </Button>
                    <Button
                      type="button"
                      variant={addressData.name === "Trabalho" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange("name", "Trabalho")}
                      className={addressData.name === "Trabalho" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      Trabalho
                    </Button>
                    <Button
                      type="button"
                      variant={!["Casa", "Trabalho"].includes(addressData.name) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange("name", "Outro")}
                      className={!["Casa", "Trabalho"].includes(addressData.name) ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Outro
                    </Button>
                  </div>
                  {!["Casa", "Trabalho"].includes(addressData.name) && (
                    <Input
                      value={addressData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Nome personalizado"
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3">
                    <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                      Rua/Avenida *
                    </Label>
                    <Input
                      id="street"
                      value={addressData.street}
                      onChange={(e) => handleInputChange("street", e.target.value)}
                      placeholder="Rua, Avenida..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="number" className="text-sm font-medium text-gray-700">
                      Número *
                    </Label>
                    <Input
                      id="number"
                      value={addressData.number}
                      onChange={(e) => handleInputChange("number", e.target.value)}
                      placeholder="123"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="complement" className="text-sm font-medium text-gray-700">
                      Complemento
                    </Label>
                    <Input
                      id="complement"
                      value={addressData.complement}
                      onChange={(e) => handleInputChange("complement", e.target.value)}
                      placeholder="Apto, Bloco..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="neighborhood" className="text-sm font-medium text-gray-700">
                      Bairro *
                    </Label>
                    <Input
                      id="neighborhood"
                      value={addressData.neighborhood}
                      onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                      placeholder="Nome do bairro"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      Cidade *
                    </Label>
                    <Input
                      id="city"
                      value={addressData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Cidade"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                      Estado *
                    </Label>
                    <Input
                      id="state"
                      value={addressData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="Estado"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cep" className="text-sm font-medium text-gray-700">
                    CEP *
                  </Label>
                  <Input
                    id="cep"
                    value={addressData.cep}
                    onChange={(e) => handleInputChange("cep", e.target.value)}
                    placeholder="00000-000"
                    className="mt-1"
                  />
                </div>

                {/* If you want to allow changing country, uncomment this: */}
                {/*
                <div>
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                    País *
                  </Label>
                  <Input
                    id="country"
                    value={addressData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="País"
                    className="mt-1"
                  />
                </div>
                */}

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isLoading ? "Salvando..." : "Salvar Endereço"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
