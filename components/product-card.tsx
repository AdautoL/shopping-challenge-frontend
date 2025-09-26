"use client"

import type React from "react"

import type { Product } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { useShop } from "@/contexts/shop-context"

interface ProductCardProps {
  product: Product
  products: Product[]
}

export function ProductCard({ products, product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToCart } = useShop()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(products, product.id)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product.id)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
        <CardContent className="p-4">
          <div className="relative mb-4 rounded-lg bg-muted">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm",
                isFavorite(product.id) && "text-red-500",
              )}
              onClick={handleToggleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite(product.id) && "fill-current")} />
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{product.name}</h3>

            <div className="flex items-center space-x-2">
              {product.averageRating ? (
                <>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{product.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({product.totalRatings} reseñas)</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Sin calificar</span>
              )}
            </div>

            <Badge variant="secondary" className="text-xs">
              {product.category.name}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="text-2xl font-bold">${product.price.toLocaleString()}</div>
          <Button size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
