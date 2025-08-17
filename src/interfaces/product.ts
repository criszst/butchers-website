export default interface ProductData {
  name: string
  description: string
  price: number
  priceWeightAmount: number | null
  priceWeightUnit: string | null
  category: string
  stock: number
  image?: string | null
  available?: boolean
  discount?: number | null
}

export interface Product extends ProductData {
  id: number
}