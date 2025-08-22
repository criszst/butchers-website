"use client"

import type React from "react"

import { useState, useEffect } from "react"
import LoadingScreen from "@/components/loading"

interface PageLoaderProps {
  children: React.ReactNode
  loadingDuration?: number
  message?: string
}

export default function PageLoader({ children, loadingDuration = 2000, message }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, loadingDuration)

    return () => clearTimeout(timer)
  }, [loadingDuration])

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>{children}</div>
    </>
  )
}
