"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Upload, Eye, ImageIcon, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CarouselManager() {
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false)

  // Mock data
  const slides = [
    {
      id: 1,
      title: "Promoção de Carnes Premium",
      description: "Até 30% de desconto em carnes selecionadas",
      image: "/placeholder.svg?height=200&width=400",
      link: "/promocoes/carnes-premium",
      status: "Ativo",
      order: 1,
    },
    {
      id: 2,
      title: "Novos Cortes Especiais",
      description: "Conheça nossa nova linha de cortes especiais",
      image: "/placeholder.svg?height=200&width=400",
      link: "/produtos/cortes-especiais",
      status: "Ativo",
      order: 2,
    },
    {
      id: 3,
      title: "Entrega Grátis",
      description: "Frete grátis para pedidos acima de R$ 150",
      image: "/placeholder.svg?height=200&width=400",
      link: "/entrega",
      status: "Inativo",
      order: 3,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800"
      case "Inativo":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Gerenciar Carousel</h2>
          <p className="text-sm lg:text-base text-gray-600">Gerencie os slides do carousel da página inicial</p>
        </div>
        <Dialog open={isAddSlideOpen} onOpenChange={setIsAddSlideOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="lg:hidden">Adicionar</span>
              <span className="hidden lg:inline">Adicionar Slide</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl mx-4">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Slide</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Slide</Label>
                  <Input id="title" placeholder="Ex: Promoção Especial" />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" placeholder="Ex: Até 30% de desconto" />
                </div>
                <div>
                  <Label htmlFor="link">Link de Destino</Label>
                  <Input id="link" placeholder="Ex: /promocoes" />
                </div>
                <div>
                  <Label htmlFor="order">Ordem de Exibição</Label>
                  <Input id="order" type="number" placeholder="1" />
                </div>
                <div>
                  <Label htmlFor="image">Imagem do Slide</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Clique para fazer upload da imagem</p>
                    <p className="text-xs text-gray-500 mt-1">Recomendado: 1200x400px</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-end space-y-2 lg:space-y-0 lg:space-x-2">
              <Button variant="outline" onClick={() => setIsAddSlideOpen(false)} className="w-full lg:w-auto">
                Cancelar
              </Button>
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full lg:w-auto">
                Adicionar Slide
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slides Display */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center text-base lg:text-lg">
            <ImageIcon className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
            Slides do Carousel ({slides.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-100">
              {slides.map((slide) => (
                <div key={slide.id} className="p-4">
                  <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={slide.image || "/placeholder.svg"}
                          alt={slide.title}
                          className="w-20 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 truncate">{slide.title}</h3>
                              <p className="text-sm text-gray-600 truncate">{slide.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={`text-xs ${getStatusColor(slide.status)}`}>{slide.status}</Badge>
                                <span className="text-xs text-gray-500">Ordem: {slide.order}</span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slide</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map((slide) => (
                  <TableRow key={slide.id} className="hover:bg-gray-50">
                    <TableCell>
                      <img
                        src={slide.image || "/placeholder.svg"}
                        alt={slide.title}
                        className="w-16 h-10 rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{slide.title}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-600 max-w-xs truncate">{slide.description}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-blue-600 text-sm">{slide.link}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">{slide.order}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(slide.status)}>{slide.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
