"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Filter, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileFiltersProps {
  isOpen: boolean
  onClose: () => void
  categories: string[]
  filters: {
    categoria: string
    faixaPreco: string
    ordenacao: string
  }
  onFiltersChange: (filters: { categoria: string; faixaPreco: string; ordenacao: string }) => void
  onClearFilters: () => void
}

export function MobileFilters({
  isOpen,
  onClose,
  categories,
  filters,
  onFiltersChange,
  onClearFilters,
}: MobileFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleClearFilters = () => {
    const defaultFilters = {
      categoria: "todas",
      faixaPreco: "todas",
      ordenacao: "relevancia",
    }
    setLocalFilters(defaultFilters)
    onClearFilters()
    onClose()
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.categoria !== "todas") count++
    if (localFilters.faixaPreco !== "todas") count++
    if (localFilters.ordenacao !== "relevancia") count++
    return count
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden max-h-[80vh] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Filtros</h3>
                  <p className="text-sm text-gray-600">Refine sua busca</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getActiveFiltersCount() > 0 && (
                  <Badge className="bg-red-600 text-white">{getActiveFiltersCount()}</Badge>
                )}
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Category Filter */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-gray-700">Categoria</label>
                <Select
                  value={localFilters.categoria}
                  onValueChange={(value) => setLocalFilters({ ...localFilters, categoria: value })}
                >
                  <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-red-500 rounded-lg">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as categorias</SelectItem>
                    {categories.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <Separator />

              {/* Price Range Filter */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-gray-700">Faixa de Preço</label>
                <Select
                  value={localFilters.faixaPreco}
                  onValueChange={(value) => setLocalFilters({ ...localFilters, faixaPreco: value })}
                >
                  <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-red-500 rounded-lg">
                    <SelectValue placeholder="Selecione uma faixa de preço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos os preços</SelectItem>
                    <SelectItem value="0-50">Até R$ 50</SelectItem>
                    <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                    <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                    <SelectItem value="200+">Acima de R$ 200</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <Separator />

              {/* Sort Filter */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-700">Ordenar por</label>
                <Select
                  value={localFilters.ordenacao}
                  onValueChange={(value) => setLocalFilters({ ...localFilters, ordenacao: value })}
                >
                  <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-red-500 rounded-lg">
                    <SelectValue placeholder="Selecione a ordenação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancia">Relevância</SelectItem>
                    <SelectItem value="preco-menor">Menor preço</SelectItem>
                    <SelectItem value="preco-maior">Maior preço</SelectItem>
                    <SelectItem value="nome">Nome A-Z</SelectItem>
                    <SelectItem value="mais-novo">Mais recentes</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              className="p-4 border-t bg-gray-50 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex-1 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 py-3 rounded-lg bg-transparent"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Aplicar Filtros
                  {getActiveFiltersCount() > 0 && (
                    <Badge className="ml-2 bg-white text-red-600 text-xs">{getActiveFiltersCount()}</Badge>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
