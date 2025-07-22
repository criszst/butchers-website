import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image?: string | null
  category: string
  discount?: number | null
  stock: number
  available: boolean
  createdAt: Date
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price

  // Generate random image if no image is provided
  const getRandomImage = () => {
    const meatImages = [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop",
       "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop",
       "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop",
    ]
    return meatImages[Math.floor(Math.random() * meatImages.length)]
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image || getRandomImage()}
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {product.discount && product.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-600 text-white">-{product.discount}%</Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Esgotado</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>

          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>

          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
            ))}
            <span className="text-sm text-gray-600 ml-2">(4.0)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {product.discount && product.discount > 0 ? (
                <>
                  <p className="text-lg font-bold text-green-600">{formatPrice(discountedPrice)}</p>
                  <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</p>
                </>
              ) : (
                <p className="text-lg font-bold text-green-600">{formatPrice(product.price)}</p>
              )}
            </div>

            <Button
              size="sm"
              disabled={product.stock === 0}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Comprar
            </Button>
          </div>

          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-orange-600">Apenas {product.stock} unidades restantes!</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
