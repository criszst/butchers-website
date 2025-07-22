import Header from "@/components/header"
import ShaderHero from "@/components/animations/shader"
import ProductGridWrapper from "@/components/product/GridWrapper"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header key={"header"}/>
      <ShaderHero />
      <ProductGridWrapper />
    </div>
  )
}