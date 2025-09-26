"use client"

import type { CartItem as CartItemType } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import { useShop } from "@/contexts/shop-context"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useShop()

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta
    if (newQuantity <= 0) {
      removeFromCart(item.id)
    } else {
      updateQuantity(item.id, newQuantity)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={item.product.image || "/placeholder.svg"}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">{item.product.category.name}</p>
            <p className="text-lg font-bold mt-1">${item.product.price.toLocaleString()}</p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} className="h-8 w-8">
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Total Price */}
          <div className="text-right">
            <p className="text-lg font-bold">${(item.product.price * item.quantity).toLocaleString()}</p>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFromCart(item.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
