import type { Category, Product, User } from "./types"

export const categories: Category[] = [
  { id: "1", name: "Electrónicos", slug: "electronics" },
  { id: "2", name: "Ropa", slug: "clothing" },
  { id: "3", name: "Hogar", slug: "home" },
  { id: "4", name: "Deportes", slug: "sports" },
  { id: "5", name: "Libros", slug: "books" },
]

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    description:
      "El último iPhone con chip A17 Pro y cámara de 48MP. Diseño premium en titanio con pantalla Super Retina XDR.",
    price: 999,
    image: "/iphone-15-pro.png",
    categoryId: "1",
    category: categories[0],
    averageRating: 4.8,
    totalRatings: 156,
  },
  {
    id: "2",
    name: "MacBook Air M3",
    description: "Laptop ultradelgada con chip M3, pantalla Liquid Retina de 13 pulgadas y hasta 18 horas de batería.",
    price: 1299,
    image: "/macbook-air-laptop.jpg",
    categoryId: "1",
    category: categories[0],
    averageRating: 4.9,
    totalRatings: 89,
  },
  {
    id: "3",
    name: "Camiseta Premium",
    description: "Camiseta de algodón 100% orgánico, corte moderno y colores vibrantes. Perfecta para uso diario.",
    price: 29,
    image: "/premium-cotton-t-shirt.png",
    categoryId: "2",
    category: categories[1],
    averageRating: 4.2,
    totalRatings: 234,
  },
  {
    id: "4",
    name: "Jeans Clásicos",
    description: "Jeans de mezclilla premium con corte clásico. Cómodos y duraderos para cualquier ocasión.",
    price: 79,
    image: "/classic-blue-jeans.png",
    categoryId: "2",
    category: categories[1],
    averageRating: 4.5,
    totalRatings: 167,
  },
  {
    id: "5",
    name: "Sofá Moderno",
    description: "Sofá de 3 plazas con diseño contemporáneo, tapizado en tela de alta calidad y estructura de madera.",
    price: 899,
    image: "/modern-3-seat-sofa.jpg",
    categoryId: "3",
    category: categories[2],
    averageRating: null,
    totalRatings: 0,
  },
  {
    id: "6",
    name: "Mesa de Centro",
    description: "Mesa de centro minimalista de madera maciza con acabado natural. Perfecta para salas modernas.",
    price: 299,
    image: "/wooden-coffee-table.png",
    categoryId: "3",
    category: categories[2],
    averageRating: 4.7,
    totalRatings: 45,
  },
  {
    id: "7",
    name: "Zapatillas Running",
    description: "Zapatillas deportivas con tecnología de amortiguación avanzada. Ideales para correr y entrenar.",
    price: 129,
    image: "/running-sneakers.png",
    categoryId: "4",
    category: categories[3],
    averageRating: 4.6,
    totalRatings: 312,
  },
  {
    id: "8",
    name: "Mancuernas Ajustables",
    description: "Set de mancuernas ajustables de 5-50 lbs. Perfectas para entrenamientos en casa.",
    price: 199,
    image: "/adjustable-dumbbells.jpg",
    categoryId: "4",
    category: categories[3],
    averageRating: 4.4,
    totalRatings: 78,
  },
]

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@tienda.com",
    name: "Administrador",
    token: "mock-token-admin",
  },
  {
    id: "2",
    email: "usuario@ejemplo.com",
    name: "Usuario Demo",
    token: "mock-token-user",
  },
]

// Mock authentication function
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simple mock authentication
  if (email === "admin@tienda.com" && password === "admin123") {
    return mockUsers[0]
  }
  if (email === "usuario@ejemplo.com" && password === "usuario123") {
    return mockUsers[1]
  }

  return null
}
