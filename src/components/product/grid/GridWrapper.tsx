// app/components/product/ProductGridWrapper.tsx
import ProductGrid from "@/components/product/grid/grid"
import { getProductsAction } from "@/app/actions/product"

interface Props {
  search?: string
  category?: string
}

export default async function ProductGridWrapper({ search = "", category = "all" }: Props) {
  const { products } = await getProductsAction({
    search,
    category,
  })

  return <ProductGrid products={products} />
}
