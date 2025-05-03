import type React from "react"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PageHeaderProps {
  title: string
  address?: string
  status?: string
  children?: React.ReactNode
}

export default function PageHeader({ title, address, status = "En Progreso", children }: PageHeaderProps) {
  // Format today's date in Spanish format
  const today = new Date()
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <header className="border-b p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {address && (
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{address}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            {status}
          </Badge>
          <div className="text-sm text-muted-foreground">Fecha hoy: {formattedDate}</div>
        </div>
      </div>
      {children}
    </header>
  )
}
