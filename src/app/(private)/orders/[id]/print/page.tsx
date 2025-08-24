import { notFound } from "next/navigation"
import { getAllOrders } from "@/app/actions/order/orders"
import { getStoreSettings } from "@/app/actions/store-settings"
import PrintOrderClient from "./PrintOrderClient"

interface PrintOrderPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PrintOrderPage({ params }: PrintOrderPageProps) {
  const [ordersResult, settingsResult] = await Promise.all([getAllOrders(), getStoreSettings()])

  if (!ordersResult.success) {
    notFound()
  }

  const { id } = await params
  const order = ordersResult.orders.find((o) => o.id === id || o.orderNumber === id)

  if (!order) {
    notFound()
  }

  const settings = settingsResult.success ? settingsResult.settings : null

  return <PrintOrderClient order={order} settings={settings} />
}
