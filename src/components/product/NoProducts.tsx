"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Search } from "lucide-react"

interface NoProductsMessageProps {
  onClearFilters: () => void
}

export default function NoProductsMessage({ onClearFilters }: NoProductsMessageProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-6">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>

        <p className="text-gray-600 mb-6 max-w-md">
          Não encontramos produtos que correspondam aos seus filtros atuais. Tente ajustar os filtros ou limpar a busca.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onClearFilters} variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>

          <Button>Ver Todos os Produtos</Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Sugestões:</p>
          <ul className="mt-2 space-y-1">
            <li>• Verifique a ortografia das palavras-chave</li>
            <li>• Use termos mais gerais</li>
            <li>• Remova alguns filtros</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
