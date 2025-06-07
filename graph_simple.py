import heapq
from typing import List, Tuple, Optional

class GraphSimple:
    """
    Clase GraphSimple para modelar un grafo de 6 nodos con algoritmo Dijkstra simple.
    Implementa el grafo para MoviSimple con 6 vértices y conexiones bidireccionales.
    """
    
    def _init_(self):
        """Inicializa el grafo con 6 nodos (0-5) y define las 9 aristas."""
        self.num_nodes = 6
        self.edges = {}
        
        # Inicializar lista de adyacencia para cada nodo
        for i in range(self.num_nodes):
            self.edges[i] = []
        
        # Definir las 9 aristas bidireccionales con pesos en segundos
        # Cada tripleta [u, v, w] representa una conexión bidireccional
        aristas = [
            [0, 1, 45],  # Nodo 0 a Nodo 1: 45 segundos
            [0, 2, 30],  # Nodo 0 a Nodo 2: 30 segundos
            [0, 3, 60],  # Nodo 0 a Nodo 3: 60 segundos
            [1, 2, 25],  # Nodo 1 a Nodo 2: 25 segundos
            [1, 4, 40],  # Nodo 1 a Nodo 4: 40 segundos
            [2, 3, 35],  # Nodo 2 a Nodo 3: 35 segundos
            [2, 4, 50],  # Nodo 2 a Nodo 4: 50 segundos
            [2, 5, 20],  # Nodo 2 a Nodo 5: 20 segundos
            [3, 5, 55],  # Nodo 3 a Nodo 5: 55 segundos
        ]
        
        # Agregar aristas bidireccionales
        for u, v, peso in aristas:
            self.add_edge(u, v, peso)
    
    def add_edge(self, u: int, v: int, peso: int):
        """
        Agrega una arista bidireccional entre los nodos u y v con el peso dado.
        
        Args:
            u (int): Nodo origen
            v (int): Nodo destino  
            peso (int): Peso de la arista en segundos
        """
        if 0 <= u < self.num_nodes and 0 <= v < self.num_nodes:
            self.edges[u].append((v, peso))
            self.edges[v].append((u, peso))
    
    def dijkstra_simple(self, source: int) -> Tuple[List[int], List[Optional[int]]]:
        """
        Implementa el algoritmo de Dijkstra simple para encontrar las distancias
        mínimas desde el nodo fuente a todos los demás nodos.
        
        Args:
            source (int): Nodo fuente desde donde calcular distancias
            
        Returns:
            Tuple[List[int], List[Optional[int]]]: 
                - Lista de distancias mínimas desde source a cada nodo
                - Lista de predecesores para reconstruir rutas
        """
        if not (0 <= source < self.num_nodes):
            raise ValueError(f"Nodo fuente {source} fuera de rango [0, {self.num_nodes-1}]")
        
        # Inicializar distancias y predecesores
        distancias = [float('inf')] * self.num_nodes
        predecesores = [None] * self.num_nodes
        visitados = [False] * self.num_nodes
        
        # Distancia al nodo fuente es 0
        distancias[source] = 0
        
        # Cola de prioridad: (distancia, nodo)
        heap = [(0, source)]
        
        while heap:
            dist_actual, nodo_actual = heapq.heappop(heap)
            
            # Si ya fue visitado, continuar
            if visitados[nodo_actual]:
                continue
                
            # Marcar como visitado
            visitados[nodo_actual] = True
            
            # Examinar vecinos
            for vecino, peso in self.edges[nodo_actual]:
                if not visitados[vecino]:
                    nueva_distancia = dist_actual + peso
                    
                    # Si encontramos una ruta más corta
                    if nueva_distancia < distancias[vecino]:
                        distancias[vecino] = nueva_distancia
                        predecesores[vecino] = nodo_actual
                        heapq.heappush(heap, (nueva_distancia, vecino))
        
        return distancias, predecesores
    
    def get_shortest_path(self, source: int, destination: int) -> Tuple[List[int], int]:
        """
        Obtiene la ruta más corta entre dos nodos y su distancia total.
        
        Args:
            source (int): Nodo origen
            destination (int): Nodo destino
            
        Returns:
            Tuple[List[int], int]: Ruta como lista de nodos y distancia total
        """
        if source == destination:
            return [source], 0
        
        distancias, predecesores = self.dijkstra_simple(source)
        
        # Si no hay ruta al destino
        if distancias[destination] == float('inf'):
            return [], -1
        
        # Reconstruir la ruta
        ruta = []
        nodo_actual = destination
        
        while nodo_actual is not None:
            ruta.append(nodo_actual)
            nodo_actual = predecesores[nodo_actual]
        
        ruta.reverse()
        
        return ruta, int(distancias[destination])

# Función de prueba
def test_graph():
    """Función para probar la implementación del grafo."""
    print("=== Prueba de GraphSimple ===")
    
    # Crear instancia del grafo
    grafo = GraphSimple()
    
    # Probar Dijkstra desde nodo 0
    print("\n=== Dijkstra desde nodo 0 ===")
    distancias, predecesores = grafo.dijkstra_simple(0)
    
    for i in range(grafo.num_nodes):
        print(f"Distancia a nodo {i}: {distancias[i]} segundos")
    
    # Probar rutas específicas
    print("\n=== Rutas específicas ===")
    test_routes = [(0, 5), (1, 3), (2, 4)]
    
    for origen, destino in test_routes:
        ruta, tiempo = grafo.get_shortest_path(origen, destino)
        print(f"Ruta {origen} → {destino}: {' → '.join(map(str, ruta))} ({tiempo} segundos)")

if _name_ == "_main_":
    test_graph()
