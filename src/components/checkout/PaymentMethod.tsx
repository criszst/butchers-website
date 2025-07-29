"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Banknote, DollarSign, Smartphone, CheckCircle, Info } from "lucide-react"

interface PaymentMethodProps {
  formaPagamento: string
  setFormaPagamento: (value: string) => void
  tipoEntrega: string
  setTipoEntrega: (value: string) => void
  subtotal: number
}

export const PaymentMethod = ({
  formaPagamento,
  setFormaPagamento,
  tipoEntrega,
  setTipoEntrega,
  subtotal,
}: PaymentMethodProps) => {
  const paymentOptions = [
    {
      id: "dinheiro",
      label: "Dinheiro",
      description: "Pagamento em espécie na entrega",
      icon: DollarSign,
      color: "green",
      info: "Tenha o valor exato ou nosso entregador levará troco",
    },
    {
      id: "credito",
      label: "Cartão de Crédito",
      description: "Visa, Mastercard, Elo, American Express",
      icon: CreditCard,
      color: "blue",
      info: "Aceitamos todas as principais bandeiras",
    },
    {
      id: "debito",
      label: "Cartão de Débito",
      description: "Débito direto da conta",
      icon: Banknote,
      color: "purple",
      info: "Pagamento direto na sua conta bancária",
    },
    {
      id: "vr",
      label: "Vale Refeição/Alimentação",
      description: "VR, VA, Sodexo, Ticket",
      icon: Smartphone,
      color: "orange",
      info: "Aceitamos os principais cartões de benefício",
    },
  ]

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      green: {
        border: isSelected
          ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
          : "border-gray-200 hover:border-green-300",
        icon: "bg-green-100 text-green-600",
        badge: "bg-green-100 text-green-800",
        info: "bg-green-50 border-green-200 text-green-800",
      },
      blue: {
        border: isSelected
          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50"
          : "border-gray-200 hover:border-blue-300",
        icon: "bg-blue-100 text-blue-600",
        badge: "bg-blue-100 text-blue-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
      },
      purple: {
        border: isSelected
          ? "border-purple-500 bg-gradient-to-r from-purple-50 to-violet-50"
          : "border-gray-200 hover:border-purple-300",
        icon: "bg-purple-100 text-purple-600",
        badge: "bg-purple-100 text-purple-800",
        info: "bg-purple-50 border-purple-200 text-purple-800",
      },
      orange: {
        border: isSelected
          ? "border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50"
          : "border-gray-200 hover:border-orange-300",
        icon: "bg-orange-100 text-orange-600",
        badge: "bg-orange-100 text-orange-800",
        info: "bg-orange-50 border-orange-200 text-orange-800",
      },
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden animate-in slide-in-from-left duration-500">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl text-gray-800">Forma de Pagamento</span>
          <Badge className="ml-auto bg-orange-100 text-orange-800 border-orange-200">Na Entrega</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 lg:p-6">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Pagamento na Entrega</h4>
              <p className="text-sm text-blue-700">
                Você pagará diretamente ao nosso entregador quando receber seu pedido. Escolha abaixo sua forma de
                pagamento preferida.
              </p>
            </div>
          </div>
        </div>

        <RadioGroup value={tipoEntrega} onValueChange={setTipoEntrega} className="space-y-4">
          {paymentOptions.map((option) => {
            const Icon = option.icon
            const isSelected = tipoEntrega === option.id
            const colorClasses = getColorClasses(option.color, isSelected)

            return (
              <div
                key={option.id}
                className={`relative overflow-hidden rounded-xl border-2 p-4 lg:p-6 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg ${colorClasses.border}`}
              >
                <div className="flex items-center space-x-4">
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className={`border-2 border-${option.color}-500 data-[state=checked]:bg-${option.color}-500`}
                  />

                  <div className={`p-3 rounded-full shadow-sm ${colorClasses.icon}`}>
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={option.id}
                      className="font-bold text-base lg:text-lg text-gray-800 cursor-pointer block"
                    >
                      {option.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>

                  {option.id === "vr" && <Badge className={`${colorClasses.badge} font-semibold`}>Benefício</Badge>}
                </div>

                {isSelected && (
                  <div
                    className={`mt-4 p-3 lg:p-4 rounded-lg border animate-in slide-in-from-top duration-300 ${colorClasses.info}`}
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{option.info}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </RadioGroup>

      </CardContent>
    </Card>
  )
}
