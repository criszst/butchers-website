import Header from "@/components/header"
import ShaderHero from "@/components/animations/shader"
import ProductGrid from "@/components/product/grid"
import { CartProvider } from "@/components/cart/context"

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <ShaderHero />
        <ProductGrid />
      </div>
    </CartProvider>
  )
}
