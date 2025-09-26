"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useShop } from "@/contexts/shop-context"


export default function ProductsPage() {
  const { user, isLoading } = useAuth()
  const {products, getProductsByCategory, getProducts, getProductsByName} = useShop()
  const { favorites } = useFavorites()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(()=> {
    if(selectedCategory) {
      getProductsByCategory(selectedCategory)
    }else {
      getProducts()
    }
  },[selectedCategory])

  // const filteredProducts = useMemo(() => {
  //   return products.filter((product) => {
  //     if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
  //       return false
  //     }

  //     if (selectedCategory && product.categoryId !== selectedCategory) {
  //       return false
  //     }

  //     if (showFavoritesOnly && !favorites.includes(product.id)) {
  //       return false
  //     }

  //     return true
  //   })
  // }, [searchTerm, selectedCategory, showFavoritesOnly, favorites])
  const [debouncedValue, setDebouncedValue] = useState('')

    useEffect(() => {
    // Set a timeout to update debouncedValue after a delay
    const handler = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, 500); // 500ms debounce delay

    // Cleanup function: clear the timeout if inputValue changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(()=> {
    if(debouncedValue){
      getProductsByName(debouncedValue)
    }else{
      getProducts()
    }
  },[debouncedValue])

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              showFavoritesOnly={showFavoritesOnly}
              onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Productos</h2>
              <p className="text-muted-foreground">
                {products.length} producto{products.length !== 1 ? "s" : ""} encontrado
                {products.length !== 1 ? "s" : ""}
              </p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">No se encontraron productos</p>
                <p className="text-sm text-muted-foreground">Intenta ajustar los filtros para ver más resultados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} products={products}/>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
