"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Zap, Grid3X3, List, SlidersHorizontal, X } from "lucide-react"
import { useCart } from "@/components/cart/context"
import type { Product } from "@/generated/prisma"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { MobileFilters } from "@/components/product/mobile/MobileFilters"
import { ProductCard } from "@/components/product/section/ProductCard"
import { NoProductsMessage } from "@/components/product/section/NoProducts"

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [termoBusca, setTermoBusca] = useState("")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas")
  const [faixaPreco, setFaixaPreco] = useState("todas")
  const [ordenacao, setOrdenacao] = useState("relevancia")
  const [favoritos, setFavoritos] = useState<number[]>([])
  const [loadingProducts, setLoadingProducts] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [filtrosAtivos, setFiltrosAtivos] = useState<string[]>([])

  const { addItem, isLoading } = useCart()

 
  const productsFiltrados = products.filter((product) => {
    const correspondeNome = product.name.toLowerCase().includes(termoBusca.toLowerCase())
    const correspondeCategoria = categoriaSelecionada === "todas" || product.category === categoriaSelecionada

    let correspondePreco = true
    if (faixaPreco !== "todas") {
      const preco = product.price
      switch (faixaPreco) {
        case "0-50":
          correspondePreco = preco <= 50
          break
        case "50-100":
          correspondePreco = preco > 50 && preco <= 100
          break
        case "100-200":
          correspondePreco = preco > 100 && preco <= 200
          break
        case "200+":
          correspondePreco = preco > 200
          break
      }
    }

    return correspondeNome && correspondeCategoria && correspondePreco && product.available
  })

  // Ordenar produtos
  const produtosOrdenados = [...productsFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case "preco-menor":
        return a.price - b.price
      case "preco-maior":
        return b.price - a.price
      case "nome":
        return a.name.localeCompare(b.name)
      case "mais-novo":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  // Atualizar filtros ativos
  useEffect(() => {
    const filtros: string[] = []
    if (termoBusca) filtros.push(`Busca: ${termoBusca}`)
    if (categoriaSelecionada !== "todas") filtros.push(`Categoria: ${categoriaSelecionada}`)
    if (faixaPreco !== "todas") {
      const labels: { [key: string]: string } = {
        "0-50": "Até R$ 50",
        "50-100": "R$ 50 - R$ 100",
        "100-200": "R$ 100 - R$ 200",
        "200+": "Acima de R$ 200",
      }
      filtros.push(`Preço: ${labels[faixaPreco]}`)
    }
    setFiltrosAtivos(filtros)
  }, [termoBusca, categoriaSelecionada, faixaPreco])

  const getRandomImage = () => {
    const meatImages = [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop",
    ]
    return meatImages[Math.floor(Math.random() * meatImages.length)]
  }

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
    toast.success(favoritos.includes(id) ? "Removido dos favoritos" : "Adicionado aos favoritos")
  }

  const handleAddToCart = async (product: Product) => {
    if (!product.available) {
      toast.error("Produto não disponível")
      return
    }

    setLoadingProducts((prev) => [...prev, product.id])
    try {
      await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        available: product.available,
        priceWeightAmount: product.priceWeightAmount,
        priceWeightUnit: product.priceWeightUnit,
      })
    } catch (error) {
      toast.error("Erro ao adicionar produto ao carrinho")
    } finally {
      setLoadingProducts((prev) => prev.filter((id) => id !== product.id))
    }
  }

  const limparFiltros = () => {
    setTermoBusca("")
    setCategoriaSelecionada("todas")
    setFaixaPreco("todas")
    setOrdenacao("relevancia")
  }

  const removerFiltro = (filtro: string) => {
    if (filtro.startsWith("Busca:")) {
      setTermoBusca("")
    } else if (filtro.startsWith("Categoria:")) {
      setCategoriaSelecionada("todas")
    } else if (filtro.startsWith("Preço:")) {
      setFaixaPreco("todas")
    }
  }

  const categorias = Array.from(new Set(products.map((p) => p.category)))

  return (
    <section id="produtos" className="py-8 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            <span>Produtos Premium</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Cortes Selecionados
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Carnes de qualidade premium, selecionadas especialmente para você. Frescor garantido e sabor incomparável.
          </p>
        </motion.div>

        {/* Desktop Filters */}
        <motion.div
          className="hidden lg:block mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buscar produtos</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Digite o nome do produto..."
                      className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-red-500 transition-all duration-300 rounded-lg"
                      value={termoBusca}
                      onChange={(e) => setTermoBusca(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
                    <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-red-500 rounded-lg">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faixa de Preço</label>
                  <Select value={faixaPreco} onValueChange={setFaixaPreco}>
                    <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-red-500 rounded-lg">
                      <SelectValue placeholder="Preço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todos os preços</SelectItem>
                      <SelectItem value="0-50">Até R$ 50</SelectItem>
                      <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                      <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                      <SelectItem value="200+">Acima de R$ 200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                  <Select value={ordenacao} onValueChange={setOrdenacao}>
                    <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-red-500 rounded-lg">
                      <SelectValue placeholder="Ordenar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevancia">Relevância</SelectItem>
                      <SelectItem value="preco-menor">Menor preço</SelectItem>
                      <SelectItem value="preco-maior">Maior preço</SelectItem>
                      <SelectItem value="nome">Nome A-Z</SelectItem>
                      <SelectItem value="mais-novo">Mais recentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mobile Search & Filter Button */}
        <div className="lg:hidden mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-red-500 transition-all duration-300 rounded-lg"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center space-x-2 border-2 border-gray-200 hover:border-red-300 rounded-lg px-4 py-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
              {filtrosAtivos.length > 0 && (
                <Badge className="bg-red-600 text-white text-xs">{filtrosAtivos.length}</Badge>
              )}
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-red-50 text-red-600" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-red-50 text-red-600" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {filtrosAtivos.length > 0 && (
            <motion.div
              className="mb-6 flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span className="text-sm font-medium text-gray-700">Filtros ativos:</span>
              {filtrosAtivos.map((filtro, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 transition-colors flex items-center space-x-1"
                    onClick={() => removerFiltro(filtro)}
                  >
                    <span>{filtro}</span>
                    <X className="h-3 w-3" />
                  </Badge>
                </motion.div>
              ))}
              <Button variant="ghost" size="sm" onClick={limparFiltros} className="text-red-600 hover:text-red-700">
                Limpar todos
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">{produtosOrdenados.length}</span> produtos encontrados
          </p>
          <div className="hidden lg:flex items-center space-x-2">
            <span className="text-sm text-gray-600">Visualização:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-red-50 text-red-600" : ""}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-red-50 text-red-600" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {produtosOrdenados.length === 0 ? (
            <motion.div
              key="no-products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <NoProductsMessage onClearFilters={limparFiltros} />
            </motion.div>
          ) : (
            <motion.div
              key="products-grid"
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 lg:grid-cols-2"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {produtosOrdenados.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <ProductCard
                    product={product}
                    viewMode={viewMode}
                    isFavorite={favoritos.includes(product.id)}
                    isLoading={loadingProducts.includes(product.id)}
                    onToggleFavorite={() => toggleFavorito(product.id)}
                    onAddToCart={() => handleAddToCart(product)}
                    getRandomImage={getRandomImage}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-8 lg:p-12 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-4xl font-bold mb-4">Não encontrou o que procura?</h3>
                <p className="text-lg lg:text-xl mb-6 opacity-90">
                  Entre em contato conosco! Temos outros cortes especiais disponíveis.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Falar com Especialista
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Mobile Filters Modal */}
      <MobileFilters
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        categories={categorias}
        filters={{
          categoria: categoriaSelecionada,
          faixaPreco,
          ordenacao,
        }}
        onFiltersChange={(filters) => {
          setCategoriaSelecionada(filters.categoria)
          setFaixaPreco(filters.faixaPreco)
          setOrdenacao(filters.ordenacao)
        }}
        onClearFilters={limparFiltros}
      />
    </section>
  )
}
