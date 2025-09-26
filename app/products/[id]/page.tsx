"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, Star, ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useShop } from "@/contexts/shop-context"

interface ProductDetailPageProps {
  params: {
    id: number
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { user, isLoading } = useAuth()
  const {products} = useShop()

  
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToCart, getSignleProduct } = useShop()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  console.log("products", product)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
      return
    }
    // @ts-ignore
    getSignleProduct(params.id).then(res => setProduct(res.data))
  }, [params.id, user, isLoading, router])

  const handleAddToCart = () => {
    if (product) {
      addToCart(products ,product.id, quantity)
      // Reset quantity after adding
      setQuantity(1)
    }
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
            <Link href="/products">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a productos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a productos
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category_name}
              </Badge>
              <h1 className="text-3xl font-bold mb-4 text-balance">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                {product.averageRating ? (
                  <>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-5 w-5",
                            star <= Math.round(product.averageRating!)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground",
                          )}
                        />
                      ))}
                      <span className="ml-2 text-lg font-medium">{product.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground">({product.totalRatings} reseñas)</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Sin calificar</span>
                )}
              </div>

              <div className="text-4xl font-bold mb-6">${product?.price?.toLocaleString()}</div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Add to Cart Section */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Cantidad:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="flex items-center justify-between text-lg">
                    <span>Total:</span>
                    <span className="font-bold">${(product.price * quantity).toLocaleString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button onClick={handleAddToCart} className="flex-1" size="lg">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Agregar al carrito
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => toggleFavorite(product.id)}
                      className={cn(isFavorite(product.id) && "text-red-500 border-red-500")}
                    >
                      <Heart className={cn("h-5 w-5", isFavorite(product.id) && "fill-current")} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Características</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Categoría:</span>
                    <span className="font-medium">{product.category_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio:</span>
                    <span className="font-medium">${product?.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calificación:</span>
                    <span className="font-medium">
                      {product.averageRating ? `${product.averageRating.toFixed(1)}/5` : "Sin calificar"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reseñas:</span>
                    <span className="font-medium">{product.totalRatings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
