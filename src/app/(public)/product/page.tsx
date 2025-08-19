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

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-orange-400">Casa de Carne Duarte</h3>
                <p className="text-gray-300 mb-4">
                  Há mais de 35 anos oferecendo os melhores cortes de carne com qualidade premium e atendimento
                  excepcional.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">f</span>
                  </div>
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">@</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-orange-400">Contato</h4>
                <div className="space-y-2 text-gray-300">
                  <p>📍 Rua das Carnes, 123 - Centro</p>
                  <p>📞 (11) 9999-9999</p>
                  <p>✉️ contato@carneduarte.com.br</p>
                  <p>🕒 Seg-Sáb: 7h às 19h</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-orange-400">Categorias</h4>
                <div className="space-y-2 text-gray-300">
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Carnes Bovinas</p>
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Carnes Suínas</p>
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Aves</p>
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Linguiças</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Casa de Carne Duarte. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
      <Toaster position="top-right" />
    </CartProvider>
  )
}
