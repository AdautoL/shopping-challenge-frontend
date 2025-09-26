"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"

type Article = {
  id: number
  name: string
  description: string
  price: string
  category_name: string
  is_favorite: boolean
  [key: string]: any
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])
  const { user } = useAuth()

  // Obtener favoritos desde la API
  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }

    const fetchFavorites = async () => {
      try {
        const res = await api.get<Article[]>("/articles/") // <- ajusta al endpoint real
        const favIds = res.data
          .filter((article) => article.is_favorite)
          .map((article) => article.id)

        setFavorites(favIds)
      } catch (error) {
        console.error("Error fetching favorites", error)
        setFavorites([])
      }
    }

    fetchFavorites()
  }, [user])

  // Toggle favoritos en la API
  const toggleFavorite = useCallback(
    async (productId: number) => {
      if (!user) return

      const isFav = favorites.includes(productId)

      try {
        if (isFav) {
          await api.delete(`/articles/${productId}/favorite/`,)
          setFavorites((prev) => prev.filter((id) => id !== productId))
        } else {
          await api.post(`/articles/${productId}/favorite/`, { id: productId })
          setFavorites((prev) => [...prev, productId])
        }
      } catch (error) {
        console.error("Error toggling favorite", error)
      }
    },
    [user, favorites]
  )

  const isFavorite = (productId: number) => favorites.includes(productId)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  }
}
