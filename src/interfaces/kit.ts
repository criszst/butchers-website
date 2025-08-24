export interface Kit {
  id: number
  name: string
  description: string
  image?: string | null
  category: string
  discount?: number | null
  available: boolean
  createdAt: Date
  updatedAt: Date
  items: KitItem[]
  totalPrice?: number
  discountedPrice?: number
}

export interface KitItem {
  id: number
  kitId: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    image?: string | null
    priceWeightAmount?: number | null
    priceWeightUnit?: string | null
    category: string; // make category optional
  stock: number | undefined; // make stock optional
  available?: boolean | undefined;
  }
}

export default interface KitData {
  name: string
  description: string
  image?: string
  category: string
  discount?: number | null
  items: Array<{
    productId: number
    quantity: number
  }>
}
