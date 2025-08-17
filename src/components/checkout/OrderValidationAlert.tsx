"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, ShoppingCart, X, AlertCircle, DollarSign } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { OrderErrorType } from "@/app/actions/order/orders"

interface OrderValidationAlertProps {
  isVisible: boolean
  errorType: OrderErrorType
  message: string
  errorDetails?: any
  onRetry?: () => void
  onUpdateCart?: () => void
  onClose: () => void
}

export function OrderValidationAlert({
  isVisible,
  errorType,
  message,
  errorDetails,
  onRetry,
  onUpdateCart,
  onClose,
}: OrderValidationAlertProps) {
  const getAlertConfig = (type: OrderErrorType) => {
    switch (type) {
      case "product_validation_error":
        return {
          variant: "destructive" as const,
          icon: AlertTriangle,
          title: "Produtos Indisponíveis",
          showUpdateCart: true,
          showRetry: false,
        }
      case "price_change_error":
        return {
          variant: "warning" as const,
          icon: DollarSign,
          title: "Preços Atualizados",
          showUpdateCart: true,
          showRetry: false,
        }
      case "insufficient_stock":
        return {
          variant: "warning" as const,
          icon: AlertCircle,
          title: "Estoque Insuficiente",
          showUpdateCart: true,
          showRetry: false,
        }
      case "duplicate_order":
        return {
          variant: "warning" as const,
          icon: RefreshCw,
          title: "Pedido em Processamento",
          showUpdateCart: false,
          showRetry: true,
        }
      case "server_error":
        return {
          variant: "destructive" as const,
          icon: AlertTriangle,
          title: "Erro do Sistema",
          showUpdateCart: false,
          showRetry: true,
        }
      default:
        return {
          variant: "destructive" as const,
          icon: AlertTriangle,
          title: "Erro",
          showUpdateCart: false,
          showRetry: true,
        }
    }
  }

  const config = getAlertConfig(errorType)
  const Icon = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <Alert variant={config.variant} className="shadow-lg border-2">
            <Icon className="h-4 w-4" />
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <AlertTitle className="flex items-center gap-2">{config.title}</AlertTitle>
                <AlertDescription className="mt-2">
                  {message}

                  {/* Detalhes específicos para mudanças de preço */}
                  {errorType === "price_change_error" && errorDetails?.priceChanges && (
                    <div className="mt-3 space-y-2">
                      <p className="font-medium text-sm">Produtos com preços atualizados:</p>
                      {errorDetails.priceChanges.map((change: any, index: number) => (
                        <div key={index} className="text-xs bg-white/50 p-2 rounded border">
                          <p className="font-medium">{change.product}</p>
                          <p>
                            <span className="line-through text-red-600">R$ {change.oldPrice.toFixed(2)}</span>
                            {" → "}
                            <span className="text-green-600 font-medium">R$ {change.newPrice.toFixed(2)}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Detalhes específicos para erros de validação */}
                  {errorType === "product_validation_error" && errorDetails?.validationErrors && (
                    <div className="mt-3">
                      <p className="font-medium text-sm mb-2">Problemas encontrados:</p>
                      <ul className="text-xs space-y-1">
                        {errorDetails.validationErrors.map((error: string, index: number) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </div>

              <Button variant="ghost" size="sm" onClick={onClose} className="ml-2 h-6 w-6 p-0 hover:bg-white/20">
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2 mt-4">
              {config.showUpdateCart && onUpdateCart && (
                <Button
                  onClick={onUpdateCart}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1 text-xs bg-transparent"
                >
                  <ShoppingCart className="h-3 w-3" />
                  Atualizar Carrinho
                </Button>
              )}

              {config.showRetry && onRetry && (
                <Button onClick={onRetry} size="sm" className="flex items-center gap-1 text-xs">
                  <RefreshCw className="h-3 w-3" />
                  Tentar Novamente
                </Button>
              )}
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
