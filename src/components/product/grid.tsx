"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, ShoppingCart, Heart, Eye, Zap, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/components/cart/context"

export default function ProductGrid() {
  const [termoBusca, setTermoBusca] = useState("")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas")
  const [favoritos, setFavoritos] = useState<number[]>([])
  const { addItem } = useCart()

  const produtos = [
    {
      id: 1,
      name: "Picanha Premium",
      price: 52.9,
      category: "bovina",
      rating: 4.9,
      sale: true,
      desconto: 15,
      popular: true,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop",
      description: "Corte nobre, macio e suculento",
      badge: "Mais Vendido",
    },
    {
      id: 2,
      name: "Alcatra",
      price: 38.9,
      category: "bovina",
      rating: 4.7,
      sale: false,
      popular: false,
      image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop",
      description: "Ideal para assados e grelhados",
      badge: "Qualidade Premium",
    },
    {
      id: 3,
      name: "Costela Suína",
      price: 24.9,
      category: "suina",
      rating: 4.8,
      sale: true,
      desconto: 20,
      popular: false,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop",
      description: "Temperada com ervas especiais",
      badge: "Oferta Especial",
    },
    {
      id: 4,
      name: "Peito de Frango",
      price: 16.9,
      category: "aves",
      rating: 4.5,
      sale: false,
      popular: true,
      image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop",
      description: "Sem osso, ideal para dietas",
      badge: "Saudável",
    },
    {
      id: 5,
      name: "Cordeiro Premium",
      price: 68.9,
      category: "cordeiro",
      rating: 4.9,
      sale: false,
      popular: false,
      image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop",
      description: "Importado, sabor único",
      badge: "Exclusivo",
    },
    {
      id: 6,
      name: "Carne Moída Premium",
      price: 22.9,
      category: "bovina",
      rating: 4.6,
      sale: true,
      desconto: 10,
      popular: true,
      image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop",
      description: "Moída na hora, 100% bovina",
      badge: "Fresco",
    },
    {
      id: 7,
      name: "Linguiça Artesanal",
      price: 28.9,
      category: "embutidos",
      rating: 4.8,
      sale: false,
      popular: false,
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=400&fit=crop",
      description: "Receita tradicional da casa",
      badge: "Artesanal",
    },
    {
      id: 8,
      name: "Maminha",
      price: 44.9,
      category: "bovina",
      rating: 4.7,
      sale: true,
      desconto: 12,
      popular: true,
      image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop",
      description: "Macia e saborosa",
      badge: "Recomendado",
    },
  ]

  const produtosFiltrados = produtos.filter((produto) => {
    const correspondeNome = produto.name.toLowerCase().includes(termoBusca.toLowerCase())
    const correspondeCategoria = categoriaSelecionada === "todas" || produto.category === categoriaSelecionada
    return correspondeNome && correspondeCategoria
  })

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Mais Vendido":
        return "bg-red-600 text-white"
      case "Oferta Especial":
        return "bg-green-600 text-white"
      case "Exclusivo":
        return "bg-purple-600 text-white"
      case "Artesanal":
        return "bg-amber-600 text-white"
      default:
        return "bg-blue-600 text-white"
    }
  }

  const handleAddToCart = (produto: any) => {
    addItem(produto)

    // Feedback visual no botão
    const button = document.activeElement as HTMLButtonElement
    if (button) {
      const originalText = button.textContent
      button.textContent = "✓ Adicionado!"
      button.style.backgroundColor = "#16a34a"
      button.disabled = true

      setTimeout(() => {
        button.textContent = originalText
        button.style.backgroundColor = ""
        button.disabled = false
      }, 1500)
    }
  }

  return (
    <section id="produtos" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            <span>Produtos Premium</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Cortes Selecionados
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed">
            Carnes de qualidade premium, selecionadas especialmente para você. Frescor garantido e sabor incomparável.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-red-500 transition-colors"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
          <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
            <SelectTrigger className="w-full sm:w-48 h-12 text-base border-2 border-gray-200 focus:border-red-500">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Categorias</SelectItem>
              <SelectItem value="bovina">Carne Bovina</SelectItem>
              <SelectItem value="suina">Carne Suína</SelectItem>
              <SelectItem value="aves">Aves</SelectItem>
              <SelectItem value="cordeiro">Cordeiro</SelectItem>
              <SelectItem value="embutidos">Embutidos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {produtosFiltrados.map((produto) => (
            <Card
              key={produto.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white relative"
            >
              {/* Popular Badge */}
              {produto.popular && (
                <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-red-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Popular</span>
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorito(produto.id)}
                className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    favoritos.includes(produto.id) ? "text-red-500 fill-current" : "text-gray-400"
                  }`}
                />
              </button>

              <CardHeader className="p-0 relative overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={produto.image || "/placeholder.svg"}
                    alt={produto.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm hover:bg-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>

                  {/* Sale Badge */}
                  {produto.sale && (
                    <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{produto.desconto}%
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                {/* Category Badge */}
                <Badge className={`${getBadgeColor(produto.badge)} mb-3 text-xs font-medium`}>{produto.badge}</Badge>

                <h3 className="font-bold text-lg sm:text-xl mb-2 group-hover:text-red-600 transition-colors">
                  {produto.name}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{produto.description}</p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(produto.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 font-medium">({produto.rating})</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-red-600">R$ {produto.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">/kg</span>
                  </div>
                  {produto.sale && (
                    <span className="text-sm line-through text-gray-400">
                      R$ {(produto.price * (1 + produto.desconto! / 100)).toFixed(2)}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 sm:p-6 pt-0">
                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  onClick={() => handleAddToCart(produto)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </CardFooter>

              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* No Results */}
        {produtosFiltrados.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16 lg:mt-20">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Não encontrou o que procura?</h3>
            <p className="text-lg sm:text-xl mb-6 opacity-90">
              Entre em contato conosco! Temos outros cortes especiais disponíveis.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-4"
            >
              Falar com Especialista
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
