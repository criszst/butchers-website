"use client"

import { useState, useEffect } from "react"
import { Beef, Utensils, Clock } from "lucide-react"

interface LoadingScreenProps {
  isLoading: boolean
  message?: string
}

export default function LoadingScreen({ isLoading, message = "A arte de oferecer qualidade" }: LoadingScreenProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 transform rotate-12">
          <Beef className="h-16 w-16 text-red-600" />
        </div>
        <div className="absolute top-32 right-20 transform -rotate-12">
          <Utensils className="h-12 w-12 text-red-600" />
        </div>
        <div className="absolute bottom-20 left-32 transform rotate-45">
          <Beef className="h-20 w-20 text-red-600" />
        </div>
        <div className="absolute bottom-32 right-16 transform -rotate-45">
          <Utensils className="h-14 w-14 text-red-600" />
        </div>
        <div className="absolute top-1/2 left-20 transform rotate-90">
          <Beef className="h-10 w-10 text-red-600" />
        </div>
        <div className="absolute top-1/4 right-1/4 transform -rotate-12">
          <Clock className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="text-center space-y-8 relative z-10">
        {/* Main Logo Animation */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-red-600/20 rounded-full blur-2xl animate-pulse" />
          </div>

          {/* Rotating Ring */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-28 h-28 border-4 border-red-200 rounded-full animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <div
              className="absolute w-24 h-24 border-4 border-red-300 border-t-transparent rounded-full animate-spin"
              style={{ animationDuration: "2s", animationDirection: "reverse" }}
            />

            {/* Main Beef Icon */}
            <div className="relative bg-white rounded-full p-6 shadow-2xl border-4 border-red-100">
              <Beef className="h-16 w-16 text-red-600 animate-bounce" style={{ animationDuration: "2s" }} />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Casa de Carnes Duarte
          </h1>
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <div className="w-8 h-0.5 bg-red-600 rounded-full" />
            <Utensils className="h-4 w-4" />
            <div className="w-8 h-0.5 bg-red-600 rounded-full" />
          </div>
        </div>

        {/* Loading Message */}
        <div className="space-y-4">
          <p className="text-xl text-gray-700 font-medium">
            {message}
            {dots}
          </p>

          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="h-2 bg-red-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-orange-600 rounded-full animate-pulse"
                style={{
                  width: "100%",
                  animation: "loading-bar 2s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
            <span>Selecionando cortes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
            <span>Verificando qualidade</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-300 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
            <span>Preparando entrega</span>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-red-100 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2 text-red-600 mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Você sabia?</span>
          </div>
          <p className="text-sm text-gray-600">
            Nossas carnes são maturadas por até 28 dias para garantir máxima maciez e sabor!
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
