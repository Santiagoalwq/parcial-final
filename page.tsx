import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-100">
      <div className="max-w-md w-full px-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">MoviSimple</CardTitle>
            <CardDescription>La odisea de los seis puntos</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/login" className="w-full">
              <Button className="w-full" variant="default">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button className="w-full" variant="outline">
                Registrarse
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
