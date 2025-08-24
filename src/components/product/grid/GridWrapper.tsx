import { ProductGrid } from "@/components/product/grid/grid"
import { getProductsAction } from "@/app/actions/product"
import { getKitsAction } from "@/app/actions/kit"

interface Props {
  search?: string
  category?: string
}

export default async function ProductGridWrapper({ search = "", category = "all" }: Props) {
 
   const [productsResult, kitsResult] = await Promise.all([
    getProductsAction({ search, category }),
    getKitsAction({ search, category }),
  ])

   const products = productsResult.success ? productsResult.products : []
  const kits = kitsResult.success ? kitsResult.kits : []

  return <ProductGrid products={products} kits={kits} showKits={true} />
}
