import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Edificio Corporativo Zenith - Dashboard",
  description: "Panel de control para el proyecto Edificio Corporativo Zenith",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-auto">
            <main className="flex-1">{children}</main>
            <footer className="p-4 border-t bg-gray-50 text-center text-sm text-muted-foreground">
              <Link href="/administracion" className="hover:underline">
                Administración
              </Link>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}
