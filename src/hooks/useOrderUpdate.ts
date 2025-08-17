"use client"

import { useState, useEffect } from "react"
import type { Order } from "@/generated/prisma"

export function useOrderUpdates(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!userId) return

    const eventSource = new EventSource(`/api/orders/status?userId=${userId}`)

    eventSource.onopen = () => {
      setIsConnected(true)
      console.log("SSE connection opened")
    }

    eventSource.onmessage = (event) => {
      try {
        if (event.data === "Connected") {
          console.log("SSE connected successfully")
          return
        }

        const data = JSON.parse(event.data)
        if (data.error) {
          console.error("SSE error:", data.error)
          return
        }

        setOrders(data)
      } catch (error) {
        console.error("Error parsing SSE data:", error)
      }
    }

    eventSource.onerror = (error) => {
      console.error("SSE error:", error)
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [userId])

  return { orders, isConnected }
}
