interface Edge {
  node: number
  weight: number
}

export class GraphSimple {
  V: number
  adj: Edge[][]

  constructor(V: number) {
    this.V = V
    this.adj = Array.from({ length: V }, () => [])
  }

  addEdge(u: number, v: number, w: number): void {
    this.adj[u].push({ node: v, weight: w })
    this.adj[v].push({ node: u, weight: w })
  }

  dijkstraSimple(source: number): { distances: number[]; predecessors: number[] } {
    const distances: number[] = Array(this.V).fill(Number.MAX_SAFE_INTEGER)
    const predecessors: number[] = Array(this.V).fill(-1)
    const visited: boolean[] = Array(this.V).fill(false)

    distances[source] = 0

    for (let count = 0; count < this.V - 1; count++) {
      const u = this.minDistance(distances, visited)
      visited[u] = true

      for (const { node: v, weight } of this.adj[u]) {
        if (!visited[v] && distances[u] !== Number.MAX_SAFE_INTEGER && distances[u] + weight < distances[v]) {
          distances[v] = distances[u] + weight
          predecessors[v] = u
        }
      }
    }

    return { distances, predecessors }
  }

  private minDistance(distances: number[], visited: boolean[]): number {
    let min = Number.MAX_SAFE_INTEGER
    let minIndex = -1

    for (let v = 0; v < this.V; v++) {
      if (!visited[v] && distances[v] <= min) {
        min = distances[v]
        minIndex = v
      }
    }

    return minIndex
  }
}

"use client"

interface User {
  name: string
  email: string
  password: string
}

export async function registerUser(name: string, email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const usersJson = localStorage.getItem("users") || "[]"
      const users: User[] = JSON.parse(usersJson)

      const existingUser = users.find((user) => user.email === email)
      if (existingUser) {
        reject(new Error("El usuario ya existe"))
        return
      }

      users.push({ name, email, password })
      localStorage.setItem("users", JSON.stringify(users))
      console.log(`User added: ${name}, ${email}, ${password}`)

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export async function loginUser(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const usersJson = localStorage.getItem("users") || "[]"
      const users: User[] = JSON.parse(usersJson)

      const user = users.find((user) => user.email === email && user.password === password)
      if (!user) {
        reject(new Error("Credenciales inválidas"))
        return
      }

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: user.name,
          email: user.email,
        }),
      )

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export async function checkAuth(): Promise<{ name: string; email: string } | null> {
  return new Promise((resolve) => {
    const userJson = localStorage.getItem("currentUser")
    if (!userJson) {
      resolve(null)
      return
    }

    resolve(JSON.parse(userJson))
  })
}

export async function logout(): Promise<void> {
  return new Promise((resolve) => {
    localStorage.removeItem("currentUser")
    resolve()
  })
}
