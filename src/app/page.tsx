import Header from "@/components/header"
import ShaderHero from "@/components/animations/shader"
import ProductGrid from "@/components/product/grid"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ShaderHero />
      <ProductGrid />
    </div>
  )
}
