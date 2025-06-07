"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LogOut, MapPin, DollarSign, Clock, Loader2 } from "lucide-react"
import { GraphInfo } from "@/components/graph-info"
import { RouteHistory } from "@/components/route-history"

// NOTA: En producción, importar desde el módulo de algoritmo
// import { GraphSimple } from "movisimp-algoritmo/lib/graph-simple"

// Implementación temporal para la demo
class GraphSimple {
  public edges: Array<{ from: number; to: number; weight: number }> = []
  private adjacencyList: Map<number, Array<{ node: number; weight: number }>> = new Map()

  constructor() {
    this.initializeGraph()
  }

  private initializeGraph() {
    const edgeDefinitions = [
      [0, 1, 5],
      [0, 2, 3],
      [1, 3, 4],
      [1, 4, 6],
      [2, 3, 2],
      [2, 5, 7],
      [3, 4, 3],
      [3, 5, 4],
      [4, 5, 2],
    ]

    for (let i = 0; i < 6; i++) {
      this.adjacencyList.set(i, [])
    }

    edgeDefinitions.forEach(([u, v, w]) => {
      this.addEdge(u, v, w)
    })
  }

  private addEdge(from: number, to: number, weight: number) {
    this.adjacencyList.get(from)?.push({ node: to, weight })
    this.adjacencyList.get(to)?.push({ node: from, weight })
    this.edges.push({ from, to, weight })
  }

  public getEdgeWeight(from: number, to: number): number {
    const neighbors = this.adjacencyList.get(from) || []
    const edge = neighbors.find((neighbor) => neighbor.node === to)
    return edge ? edge.weight : Number.POSITIVE_INFINITY
  }

  public dijkstraSimple(source: number): { distances: number[]; predecessors: (number | null)[] } {
    const distances: number[] = new Array(6).fill(Number.POSITIVE_INFINITY)
    const predecessors: (number | null)[] = new Array(6).fill(null)
    const visited: boolean[] = new Array(6).fill(false)

    distances[source] = 0

    for (let i = 0; i < 6; i++) {
      let minDistance = Number.POSITIVE_INFINITY
      let currentNode = -1

      for (let j = 0; j < 6; j++) {
        if (!visited[j] && distances[j] < minDistance) {
          minDistance = distances[j]
          currentNode = j
        }
      }

      if (currentNode === -1) break

      visited[currentNode] = true

      const neighbors = this.adjacencyList.get(currentNode) || []
      neighbors.forEach((neighbor) => {
        if (!visited[neighbor.node]) {
          const newDistance = distances[currentNode] + neighbor.weight
          if (newDistance < distances[neighbor.node]) {
            distances[neighbor.node] = newDistance
            predecessors[neighbor.node] = currentNode
          }
        }
      })
    }

    return { distances, predecessors }
  }

  public reconstructPath(predecessors: (number | null)[], source: number, destination: number): number[] {
    const path: number[] = []
    let current: number | null = destination

    while (current !== null) {
      path.unshift(current)
      current = predecessors[current]
    }

    if (path[0] !== source) {
      return []
    }

    return path
  }
}

interface User {
  id: number
  name: string
  email: string
}

