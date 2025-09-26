"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, AuthContextType } from "@/lib/types"
import api from "@/lib/api"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const authenticatedUser = await api.post(`${process.env.NEXT_PUBLIC_BASE_URL}/token/`, {username, password })

      //const authenticatedUser = await authenticateUser(email, password)
      if (authenticatedUser) {
        setUser(authenticatedUser.data)
        localStorage.setItem("user", JSON.stringify(authenticatedUser.data))
        return true
      }
      return false
    } catch (error) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("favorites")
    localStorage.removeItem("cart")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
