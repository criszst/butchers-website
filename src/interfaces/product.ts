import { Prisma } from "@/generated/prisma"

interface ProductData extends Prisma.ProductCreateInput {
  name: string
  description: string
  price: number
  category: string
  stock: number
  image?: string | null | undefined
  weightPrice?: number
}

export default ProductData