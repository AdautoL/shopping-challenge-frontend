"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, X, Heart } from "lucide-react"
import { useShop } from "@/contexts/shop-context"

interface ProductFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: number | null
  onCategoryChange: (categoryId: number | null) => void
  showFavoritesOnly: boolean
  onToggleFavorites: () => void
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showFavoritesOnly,
  onToggleFavorites,
}: ProductFiltersProps) {

  const {categories} = useShop()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar productos</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => onSearchChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Favorites Filter */}
        <div className="space-y-2">
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={onToggleFavorites}
            className="w-full justify-start"
          >
            <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
            Solo favoritos
          </Button>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label>Categorías</Label>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => onCategoryChange(null)}
              className="w-full justify-start"
            >
              Todas las categorías
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => onCategoryChange(category.id)}
                className="w-full justify-start"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory || showFavoritesOnly) && (
          <div className="space-y-2">
            <Label>Filtros activos</Label>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Búsqueda: {searchTerm}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange("")} />
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onCategoryChange(null)} />
                </Badge>
              )}
              {showFavoritesOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Solo favoritos
                  <X className="h-3 w-3 cursor-pointer" onClick={onToggleFavorites} />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
