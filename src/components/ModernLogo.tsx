"use client"

import { Beef } from "lucide-react"

export default function ModernLogo({
  className = "",
  size = "md",
}: {
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const sizes = {
    sm: {
      container: "h-8 w-8",
      icon: "h-4 w-4",
      text: "text-sm",
      spacing: "space-x-2",
    },
    md: {
      container: "h-10 w-10",
      icon: "h-5 w-5",
      text: "text-center",
      spacing: "space-x-3",
    },
    lg: {
      container: "h-12 w-12",
      icon: "h-6 w-6",
      text: "text-lg",
      spacing: "space-x-3",
    },
  }

  const currentSize = sizes[size]

  return (
    <div className={`flex items-center ${currentSize.spacing} ${className}`}>
      {/* Logo Icon */}
      <div
        className={`${currentSize.container} bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-red-500/20 flex-shrink-0`}
      >
        <Beef className={`${currentSize.icon} text-white`} />
      </div>

      {/* Logo Text */}
      <div className="flex flex-wrap min-w-0 items-center">
  <span className={`${currentSize.text} font-bold text-red-600 leading-tight whitespace-nowrap`}>
    Casa de Carne 
  </span>
  <span className={`text-sm font-semibold ml-1 text-red-500 ${currentSize.text}`}>Duarte</span>
</div>
    </div>
  )
}
