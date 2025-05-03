"use client"

import { Building, Home, BarChart, ImageIcon, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: "Inicio", href: "/" },
    { icon: BarChart, label: "KPIs", href: "/kpis" },
    { icon: ImageIcon, label: "Imágenes de Progreso", href: "/imagenes-de-progreso" },
    { icon: Grid, label: "Unidades", href: "/unidades" },
  ]

  return (
    <div className="w-64 border-r bg-gray-50 flex flex-col">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <Building className="h-5 w-5" />
          <span>Edificio Corporativo Zenith</span>
        </Link>
      </div>

      <div className="py-4 flex-1">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2 font-normal", pathname === item.href && "bg-gray-200")}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
