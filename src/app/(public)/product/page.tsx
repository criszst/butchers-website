import { Suspense } from "react"
import ProductGridWrapper from "@/components/product/grid/GridWrapper"
import { CartProvider } from "@/components/cart/context"
import { Toaster } from "sonner"
import Header from "@/components/header"
import { Link } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function ProdutosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-red-50">
        <Header key="header" />
        

        {/* Navigation breadcrumb */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Button className="hover:text-red-600 transition-colors"  >

                Início
              </Button>
              <span>›</span>
              <span className="text-red-600 font-medium">Produtos</span>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main>
          <Suspense
            fallback={
              <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando produtos...</p>
                  </div>
                </div>
              </div>
            }
          >
            <ProductGridWrapper search={params.search} category={params.category} />
          </Suspense>
        </main>
      </div>
      <Toaster position="top-right" />
    </CartProvider>
  )
}
