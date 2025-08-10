"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X, Search } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface FilterOptions {
  dateRange: {
    start: Date | null
    end: Date | null
  }
  category: string
  status: string
  minAmount: string
  maxAmount: string
  customer: string
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
  className?: string
}

export default function AdvancedFilters({ onFiltersChange, onReset, className }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      start: null,
      end: null,
    },
    category: "all",
    status: "all",
    minAmount: "",
    maxAmount: "",
    customer: "",
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    const newFilters = {
      ...filters,
      dateRange: { start, end },
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      dateRange: { start: null, end: null },
      category: "all",
      status: "all",
      minAmount: "",
      maxAmount: "",
      customer: "",
    }
    setFilters(resetFilters)
    onReset()
  }

  const hasActiveFilters = () => {
    return (
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.category !== "all" ||
      filters.status !== "all" ||
      filters.minAmount ||
      filters.maxAmount ||
      filters.customer
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2 text-orange-600" />
            Filtros Avançados
            {hasActiveFilters() && (
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                {Object.values(filters).filter((v) => v && v !== "all").length} ativos
              </span>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters() && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros básicos - sempre visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Período</Label>
            <div className="flex space-x-2">
              <DatePicker
                selected={filters.dateRange.start}
                onChange={(date) => handleDateRangeChange(date, filters.dateRange.end)}
                placeholderText="Data inicial"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                dateFormat="dd/MM/yyyy"
              />
              <DatePicker
                selected={filters.dateRange.end}
                onChange={(date) => handleDateRangeChange(filters.dateRange.start, date)}
                placeholderText="Data final"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="Carnes Nobres">Carnes Nobres</SelectItem>
                <SelectItem value="Carnes Especiais">Carnes Especiais</SelectItem>
                <SelectItem value="Embutidos">Embutidos</SelectItem>
                <SelectItem value="Aves">Aves</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Preparando">Preparando</SelectItem>
                <SelectItem value="Enviado">Enviado</SelectItem>
                <SelectItem value="Entregue">Entregue</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros avançados - expansíveis */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <Label>Valor Mínimo</Label>
              <Input
                type="number"
                placeholder="R$ 0,00"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange("minAmount", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Valor Máximo</Label>
              <Input
                type="number"
                placeholder="R$ 999,99"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Cliente</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome ou email do cliente"
                  value={filters.customer}
                  onChange={(e) => handleFilterChange("customer", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumo dos filtros ativos */}
        {hasActiveFilters() && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {filters.dateRange.start && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  De: {filters.dateRange.start.toLocaleDateString("pt-BR")}
                </span>
              )}
              {filters.dateRange.end && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Até: {filters.dateRange.end.toLocaleDateString("pt-BR")}
                </span>
              )}
              {filters.category !== "all" && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Categoria: {filters.category}
                </span>
              )}
              {filters.status !== "all" && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Status: {filters.status}
                </span>
              )}
              {filters.minAmount && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Min: R$ {filters.minAmount}
                </span>
              )}
              {filters.maxAmount && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Max: R$ {filters.maxAmount}
                </span>
              )}
              {filters.customer && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  Cliente: {filters.customer}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
