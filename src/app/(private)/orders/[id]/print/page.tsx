import { notFound } from "next/navigation"
import { getAllOrders } from "@/app/actions/order/orders"
import { getStoreSettings } from "@/app/actions/store-settings"
import PrintButton from "@/app/(private)/orders/[id]/print/PrintButton"

interface PrintOrderPageProps {
  params: {
    id: string
  }
}

export default async function PrintOrderPage({ params }: PrintOrderPageProps) {
  const [ordersResult, settingsResult] = await Promise.all([getAllOrders(), getStoreSettings()])

  if (!ordersResult.success) {
    notFound()
  }

  const order = ordersResult.orders.find((o) => o.id === params.id || o.orderNumber === params.id)

  if (!order) {
    notFound()
  }

  const settings = settingsResult.success ? settingsResult.settings : null

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
  
  const isDeliveryFree = settings && settings?.deliveryFee > order.total ? true : false
  return (
    <div className="min-h-screen bg-white">
      <PrintButton />

      <div className="max-w-4xl mx-auto p-8 print:p-6 print:max-w-none print-container">
        <div className="border-b-2 border-gray-300 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{settings?.storeName || "Açougue Premium"}</h1>
              <p className="text-gray-600 mb-1">{settings?.storeAddress || "Endereço da loja"}</p>
              <p className="text-gray-600 mb-1">Tel: {settings?.storePhone || "(11) 99999-9999"}</p>
              <p className="text-gray-600">{settings?.storeEmail || "contato@acougue.com"}</p>
            </div>
            <div className="text-right">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Pedido Nº</p>
                <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações do Cliente</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900 mb-1">{order.customer.name}</p>
              <p className="text-gray-600 mb-1">{order.customer.email}</p>
              <p className="text-gray-600">{order.customer.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalhes do Pedido</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Data:</span> {new Date(order.createdAt).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Status:</span> {order.status}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Pagamento:</span> {order.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Endereço de Entrega</h3>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-gray-900 font-medium">{order.deliveryAddress}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Itens do Pedido</h3>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">Produto</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Quantidade</th>
                  <th className="text-right p-4 font-semibold text-gray-900">Preço Unit.</th>
                  <th className="text-right p-4 font-semibold text-gray-900">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                      </div>
                    </td>
                    <td className="p-4 text-center font-medium">{formatWeight(item.quantity)}</td>
                    <td className="p-4 text-right font-medium">{formatPrice(item.price)}</td>
                    <td className="p-4 text-right font-bold">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal dos Produtos:</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">              
              <span className="text-gray-600">Taxa de Frete:</span>
              <span className="font-medium">{isDeliveryFree ? "GRÁTIS" : formatPrice(settings!.deliveryFee)}</span>
                
            </div>
            <div className="border-t border-gray-300 pt-4">
              {isDeliveryFree ? null : (
                <span className="text-gray-600">Taxa de entrega é grátis para pedidos acima de R$ {settings!.freeDeliveryMinimum}</span>
              )}
            </div>
            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Forma de Pagamento</h3>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-blue-900 font-medium text-lg">{order.paymentMethod}</p>
            <p className="text-blue-700 text-sm">Pagamento na entrega</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-gray-300">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Assinatura do Cliente</h4>
            <div className="border-b-2 border-gray-400 h-16 mb-2"></div>
            <p className="text-sm text-gray-600 text-center">{order.customer.name}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Assinatura do Entregador</h4>
            <div className="border-b-2 border-gray-400 h-16 mb-2"></div>
            <p className="text-sm text-gray-600 text-center">Nome do Entregador</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            Obrigado pela preferência! • {settings?.storeName || "Açougue Premium"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Documento gerado em {new Date().toLocaleString("pt-BR")}</p>
        </div>
      </div>
    </div>
  )
}
