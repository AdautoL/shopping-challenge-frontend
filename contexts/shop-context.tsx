"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ShopContextType, CartItem, Product, Category } from "@/lib/types";
import api from "@/lib/api";
import { useAuth } from "./auth-context";

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (error) {
          setCartItems([]);
        }
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    api
      .get("/articles/")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => setProducts([]));
  }, []);

  useEffect(() => {
    api
      .get("/categories/")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => setCategories([]));
  }, []);



  const saveCart = (items: CartItem[]) => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
    }
  };

  const addToCart = (products: Product[], productId: number, quantity = 1) => {
    console.log("product id", productId);
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    console.log(product);

    const existingItem = cartItems.find((item) => item.productId === productId);

    let newCartItems: CartItem[];

    if (existingItem) {
      newCartItems = cartItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: `${productId}_${Date.now()}`,
        productId,
        product,
        quantity,
      };
      newCartItems = [...cartItems, newItem];
    }

    setCartItems(newCartItems);
    saveCart(newCartItems);
  };

  const removeFromCart = (itemId: string) => {
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
    saveCart(newCartItems);
  };

  const getProductsByCategory = (categoryId: number) => {
    api
      .get(`/articles?category=${categoryId}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => setProducts([]));
  };

    const getProductsByName = (searchTerm: string) => {
    api
      .get(`/articles?name=${searchTerm}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => setProducts([]));
  };

    const getProducts = () => {
    api
      .get(`/articles/`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => setProducts([]));
  };

  const getSignleProduct = async (productId: number)=> {
    let product: Product | null = null
    try {
        product = await api.get(`/articles/${productId}`)
    }catch(err){
        console.log('error al cargar el producto')
    }
    return product
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const newCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCartItems(newCartItems);
    saveCart(newCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // addToCart, removeFromCart, getTotalPrice, getTotalItems, updateQuantity add to context after typing remember

  return (
    <ShopContext.Provider
      value={{
        products,
        cartItems,
        categories,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        getProductsByCategory,
        getProducts,
        getSignleProduct,
        getProductsByName
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a Provider");
  }
  return context;
}