export default function MapPage() {
  const [user, setUser] = useState<User | null>(null)
  const [graph] = useState(() => new GraphSimple())
  const [selectedOrigin, setSelectedOrigin] = useState<number | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [route, setRoute] = useState<number[]>([])
  const [totalTime, setTotalTime] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [error, setError] = useState("")
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  const TARIFF_PER_SECOND = 0.5

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(JSON.parse(currentUser))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleNodeClick = (nodeId: number) => {
    if (isAnimating) return

    if (selectedOrigin === null) {
      setSelectedOrigin(nodeId)
    } else if (selectedDestination === null && nodeId !== selectedOrigin) {
      setSelectedDestination(nodeId)
    } else {
      setSelectedOrigin(nodeId)
      setSelectedDestination(null)
      setRoute([])
      setTotalTime(0)
      setTotalCost(0)
      setProgress(0)
      setCurrentStep(0)
    }
  }

  const calculateRoute = () => {
    if (selectedOrigin === null || selectedDestination === null) {
      setError("Por favor selecciona origen y destino")
      return
    }

    if (selectedOrigin === selectedDestination) {
      setError("El origen y destino deben ser diferentes")
      return
    }

    setError("")
    setIsCalculating(true)
    setShowResults(false)

    setTimeout(() => {
      const result = graph.dijkstraSimple(selectedOrigin)
      const path = graph.reconstructPath(result.predecessors, selectedOrigin, selectedDestination)

      if (path.length === 0) {
        setError("No se encontró una ruta entre los nodos seleccionados")
        setIsCalculating(false)
        return
      }

      const time = result.distances[selectedDestination]

      setRoute(path)
      setTotalTime(time)
      setTotalCost(time * TARIFF_PER_SECOND)
      setIsCalculating(false)
      setShowResults(true)

      setTimeout(() => {
        startAnimation(path)
      }, 1000)
    }, 1000)
  }

  const startAnimation = (path: number[]) => {
    setIsAnimating(true)
    if ((window as any).addRouteToHistory) {
      ;(window as any).addRouteToHistory({
        origin: selectedOrigin!,
        destination: selectedDestination!,
        route: path,
        time: totalTime,
        cost: totalCost,
      })
    }
    setProgress(0)
    setCurrentStep(0)

    let currentProgress = 0
    let stepIndex = 0

    const animate = () => {
      if (stepIndex >= path.length - 1) {
        setProgress(100)
        setTimeout(() => {
          resetInterface()
        }, 2000)
        return
      }

      const currentNode = path[stepIndex]
      const nextNode = path[stepIndex + 1]
      const edgeWeight = graph.getEdgeWeight(currentNode, nextNode)

      const stepDuration = edgeWeight * 100
      const progressIncrement = 100 / (path.length - 1)

      setTimeout(() => {
        currentProgress += progressIncrement
        setProgress(currentProgress)
        setCurrentStep(stepIndex + 1)
        stepIndex++
        animate()
      }, stepDuration)
    }

    animate()
  }

  const resetInterface = () => {
    setSelectedOrigin(null)
    setSelectedDestination(null)
    setRoute([])
    setTotalTime(0)
    setTotalCost(0)
    setProgress(0)
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const getNodeColor = (nodeId: number) => {
    if (isAnimating && route.length > 0) {
      if (nodeId === route[currentStep]) {
        return "bg-green-500 border-green-600"
      } else if (route.includes(nodeId) && route.indexOf(nodeId) < currentStep) {
        return "bg-blue-500 border-blue-600"
      } else if (route.includes(nodeId)) {
        return "bg-yellow-400 border-yellow-500"
      }
    }

    if (selectedOrigin === nodeId) {
      return "bg-green-500 border-green-600"
    } else if (selectedDestination === nodeId) {
      return "bg-red-500 border-red-600"
    }
    return "bg-gray-200 border-gray-300 hover:bg-gray-300"
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">MoviSimple</h1>
              <p className="text-gray-600">Bienvenido, {user.name}</p>
            </div>
            <Button variant="ghost" onClick={() => router.push("/about")}>
              Acerca de
            </Button>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Mapa de MoviSimple
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  {[0, 1, 2, 3, 4, 5].map((nodeId) => {
                    const positions = [
                      { top: "20%", left: "20%" },
                      { top: "20%", left: "80%" },
                      { top: "50%", left: "10%" },
                      { top: "50%", left: "50%" },
                      { top: "50%", left: "90%" },
                      { top: "80%", left: "50%" },
                    ]

                    return (
                      <button
                        key={nodeId}
                        onClick={() => handleNodeClick(nodeId)}
                        disabled={isAnimating}
                        className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-white transition-all duration-300 transform hover:scale-110 ${getNodeColor(nodeId)}`}
                        style={{
                          top: positions[nodeId].top,
                          left: positions[nodeId].left,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {nodeId}
                      </button>
                    )
                  })}

                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {graph.edges.map((edge, index) => {
                      const positions = [
                        { x: 20, y: 20 },
                        { x: 80, y: 20 },
                        { x: 10, y: 50 },
                        { x: 50, y: 50 },
                        { x: 90, y: 50 },
                        { x: 50, y: 80 },
                      ]

                      const fromPos = positions[edge.from]
                      const toPos = positions[edge.to]

                      const isInRoute =
                        route.length > 0 &&
                        route.includes(edge.from) &&
                        route.includes(edge.to) &&
                        Math.abs(route.indexOf(edge.from) - route.indexOf(edge.to)) === 1

                      return (
                        <line
                          key={index}
                          x1={`${fromPos.x}%`}
                          y1={`${fromPos.y}%`}
                          x2={`${toPos.x}%`}
                          y2={`${toPos.y}%`}
                          stroke={isInRoute ? "#3b82f6" : "#d1d5db"}
                          strokeWidth={isInRoute ? "3" : "2"}
                          className="transition-all duration-300"
                        />
                      )
                    })}
                  </svg>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    • Haz clic en un nodo para seleccionar el{" "}
                    <span className="font-semibold text-green-600">origen</span>
                  </p>
                  <p>
                    • Haz clic en otro nodo para seleccionar el{" "}
                    <span className="font-semibold text-red-600">destino</span>
                  </p>
                  <p>• Haz clic en "Calcular Ruta" para encontrar el camino más corto</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Selección de Ruta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Origen:</p>
                  <p className="text-lg">{selectedOrigin !== null ? `Nodo ${selectedOrigin}` : "No seleccionado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Destino:</p>
                  <p className="text-lg">
                    {selectedDestination !== null ? `Nodo ${selectedDestination}` : "No seleccionado"}
                  </p>
                </div>

                <Button
                  onClick={calculateRoute}
                  disabled={selectedOrigin === null || selectedDestination === null || isCalculating || isAnimating}
                  className="w-full"
                >
                  {isCalculating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Calculando ruta...
                    </div>
                  ) : (
                    "Calcular Ruta"
                  )}
                </Button>

                {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

                {isAnimating && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Progreso del viaje:</p>
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-gray-600">
                      {currentStep > 0 && route.length > 0
                        ? `En nodo ${route[currentStep]} de ${route.length - 1} paradas`
                        : "Iniciando viaje..."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {showResults && totalTime > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Información del Viaje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Tiempo total: {totalTime} segundos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Costo: ${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-600">Tarifa: ${TARIFF_PER_SECOND}/segundo</div>
                  {route.length > 0 && <div className="text-xs text-gray-600">Ruta: {route.join(" → ")}</div>}
                </CardContent>
              </Card>
            )}
            <GraphInfo graph={graph} />
            <RouteHistory />
          </div>
        </div>
      </div>
    </div>
  )
}
