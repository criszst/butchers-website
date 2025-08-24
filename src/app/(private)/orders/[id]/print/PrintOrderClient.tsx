"use client"

import PrintButton from "@/app/(private)/orders/[id]/print/PrintButton"
import replaceOrderMethod from "@/app/utils/replacePayment"
import { useDeliveryFee } from "@/app/hooks/useDeliveryFee"

interface PrintOrderClientProps {
  order: any
  settings: any
}

export default function PrintOrderClient({ order, settings }: PrintOrderClientProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatWeight = (quantity: number) => {
    if (quantity >= 1) {
      return `${quantity.toFixed(quantity % 1 === 0 ? 0 : 3)}kg`
    } else {
      const grams = Math.round(quantity * 1000)
      return `${grams}g`
    }
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const deliveryCalculation = useDeliveryFee({
    orderTotal: subtotal,
    deliveryMethod: order.deliveryMethod || (order.deliveryAddress === "Retirada no Açougue" ? "PICKUP" : "DELIVERY"),
    storeSettings: settings
      ? {
          deliveryFee: settings.deliveryFee,
          freeDeliveryMinimum: settings.freeDeliveryMinimum,
        }
      : undefined,
  })

  return (
    <div className="min-h-screen bg-white">
      <PrintButton />

      <div className="max-w-4xl mx-auto p-4 print:p-3 print:max-w-none print-container print:text-sm">
        {/* Header - more compact */}
        <div className="border-b border-gray-300 pb-3 mb-4 print:pb-2 print:mb-3">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl print:text-lg font-bold text-gray-900 mb-1">
                {settings?.storeName || "Açougue Premium"}
              </h1>
              <p className="text-sm print:text-xs text-gray-600 mb-0.5">
                {settings?.storeAddress || "Endereço da loja"}
              </p>
              <p className="text-sm print:text-xs text-gray-600 mb-0.5">
                Tel: {settings?.storePhone || "(11) 99999-9999"}
              </p>
              <p className="text-sm print:text-xs text-gray-600">{settings?.storeEmail || "contato@acougue.com"}</p>
            </div>
            <div className="text-right">
              <div className="bg-gray-100 p-2 print:p-1 rounded">
                <p className="text-xs text-gray-600 mb-0.5">Pedido Nº</p>
                <p className="text-lg print:text-base font-bold text-gray-900">{order.orderNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer and Order Info - side by side, more compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-3 mb-4 print:mb-3">
          <div>
            <h3 className="text-base print:text-sm font-semibold text-gray-900 mb-2 print:mb-1">
              Informações do Cliente
            </h3>
            <div className="bg-gray-50 p-2 print:p-1 rounded text-sm print:text-xs">
              <p className="font-medium text-gray-900 mb-0.5">{order.customer.name}</p>
              <p className="text-gray-600 mb-0.5">{order.customer.email}</p>
              <p className="text-gray-600">{order.customer.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-base print:text-sm font-semibold text-gray-900 mb-2 print:mb-1">Detalhes do Pedido</h3>
            <div className="bg-gray-50 p-2 print:p-1 rounded text-sm print:text-xs">
              <p className="text-gray-600 mb-0.5">
                <span className="font-medium">Data:</span> {order.createdAt}
              </p>
              <p className="text-gray-600 mb-0.5">
                <span className="font-medium">Status:</span> {order.status}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Pagamento:</span> {replaceOrderMethod(order.paymentMethod)}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Address - more compact */}
        <div className="mb-4 print:mb-3">
          <h3 className="text-base print:text-sm font-semibold text-gray-900 mb-2 print:mb-1">
            {deliveryCalculation.reason === "Retirada no açougue" ? "Local de Retirada" : "Endereço de Entrega"}
          </h3>
          <div
            className={`p-2 print:p-1 rounded text-sm print:text-xs ${
              deliveryCalculation.reason === "Retirada no açougue"
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <p className="text-gray-900 font-medium">
              {deliveryCalculation.reason === "Retirada no açougue"
                ? `${settings?.storeName || "Açougue Premium"} - ${`${settings?.storeAddress} (Retirada no Açougue)` || "Endereço da loja"}`
                : order.deliveryAddress}
            </p>
          </div>
        </div>

        {/* Items Table - more compact */}
        <div className="mb-4 print:mb-3">
          <h3 className="text-base print:text-sm font-semibold text-gray-900 mb-2 print:mb-1">Itens do Pedido</h3>
          <div className="border border-gray-300 rounded overflow-hidden">
            <table className="w-full text-sm print:text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2 print:p-1 font-semibold text-gray-900">Produto</th>
                  <th className="text-center p-2 print:p-1 font-semibold text-gray-900">Qtd</th>
                  <th className="text-right p-2 print:p-1 font-semibold text-gray-900">Preço Unit.</th>
                  <th className="text-right p-2 print:p-1 font-semibold text-gray-900">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="p-2 print:p-1">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600 capitalize">{item.category}</p>
                      </div>
                    </td>
                    <td className="p-2 print:p-1 text-center font-medium">{formatWeight(item.quantity)}</td>
                    <td className="p-2 print:p-1 text-right font-medium">{formatPrice(item.price)}</td>
                    <td className="p-2 print:p-1 text-right font-bold">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals and Payment - side by side to save space */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-3 mb-4 print:mb-3">
          <div>
            <div className="bg-gray-50 p-3 print:p-2 rounded text-sm print:text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Frete:</span>
                <span className={`font-medium ${deliveryCalculation.isFree ? "text-green-600" : ""}`}>
                  {deliveryCalculation.isFree ? "GRÁTIS" : formatPrice(deliveryCalculation.fee)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {deliveryCalculation.reason}
                {deliveryCalculation.savings && (
                  <span className="text-green-600 ml-1">(Economia: {formatPrice(deliveryCalculation.savings)})</span>
                )}
              </p>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-base print:text-sm font-bold text-gray-900">Total:</span>
                  <span className="text-lg print:text-base font-bold text-green-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-base print:text-sm font-semibold text-gray-900 mb-2 print:mb-1">Forma de Pagamento</h3>
            <div className="bg-blue-50 border border-blue-200 p-3 print:p-2 rounded">
              <p className="text-blue-900 font-medium text-sm print:text-xs">
                {replaceOrderMethod(order.paymentMethod)}
              </p>
            </div>
          </div>
        </div>

        {/* Signatures - more compact */}
        <div className="grid grid-cols-2 gap-4 print:gap-3 pt-4 print:pt-2 border-t border-gray-300">
          <div>
            <h4 className="text-sm print:text-xs font-semibold text-gray-900 mb-2 print:mb-1">Assinatura do Cliente</h4>
            <div className="border-b border-gray-400 h-8 print:h-6 mb-1"></div>
            <p className="text-xs text-gray-600 text-center">{order.customer.name}</p>
          </div>
          <div>
            <h4 className="text-sm print:text-xs font-semibold text-gray-900 mb-2 print:mb-1">
              Assinatura do Entregador
            </h4>
            <div className="border-b border-gray-400 h-8 print:h-6 mb-1"></div>
            <p className="text-xs text-gray-600 text-center">Nome do Entregador</p>
          </div>
        </div>

        {/* Footer - more compact */}
        <div className="mt-4 print:mt-2 pt-2 print:pt-1 border-t border-gray-300 text-center">
          <p className="text-xs text-gray-600">
            Obrigado pela preferência! • {settings?.storeName || "Açougue Premium"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Documento gerado em {new Date().toLocaleString("pt-BR")}</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          .print-container {
            font-size: 11px !important;
            line-height: 1.3 !important;
          }
          
          .print-container h1 {
            font-size: 16px !important;
          }
          
          .print-container h3 {
            font-size: 12px !important;
          }
          
          .print-container table {
            font-size: 10px !important;
          }
          
          .print-container .signature-line {
            height: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}
