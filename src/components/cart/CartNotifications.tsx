"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useCart } from "./context"
import { CheckCircle, ShoppingCart } from "lucide-react"

export default function CartNotifications() {
  const { lastAddedItem } = useCart()

  useEffect(() => {
    if (lastAddedItem) {
      toast.success(
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium">Produto adicionado!</p>
            <p className="text-sm text-gray-600">{lastAddedItem.name}</p>
          </div>
        </div>,
        {
          duration: 3000,
          icon: <ShoppingCart className="h-4 w-4" />,
        },
      )
    }
  }, [lastAddedItem])

  return null
}
