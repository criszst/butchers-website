"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Truck, CheckCircle, Trash2, ChevronDown, ChevronUp, Gift, Percent } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Notification {
  id: string
  type: "delivery" | "confirmed" | "discount" | "code" | "delivered" | "promotion"
  title: string
  message: string
  details?: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "delivery",
      title: "Pedido saiu para entrega",
      message: "Seu pedido #ORD-2024-001 saiu para entrega e chegará em breve!",
      details:
        "Pedido: 2kg Picanha + 1kg Linguiça Previsão de entrega: 14:30 Entregador: João Santos Telefone: (11) 99999-8888",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      read: false,
      actionUrl: "/perfil#pedidos",
    },
    {
      id: "2",
      type: "confirmed",
      title: "Pedido confirmado",
      message: "Seu pedido #ORD-2024-002 foi confirmado e está sendo preparado.",
      details:
        "Tempo estimado para preparar: 45 minutos Itens: Costela bovina 1,5kg, Coração de frango 500g Total: R$ 67,50",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1h ago
      read: false,
      actionUrl: "/perfil#pedidos",
    },
    {
      id: "3",
      type: "discount",
      title: "🔥 20% OFF em todos os cortes premium!",
      message: "Aproveite nossa oferta especial! Válido até domingo.",
      details:
        "Produtos em promoção: • Picanha - De R$ 89,90 por R$ 71,92 • Filé Mignon - De R$ 119,90 por R$ 95,92 • Alcatra - De R$ 45,90 por R$ 36,72 Desconto aplicado automaticamente no carrinho!",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
      read: true,
    },
    {
      id: "4",
      type: "code",
      title: "Código promocional disponível",
      message: "Use o código CHURRASCO15 e ganhe 15% de desconto!",
      details:
        "Código: CHURRASCO15 Desconto: 15% em compras acima de R$ 100 Válido até: 31/01/2024 Uso: Válido apenas uma vez por cliente",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8h ago
      read: true,
    },
    {
      id: "5",
      type: "delivered",
      title: "Pedido entregue com sucesso",
      message: "Seu pedido #ORD-2024-000 foi entregue. Obrigado pela preferência!",
      details:
        "Entregue em: 09/01/2024 às 16:45 Recebido por: Cliente Avaliação: Que tal avaliar seu pedido? Sua opinião é muito importante!",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      actionUrl: "/perfil#pedidos",
    },
    {
      id: "6",
      type: "promotion",
      title: "Kit Família em promoção",
      message: "Kit especial para churrasco em família com preço imperdível!",
      details:
        "Kit Família inclui: • 2kg Picanha • 1kg Costela • 1kg Linguiça artesanal • 500g Coração De R$ 189,90 por apenas R$ 149,90! Economize R$ 40,00!",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
    },
  ])

  const [filter, setFilter] = useState<"all" | "unread" | "delivery" | "confirmed" | "discount" | "code" | "delivered">(
    "all",
  )
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set())

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return <Truck className="h-5 w-5 text-white" />
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-white" />
      case "discount":
      case "promotion":
        return <Percent className="h-5 w-5 text-white" />
      case "code":
        return <Gift className="h-5 w-5 text-white" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-white" />
      default:
        return <Bell className="h-5 w-5 text-white" />
    }
  }

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "delivery":
        return "bg-orange-500"
      case "confirmed":
        return "bg-blue-500"
      case "discount":
      case "promotion":
        return "bg-orange-500"
      case "code":
        return "bg-orange-500"
      case "delivered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes} min atrás`
    } else if (hours < 24) {
      return `${hours}h atrás`
    } else if (days < 7) {
      return `${days}d atrás`
    } else {
      return timestamp.toLocaleDateString("pt-BR")
    }
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const toggleExpanded = (id: string) => {
    setExpandedNotifications((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filteredNotifications = notifications.filter((notif) => {
    switch (filter) {
      case "unread":
        return !notif.read
      case "delivery":
        return notif.type === "delivery"
      case "confirmed":
        return notif.type === "confirmed"
      case "discount":
        return notif.type === "discount" || notif.type === "promotion"
      case "code":
        return notif.type === "code"
      case "delivered":
        return notif.type === "delivered"
      default:
        return true
    }
  })

  const unreadCount = notifications.filter((n) => !n.read).length
  const totalCount = notifications.length

  const filterTabs = [
    { id: "all", label: "Todas", count: totalCount },
    { id: "unread", label: "Não lidas", count: unreadCount, showBadge: true },
    { id: "delivery", label: "Entregas", count: notifications.filter((n) => n.type === "delivery").length },
    { id: "confirmed", label: "Confirmados", count: notifications.filter((n) => n.type === "confirmed").length },
    {
      id: "discount",
      label: "Descontos",
      count: notifications.filter((n) => n.type === "discount" || n.type === "promotion").length,
    },
    { id: "code", label: "Códigos", count: notifications.filter((n) => n.type === "code").length },
    { id: "delivered", label: "Entregues", count: notifications.filter((n) => n.type === "delivered").length },
  ]

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-white border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Notificações</h3>
                <p className="text-gray-600">
                  {unreadCount} não lidas de {totalCount}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-gray-600 hover:text-gray-800"
                disabled={unreadCount === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar todas como lidas
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-gray-600 hover:text-gray-800"
                disabled={totalCount === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar todas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={filter === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(tab.id as any)}
                className={`relative ${
                  filter === tab.id
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                }`}
              >
                {tab.label}
                {tab.showBadge && tab.count > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs px-1 py-0 h-5 min-w-[20px]">{tab.count}</Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {filter === "unread" ? "Nenhuma notificação não lida" : "Nenhuma notificação"}
                  </h3>
                  <p className="text-gray-600">
                    {filter === "unread"
                      ? "Todas as suas notificações foram lidas!"
                      : "Você não tem notificações no momento."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${
                    !notification.read ? "ring-2 ring-orange-200" : ""
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationBgColor(notification.type)}`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                              {!notification.read && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                            </div>
                            <p className="text-gray-700 mb-2">{notification.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                              <div className="flex items-center space-x-2">
                                {notification.details && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleExpanded(notification.id)}
                                    className="text-orange-600 hover:text-orange-700 p-0 h-auto font-medium"
                                  >
                                    Ver detalhes
                                    {expandedNotifications.has(notification.id) ? (
                                      <ChevronUp className="h-4 w-4 ml-1" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 ml-1" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expandedNotifications.has(notification.id) && notification.details && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-gray-100"
                          >
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-700 whitespace-pre-line">{notification.details}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
