"use client"

import { Beef } from "lucide-react"

export default function ProductLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Beef className="h-8 w-8 text-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
