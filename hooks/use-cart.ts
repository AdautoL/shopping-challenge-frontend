"use client"

import { useState, useEffect } from "react"
import type { CartItem, Product } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.id}`)
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart))
        } catch (error) {
          setCartItems([])
        }
      }
    } else {
      setCartItems([])
    }
  }, [user])

  const saveCart = (items: CartItem[]) => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items))
    }
  }

  const addToCart = (products: Product[], productId: number, quantity = 1) => {
    console.log("product id", productId)
    const product = products.find((p) => p.id === productId)
    if (!product) return
    console.log(product)

    const existingItem = cartItems.find((item) => item.productId === productId)

    let newCartItems: CartItem[]

    if (existingItem) {
      newCartItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
      )
    } else {
      const newItem: CartItem = {
        id: `${productId}_${Date.now()}`,
        productId,
        product,
        quantity,
      }
      newCartItems = [...cartItems, newItem]
    }

    setCartItems(newCartItems)
    saveCart(newCartItems)
  }

  const removeFromCart = (itemId: string) => {
    const newCartItems = cartItems.filter((item) => item.id !== itemId)
    setCartItems(newCartItems)
    saveCart(newCartItems)
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    const newCartItems = cartItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    setCartItems(newCartItems)
    saveCart(newCartItems)
  }

  const clearCart = () => {
    setCartItems([])
    if (user) {
      localStorage.removeItem(`cart_${user.id}`)
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }
}
