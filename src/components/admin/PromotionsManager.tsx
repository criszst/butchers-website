"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Search, Filter, Target, Calendar, Percent, MoreVertical, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function PromotionsManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isAddPromotionOpen, setIsAddPromotionOpen] = useState(false)

  // Mock data
  const promotions = [
    {
      id: 1,
      name: "Black Friday 2024",
      description: "Descontos especiais para Black Friday",
      discount: 30,
      type: "percentage",
      startDate: "2024-11-25",
      endDate: "2024-11-29",
      status: "Ativo",
      usageCount: 145,
      maxUsage: 1000,
    },
    {
      id: 2,
      name: "Primeira Compra",
      description: "Desconto para novos clientes",
      discount: 15,
      type: "percentage",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "Ativo",
      usageCount: 89,
      maxUsage: null,
    },
    {
      id: 3,
      name: "Frete Grátis",
      description: "Frete grátis acima de R$ 150",
      discount: 0,
      type: "free_shipping",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "Ativo",
      usageCount: 234,
      maxUsage: null,
    },
    {
      id: 4,
      name: "Natal 2023",
      description: "Promoção de Natal",
      discount: 25,
      type: "percentage",
      startDate: "2023-12-20",
      endDate: "2023-12-25",
      status: "Expirado",
      usageCount: 67,
      maxUsage: 200,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800"
      case "Inativo":
        return "bg-yellow-100 text-yellow-800"
      case "Expirado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "percentage":
        return "Percentual"
      case "fixed":
        return "Valor Fixo"
      case "free_shipping":
        return "Frete Grátis"
      default:
        return type
    }
  }

  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || promotion.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Mobile Promotion Card Component
  const PromotionCard = ({ promotion }: { promotion: any }) => (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white">
            <Target className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">{promotion.name}</h3>
                <p className="text-sm text-gray-600 truncate">{promotion.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={`text-xs ${getStatusColor(promotion.status)}`}>{promotion.status}</Badge>
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(promotion.type)}
                  </Badge>
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
            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
              <div>
                <p className="text-gray-500">Desconto</p>
                <p className="font-semibold text-orange-600">
                  {promotion.type === "free_shipping" ? "Frete Grátis" : `${promotion.discount}%`}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Usos</p>
                <p className="font-semibold text-gray-900">
                  {promotion.usageCount}
                  {promotion.maxUsage ? `/${promotion.maxUsage}` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Gerenciar Promoções</h2>
          <p className="text-sm lg:text-base text-gray-600">Crie e gerencie promoções e descontos</p>
        </div>
        <Dialog open={isAddPromotionOpen} onOpenChange={setIsAddPromotionOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="lg:hidden">Adicionar</span>
              <span className="hidden lg:inline">Nova Promoção</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl mx-4">
            <DialogHeader>
              <DialogTitle>Criar Nova Promoção</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Promoção</Label>
                  <Input id="name" placeholder="Ex: Black Friday 2024" />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Desconto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual</SelectItem>
                      <SelectItem value="fixed">Valor Fixo</SelectItem>
                      <SelectItem value="free_shipping">Frete Grátis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount">Valor do Desconto</Label>
                  <Input id="discount" type="number" placeholder="Ex: 30" />
                </div>
                <div>
                  <Label htmlFor="maxUsage">Limite de Uso (opcional)</Label>
                  <Input id="maxUsage" type="number" placeholder="Ex: 1000" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" placeholder="Descrição da promoção..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Data de Fim</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="minValue">Valor Mínimo (opcional)</Label>
                  <Input id="minValue" type="number" placeholder="Ex: 100.00" />
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-end space-y-2 lg:space-y-0 lg:space-x-2">
              <Button variant="outline" onClick={() => setIsAddPromotionOpen(false)} className="w-full lg:w-auto">
                Cancelar
              </Button>
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full lg:w-auto">
                Criar Promoção
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar promoções..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Promotions Display */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center text-base lg:text-lg">
            <Target className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-orange-600" />
            Promoções ({filteredPromotions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-100">
              {filteredPromotions.map((promotion) => (
                <div key={promotion.id} className="p-4">
                  <PromotionCard promotion={promotion} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Promoção</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{promotion.name}</p>
                        <p className="text-sm text-gray-600">{promotion.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(promotion.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Percent className="h-4 w-4 mr-1 text-orange-600" />
                        <span className="font-semibold text-orange-600">
                          {promotion.type === "free_shipping" ? "Frete Grátis" : `${promotion.discount}%`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>
                          {new Date(promotion.startDate).toLocaleDateString("pt-BR")} -{" "}
                          {new Date(promotion.endDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">
                        {promotion.usageCount}
                        {promotion.maxUsage ? `/${promotion.maxUsage}` : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(promotion.status)}>{promotion.status}</Badge>
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
