import { AxiosResponse } from "axios"

export interface User {
  id: string
  email: string
  name: string
  token: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  categoryId: number
  category: Category
  category_name?: string
  averageRating: number | null
  totalRatings: number
}

export interface Rating {
  id: string
  userId: string
  productId: string
  rating: number
  comment?: string
}

export interface Favorite {
  id: string
  userId: string
  productId: string
}

export interface CartItem {
  id: string
  productId: number
  product: Product
  quantity: number
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

export interface ShopContextType {
  cartItems: CartItem[],
  products: Product[],
  categories: Category[],
  isLoading: boolean,
  addToCart: (products: Product[], productId: number, quantity?: number)=> void,
  updateQuantity: (itemId: string, quantity: number) => void,
  removeFromCart: (itemId: string) => void,
  getProductsByCategory: (categoryId: number) => void
  getProductsByName: (searchTerm: string) => void
  getProducts: ()=> void,
  getSignleProduct: (productId: number) => Promise<Product | null>
}