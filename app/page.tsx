"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setIsAuthenticated(true)
      router.push("/map")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-indigo-600">MoviSimple</CardTitle>
          <CardDescription className="text-lg">La odisea de los seis puntos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Bienvenido al sistema de transporte más simple del mundo. Conectamos 6 puntos estratégicos para llevarte a
            tu destino.
          </p>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => router.push("/login")}>
              Iniciar Sesión
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/register")}>
              Registrarse
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
