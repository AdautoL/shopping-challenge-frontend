"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

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

      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-20 w-20 mx-auto mb-6 text-green-500" />

              <h1 className="text-3xl font-bold mb-4">¡Compra Realizada con Éxito!</h1>

              <p className="text-lg text-muted-foreground mb-8">
                Gracias por tu compra. Tu pedido ha sido procesado correctamente y recibirás un email de confirmación en
                breve.
              </p>

              <div className="bg-muted rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Detalles del Pedido</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Número de pedido:</span>
                    <span className="font-mono">#TS-{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha:</span>
                    <span>{new Date().toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <span className="text-green-600 font-medium">Confirmado</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button variant="outline" size="lg">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Continuar Comprando
                  </Button>
                </Link>

                <Button size="lg">
                  Ver Mis Pedidos
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Nota:</strong> Esta es una aplicación de demostración. No se ha procesado ningún pago real.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
