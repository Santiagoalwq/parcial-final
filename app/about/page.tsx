"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Zap, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-indigo-600">Acerca de MoviSimple</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>¿Qué es MoviSimple?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                MoviSimple es una aplicación de simulación de transporte que conecta 6 puntos estratégicos en una red
                optimizada. Utilizamos el algoritmo de Dijkstra para encontrar siempre la ruta más eficiente entre
                cualquier origen y destino, garantizando el menor tiempo de viaje posible.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Tecnología Avanzada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Algoritmo de Dijkstra para rutas óptimas</li>
                  <li>• Grafo de 6 nodos con 9 conexiones</li>
                  <li>• Cálculo en tiempo real</li>
                  <li>• Animación de progreso en vivo</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Características
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Registro y autenticación segura</li>
                  <li>• Interfaz intuitiva y responsive</li>
                  <li>• Cálculo transparente de costos</li>
                  <li>• Historial de rutas</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Red de Conexiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Nuestra red está diseñada para máxima eficiencia con las siguientes conexiones:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Conexiones principales:</strong>
                  </p>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>Nodo 0 ↔ Nodo 1 (5 segundos)</li>
                    <li>Nodo 0 ↔ Nodo 2 (3 segundos)</li>
                    <li>Nodo 1 ↔ Nodo 3 (4 segundos)</li>
                    <li>Nodo 1 ↔ Nodo 4 (6 segundos)</li>
                  </ul>
                </div>
                <div>
                  <p>
                    <strong>Conexiones secundarias:</strong>
                  </p>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>Nodo 2 ↔ Nodo 3 (2 segundos)</li>
                    <li>Nodo 2 ↔ Nodo 5 (7 segundos)</li>
                    <li>Nodo 3 ↔ Nodo 4 (3 segundos)</li>
                    <li>Nodo 3 ↔ Nodo 5 (4 segundos)</li>
                    <li>Nodo 4 ↔ Nodo 5 (2 segundos)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tarifas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Nuestro sistema de tarifas es simple y transparente: <strong>$0.50 por segundo</strong> de viaje. El
                costo total se calcula automáticamente basado en el tiempo óptimo de la ruta seleccionada.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
