"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Search, RefreshCw, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

interface NoProductsMessageProps {
  onClearFilters: () => void
}

export function NoProductsMessage({ onClearFilters }: NoProductsMessageProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="w-full shadow-xl border-0 bg-white">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <motion.div
            className="rounded-full bg-gradient-to-br from-red-100 to-orange-100 p-8 mb-6"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <ShoppingBag className="h-16 w-16 text-red-600" />
          </motion.div>

          <motion.h3
            className="text-2xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Nenhum produto encontrado
          </motion.h3>

          <motion.p
            className="text-gray-600 mb-8 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Não encontramos produtos que correspondam aos seus filtros atuais. Tente ajustar os filtros ou limpar a
            busca para ver mais opções.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onClearFilters}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
            <Button
              variant="outline"
              className="border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 px-6 py-3 rounded-lg bg-transparent"
            >
              <Search className="h-4 w-4 mr-2" />
              Ver Todos os Produtos
            </Button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center mb-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-800">Dicas de busca:</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-2 text-left">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                Verifique a ortografia das palavras-chave
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                Use termos mais gerais na busca
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                Remova alguns filtros para ampliar os resultados
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                Experimente buscar por categoria
              </li>
            </ul>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
