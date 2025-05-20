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
    // { label: 'KPIs', icon: <BarChartIcon />, href: '/kpis' },
    { icon: ImageIcon, label: "Imágenes de Progreso", href: "/imagenes-de-progreso" },
    { icon: Grid, label: "Unidades", href: "/unidades" },
  ]

  return (
    <div className="w-64 border-r bg-background border-border flex flex-col">
      <div className="py-4 flex-1">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 font-normal text-foreground",
                  pathname === item.href && "bg-accent text-accent-foreground"
                )}
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
