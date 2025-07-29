import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const PaymentSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Progress Bar Skeleton */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="container py-4 lg:py-6">
          <div className="flex items-center justify-center space-x-4 lg:space-x-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="w-8 h-8 lg:w-10 lg:h-10 rounded-full" />
                <Skeleton className="w-16 lg:w-20 h-4" />
                {i < 3 && <Skeleton className="w-8 lg:w-16 h-1 rounded-full" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-4 lg:py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-6 lg:mb-8">
          <Skeleton className="w-64 lg:w-80 h-8 lg:h-12 mx-auto mb-2" />
          <Skeleton className="w-48 lg:w-64 h-4 lg:h-6 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Payment Form Skeleton */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="w-48 h-6" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Options Skeleton */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-2 border-gray-100 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="w-32 h-5" />
                        <Skeleton className="w-48 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Skeleton */}
          <div>
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="w-32 h-6" />
                  <Skeleton className="w-16 h-6 rounded-full ml-auto" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Products Skeleton */}
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                      <Skeleton className="w-15 h-15 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-16 h-3" />
                      </div>
                      <Skeleton className="w-16 h-5" />
                    </div>
                  ))}
                </div>

                {/* Calculations Skeleton */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                      <Skeleton className="w-20 h-4" />
                      <Skeleton className="w-16 h-5" />
                    </div>
                  ))}
                </div>

                {/* Total Skeleton */}
                <div className="flex justify-between items-center p-4 rounded-xl bg-green-50">
                  <Skeleton className="w-12 h-6" />
                  <Skeleton className="w-20 h-8" />
                </div>

                {/* Buttons Skeleton */}
                <div className="space-y-3">
                  <Skeleton className="w-full h-12 rounded-xl" />
                  <Skeleton className="w-full h-10 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
