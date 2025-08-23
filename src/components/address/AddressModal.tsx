"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Plus, Edit, Trash2, X } from "lucide-react"
import { createAddress, getUserAddresses, updateAddress, deleteAddress } from "@/app/actions/address"
import { toast } from "sonner"

interface Address {
  id: string
  name: string
  street: string
  number: string
  complement: string | null;
  neighborhood: string
  city: string
  state: string
  country: string
  cep: string
  isDefault: boolean
  userId: string
  createdAt: Date 
  updatedAt: Date
}

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectAddress?: (address: Address) => void
  selectedAddressId?: string
  showSelectButton?: boolean
}

export function AddressModal({
  isOpen,
  onClose,
  onSelectAddress,
  selectedAddressId,
  showSelectButton = false,
}: AddressModalProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [showCepForm, setShowCepForm] = useState(false)
  const [cepInput, setCepInput] = useState("")
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
    cep: "",
    isDefault: false,
  })

  useEffect(() => {
    if (isOpen) {
      loadAddresses()
    }
  }, [isOpen])

  const loadAddresses = async () => {
    setIsLoading(true)
    try {
      const result = await getUserAddresses()
      if (result.success) {
        setAddresses(result.addresses)
        if (result.addresses.length === 0) {
          setShowAddForm(true)
        }
      }
    } catch (error) {
      toast.error("Erro ao carregar endereços")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editingAddress) {
        const result = await updateAddress({
          id: editingAddress.id,
          ...formData,
        })
        if (result.success) {
          toast.success("Endereço atualizado com sucesso!")
          setEditingAddress(null)
        } else {
          toast.error(result.message || "Erro ao atualizar endereço")
        }
      } else {
        const result = await createAddress(formData)
        if (result.success) {
          toast.success("Endereço criado com sucesso!")
        } else {
          toast.error(result.message || "Erro ao criar endereço")
        }
      }

      setFormData({
        name: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "Brasil",
        cep: "",
        isDefault: false,
      })
      setShowAddForm(false)
      await loadAddresses()
    } catch (error) {
      toast.error("Erro interno do servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      name: address.name,
      street: address.street,
      number: address.number,
      complement: address.complement || "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      country: address.country,
      cep: address.cep,
      isDefault: address.isDefault,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) return

    setIsLoading(true)
    try {
      const result = await deleteAddress(id)
      if (result.success) {
        toast.success("Endereço excluído com sucesso!")
        await loadAddresses()
      } else {
        toast.error(result.message || "Erro ao excluir endereço")
      }
    } catch (error) {
      toast.error("Erro interno do servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (address: Address) => {
    if (onSelectAddress) {
      onSelectAddress(address)
    }
    onClose()
  }

  const handleCepLookup = async () => {
    if (!cepInput.trim()) {
      toast.error("Digite um CEP válido")
      return
    }

    setIsLoadingCep(true)
    try {
      const response = await fetch(`/api/cep?cep=${cepInput}`)
      const data = await response.json()

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          cep: data.cep,
          street: data.street,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          complement: data.complement || prev.complement,
        }))
        setShowCepForm(false)
        setShowAddForm(true)
        toast.success("Endereço encontrado! Complete as informações restantes.")
      } else {
        toast.error(data.error || "CEP não encontrado")
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP")
    } finally {
      setIsLoadingCep(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{showSelectButton ? "Selecionar Endereço" : "Meus Endereços"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando endereços...</p>
            </div>
          ) : (
            <>
              {/* CEP lookup form */}
              {showCepForm && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Buscar por CEP</h3>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowCepForm(false)
                        setCepInput("")
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cep-input">Digite o CEP</Label>
                      <Input
                        id="cep-input"
                        value={cepInput}
                        onChange={(e) => setCepInput(e.target.value)}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                    <Button
                      onClick={handleCepLookup}
                      disabled={isLoadingCep}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isLoadingCep ? "Buscando..." : "Buscar Endereço"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCepForm(false)
                        setShowAddForm(true)
                      }}
                      className="w-full"
                    >
                      Preencher Manualmente
                    </Button>
                  </div>
                </div>
              )}

              {/* Address List */}
              {!showAddForm && !showCepForm && addresses.length > 0 && (
                <div className="p-6 space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border rounded-lg ${
                        selectedAddressId === address.id ? "border-green-500 bg-green-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{address.name}</h3>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Padrão
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.street}, {address.number}
                              {address.complement && `, ${address.complement}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.neighborhood}, {address.city} - {address.state}
                            </p>
                            <p className="text-sm text-gray-600">CEP: {address.cep}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {showSelectButton && (
                            <Button
                              size="sm"
                              onClick={() => handleSelect(address)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Selecionar
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(address)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(address.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Address Form */}
              {showAddForm && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">{editingAddress ? "Editar Endereço" : "Novo Endereço"}</h3>
                    {addresses.length > 0 && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowAddForm(false)
                          setEditingAddress(null)
                          setFormData({
                            name: "",
                            street: "",
                            number: "",
                            complement: "",
                            neighborhood: "",
                            city: "",
                            state: "",
                            country: "Brasil",
                            cep: "",
                            isDefault: false,
                          })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          value={formData.cep}
                          onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                          placeholder="00000-000"
                          required
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCepInput(formData.cep)
                            handleCepLookup()
                          }}
                          disabled={!formData.cep || isLoadingCep}
                        >
                          {isLoadingCep ? "..." : "Buscar"}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="name">Nome do endereço</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Casa, Trabalho"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input
                          id="street"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        placeholder="Apartamento, bloco, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input
                          id="neighborhood"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          value={formData.cep}
                          onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                          placeholder="00000-000"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isDefault"
                        checked={formData.isDefault}
                        onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
                      />
                      <Label htmlFor="isDefault">Definir como endereço padrão</Label>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button type="submit" disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700">
                        {isLoading ? "Salvando..." : editingAddress ? "Atualizar" : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {!showAddForm && !showCepForm && addresses.length > 0 && (
                <div className="p-6 border-t space-y-2">
                  <Button onClick={() => setShowCepForm(true)} className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar por CEP
                  </Button>
                  <Button onClick={() => setShowAddForm(true)} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Manualmente
                  </Button>
                </div>
              )}

              {!showAddForm && !showCepForm && addresses.length === 0 && (
                <div className="p-6 text-center space-y-4">
                  <p className="text-gray-600">Você ainda não tem endereços cadastrados</p>
                  <div className="space-y-2">
                    <Button onClick={() => setShowCepForm(true)} className="w-full bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar por CEP
                    </Button>
                    <Button onClick={() => setShowAddForm(true)} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Manualmente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
