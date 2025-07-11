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
    sm: { container: "h-8", icon: "h-5 w-5", text: "text-sm " },
    md: { container: "h-10", icon: "h-6 w-6", text: "text-xl" },
    lg: { container: "h-12", icon: "h-7 w-7", text: "text-2xl" },
  }

  const currentSize = sizes[size]

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div
        className={`${currentSize.container} aspect-square bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-red-500/20`}
      >
        <Beef className={`${currentSize.icon} text-white`} />
      </div>

      {/* Logo Text */}
      <div className="flex ">
        <span className={`${currentSize.text} font-bold text-red-600 leading-tight`}>Casa de Carne Duarte</span>
        
      </div>
    </div>
  )
}
