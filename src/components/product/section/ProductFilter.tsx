"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

interface ProductFiltersProps {
  categories: string[]
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "todas",
    priceRange: searchParams.get("priceRange") || "all",
    sortBy: searchParams.get("sortBy") || "newest",
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Update URL when filters change
  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams()

    if (newFilters.search) params.set("search", newFilters.search)
    if (newFilters.category !== "todas") params.set("category", newFilters.category)
    if (newFilters.priceRange !== "all") params.set("priceRange", newFilters.priceRange)
    if (newFilters.sortBy !== "newest") params.set("sortBy", newFilters.sortBy)

    const queryString = params.toString()
    const newURL = queryString ? `/?${queryString}` : "/"

    router.push(newURL)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters)

  
    const newActiveFilters: string[] = []
    if (newFilters.search) newActiveFilters.push(`Busca: ${newFilters.search}`)
    if (newFilters.category !== "todas") newActiveFilters.push(`Categoria: ${newFilters.category}`)
    if (newFilters.priceRange !== "all") {
      const priceLabels: { [key: string]: string } = {
        "0-50": "Até R$ 50",
        "50-100": "R$ 50 - R$ 100",
        "100-200": "R$ 100 - R$ 200",
        "200+": "Acima de R$ 200",
      }
      newActiveFilters.push(`Preço: ${priceLabels[newFilters.priceRange] || "Todos"}`)
    }
    setActiveFilters(newActiveFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      search: "",
      category: "todas",
      priceRange: "all",
      sortBy: "newest",
    }
    setFilters(defaultFilters)
    setActiveFilters([])
    router.push("/")
  }

  const removeFilter = (filterText: string) => {
    if (filterText.startsWith("Busca:")) {
      handleFilterChange("search", "")
    } else if (filterText.startsWith("Categoria:")) {
      handleFilterChange("category", "todas")
    } else if (filterText.startsWith("Preço:")) {
      handleFilterChange("priceRange", "all")
    }
  }


  useEffect(() => {
    const newActiveFilters: string[] = []
    if (filters.search) newActiveFilters.push(`Busca: ${filters.search}`)
    if (filters.category !== "todas") newActiveFilters.push(`Categoria: ${filters.category}`)
    if (filters.priceRange !== "all") {
      const priceLabels: { [key: string]: string } = {
        "0-50": "Até R$ 50",
        "50-100": "R$ 50 - R$ 100",
        "100-200": "R$ 100 - R$ 200",
        "200+": "Acima de R$ 200",
      }
      newActiveFilters.push(`Preço: ${priceLabels[filters.priceRange] || "Todos"}`)
    }
    setActiveFilters(newActiveFilters)
  }, [filters])

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={filters.category} onValueChange={(value: string) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Faixa de Preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Preços</SelectItem>
                <SelectItem value="0-50">Até R$ 50</SelectItem>
                <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                <SelectItem value="200+">Acima de R$ 200</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais Recentes</SelectItem>
                <SelectItem value="price-low">Menor Preço</SelectItem>
                <SelectItem value="price-high">Maior Preço</SelectItem>
                <SelectItem value="name">Nome A-Z</SelectItem>
                <SelectItem value="popular">Mais Populares</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filtros ativos:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-red-100"
              onClick={() => removeFilter(filter)}
            >
              {filter}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700">
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  )
}
