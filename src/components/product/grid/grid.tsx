"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Zap, Grid3X3, List, SlidersHorizontal, X, Star } from "lucide-react"
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

export function ProductGrid({ products }: ProductGridProps) {
  const [termoBusca, setTermoBusca] = useState("")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas")
  const [faixaPreco, setFaixaPreco] = useState<[number, number]>([0, 500])
  const [ordenacao, setOrdenacao] = useState("relevancia")
  const [favoritos, setFavoritos] = useState<number[]>([])
  const [loadingProducts, setLoadingProducts] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [filtrosAtivos, setFiltrosAtivos] = useState<string[]>([])

  const [apenasEmEstoque, setApenasEmEstoque] = useState(false)
  const [avaliacaoMinima, setAvaliacaoMinima] = useState(0)
  const [marcasSelecionadas, setMarcasSelecionadas] = useState<string[]>([])
  const [tipoCorte, setTipoCorte] = useState("todos")
  const [origem, setOrigem] = useState("todas")
  const [promocao, setPromocao] = useState(false)

  const { addItem, isLoading } = useCart()

  const productsFiltrados = products.filter((product) => {
    const correspondeNome = product.name.toLowerCase().includes(termoBusca.toLowerCase())
    const correspondeCategoria = categoriaSelecionada === "todas" || product.category === categoriaSelecionada
    const correspondePreco = product.price >= faixaPreco[0] && product.price <= faixaPreco[1]
    const correspondeEstoque = !apenasEmEstoque || product.available

    // Simular avaliação (em um app real viria do banco)
    const avaliacaoSimulada = Math.floor(Math.random() * 5) + 1
    const correspondeAvaliacao = avaliacaoSimulada >= avaliacaoMinima

    // Simular marca baseada no nome do produto
    const marcaSimulada = product.name.includes("Premium")
      ? "Premium"
      : product.name.includes("Especial")
        ? "Especial"
        : "Casa Duarte"
    const correspondeMarca = marcasSelecionadas.length === 0 || marcasSelecionadas.includes(marcaSimulada)

    // Filtro por tipo de corte
    const correspondeCorte =
      tipoCorte === "todos" ||
      (tipoCorte === "bovino" && product.category.toLowerCase().includes("bov")) ||
      (tipoCorte === "suino" && product.category.toLowerCase().includes("suí")) ||
      (tipoCorte === "ave" && product.category.toLowerCase().includes("ave")) ||
      (tipoCorte === "linguica" && product.category.toLowerCase().includes("linguiça"))

    // Filtro por origem (simulado)
    const origemSimulada = Math.random() > 0.5 ? "nacional" : "importado"
    const correspondeOrigem = origem === "todas" || origem === origemSimulada

    // Filtro por promoção (simulado - produtos com preço terminado em 0 ou 5)
    const estaEmPromocao = product.price % 10 === 0 || product.price % 10 === 5
    const correspondePromocao = !promocao || estaEmPromocao

    return (
      correspondeNome &&
      correspondeCategoria &&
      correspondePreco &&
      correspondeEstoque &&
      correspondeAvaliacao &&
      correspondeMarca &&
      correspondeCorte &&
      correspondeOrigem &&
      correspondePromocao
    )
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
      case "avaliacao":
        // Simular ordenação por avaliação
        return Math.random() - 0.5
      case "popularidade":
        // Simular ordenação por popularidade
        return Math.random() - 0.5
      default:
        return 0
    }
  })

  useEffect(() => {
    const filtros: string[] = []
    if (termoBusca) filtros.push(`Busca: ${termoBusca}`)
    if (categoriaSelecionada !== "todas") filtros.push(`Categoria: ${categoriaSelecionada}`)
    if (faixaPreco[0] > 0 || faixaPreco[1] < 500) {
      filtros.push(`Preço: R$ ${faixaPreco[0]} - R$ ${faixaPreco[1]}`)
    }
    if (apenasEmEstoque) filtros.push("Apenas em estoque")
    if (avaliacaoMinima > 0) filtros.push(`Avaliação: ${avaliacaoMinima}+ estrelas`)
    if (marcasSelecionadas.length > 0) filtros.push(`Marcas: ${marcasSelecionadas.join(", ")}`)
    if (tipoCorte !== "todos") filtros.push(`Tipo: ${tipoCorte}`)
    if (origem !== "todas") filtros.push(`Origem: ${origem}`)
    if (promocao) filtros.push("Em promoção")

    setFiltrosAtivos(filtros)
  }, [
    termoBusca,
    categoriaSelecionada,
    faixaPreco,
    apenasEmEstoque,
    avaliacaoMinima,
    marcasSelecionadas,
    tipoCorte,
    origem,
    promocao,
  ])

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
      await addItem(product, Number(product.priceWeightAmount))
    } catch (error) {
      toast.error("Erro ao adicionar produto ao carrinho")
    } finally {
      setLoadingProducts((prev) => prev.filter((id) => id !== product.id))
    }
  }

  const limparFiltros = () => {
    setTermoBusca("")
    setCategoriaSelecionada("todas")
    setFaixaPreco([0, 500])
    setOrdenacao("relevancia")
    setApenasEmEstoque(false)
    setAvaliacaoMinima(0)
    setMarcasSelecionadas([])
    setTipoCorte("todos")
    setOrigem("todas")
    setPromocao(false)
  }

  const removerFiltro = (filtro: string) => {
    if (filtro.startsWith("Busca:")) {
      setTermoBusca("")
    } else if (filtro.startsWith("Categoria:")) {
      setCategoriaSelecionada("todas")
    } else if (filtro.startsWith("Preço:")) {
      setFaixaPreco([0, 500])
    } else if (filtro === "Apenas em estoque") {
      setApenasEmEstoque(false)
    } else if (filtro.startsWith("Avaliação:")) {
      setAvaliacaoMinima(0)
    } else if (filtro.startsWith("Marcas:")) {
      setMarcasSelecionadas([])
    } else if (filtro.startsWith("Tipo:")) {
      setTipoCorte("todos")
    } else if (filtro.startsWith("Origem:")) {
      setOrigem("todas")
    } else if (filtro === "Em promoção") {
      setPromocao(false)
    }
  }

  const categorias = Array.from(new Set(products.map((p) => p.category)))
  const marcas = ["Casa Duarte", "Premium", "Especial"]

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

  const handleFaixaPrecoChange = (value: [number, number]) => {
  setFaixaPreco(value);
};

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

        <motion.div
          className="hidden lg:block mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {/* Primeira linha de filtros */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end mb-6">
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

                {/* Tipo de Corte */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Corte</label>
                  <Select value={tipoCorte} onValueChange={setTipoCorte}>
                    <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-red-500 rounded-lg">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="bovino">Bovino</SelectItem>
                      <SelectItem value="suino">Suíno</SelectItem>
                      <SelectItem value="ave">Aves</SelectItem>
                      <SelectItem value="linguica">Linguiças</SelectItem>
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
                      <SelectItem value="avaliacao">Melhor avaliados</SelectItem>
                      <SelectItem value="popularidade">Mais populares</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Segunda linha de filtros avançados */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-6 border-t border-gray-200">
                {/* Faixa de Preço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Faixa de Preço: R$ {faixaPreco[0]} - R$ {faixaPreco[1]}
                  </label>
                  <Slider
  value={faixaPreco}
  onValueChange={handleFaixaPrecoChange}
  max={500}
  min={0}
  step={10}
  className="w-full"
/>
                </div>

                {/* Avaliação Mínima */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Avaliação Mínima</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setAvaliacaoMinima(star === avaliacaoMinima ? 0 : star)}
                        className={`p-1 rounded transition-colors ${
                          star <= avaliacaoMinima ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div> */}

                {/* Origem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origem</label>
                  <Select value={origem} onValueChange={setOrigem}>
                    <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-red-500 rounded-lg">
                      <SelectValue placeholder="Origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="nacional">Nacional</SelectItem>
                      <SelectItem value="importado">Importado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtros de Checkbox */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Filtros Especiais</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
  id="estoque"
  checked={apenasEmEstoque}
  onCheckedChange={(checked) => setApenasEmEstoque(checked === true)}
/>
                      <label htmlFor="estoque" className="text-sm text-gray-700 cursor-pointer">
                        Apenas em estoque
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                     <Checkbox
  id="promocao"
  checked={promocao}
  onCheckedChange={(checked) => setPromocao(checked === true)}
/>
                      <label htmlFor="promocao" className="text-sm text-gray-700 cursor-pointer">
                        Em promoção
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marcas */}
              <div className="pt-6 border-t border-gray-200 mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Marcas</label>
                <div className="flex flex-wrap gap-2">
                  {marcas.map((marca) => (
                    <button
                      key={marca}
                      onClick={() => {
                        setMarcasSelecionadas((prev) =>
                          prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca],
                        )
                      }}
                      className={`px-3 py-1 rounded-full text-sm border-2 transition-all duration-200 ${
                        marcasSelecionadas.includes(marca)
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-red-300"
                      }`}
                    >
                      {marca}
                    </button>
                  ))}
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
                    isLoading={loadingProducts.includes(product.id) || isLoading}
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
        {window.location.pathname === "/product" ? (
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
        ) : (
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
                  Não se preocupe! Temos outros cortes especiais disponíveis.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = "/product"}
               >
                  Ver página de produtos
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        )
        }
      </div>

      {/* Mobile Filters Modal */}
      <MobileFilters
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        categories={categorias}
        filters={{
          categoria: categoriaSelecionada,
          faixaPreco: `${faixaPreco[0]}-${faixaPreco[1]}`,
          ordenacao,
        }}
        onFiltersChange={(filters) => {
          setCategoriaSelecionada(filters.categoria)
          if (filters.faixaPreco !== "todas") {
            const [min, max] = filters.faixaPreco.split("-").map(Number)
            setFaixaPreco([min, max])
          }
          setOrdenacao(filters.ordenacao)
        }}
        onClearFilters={limparFiltros}
      />
    </section>
  )
}
