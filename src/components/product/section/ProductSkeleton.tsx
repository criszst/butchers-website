"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export function ProductsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Skeleton className="h-8 w-32 mx-auto rounded-full" />
        <Skeleton className="h-12 w-80 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </motion.div>

      {/* Filters Skeleton */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Count Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="aspect-square relative">
                <Skeleton className="w-full h-full" />
                <div className="absolute top-3 right-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <div className="absolute top-3 left-3">
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="w-3 h-3" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call to Action Skeleton */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card className="bg-gradient-to-r from-red-600 to-orange-600 border-0 shadow-2xl">
          <CardContent className="p-8 lg:p-12 text-center space-y-4">
            <Skeleton className="h-8 w-80 mx-auto bg-white/20" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
            <Skeleton className="h-12 w-48 mx-auto bg-white/20 rounded-xl" />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
