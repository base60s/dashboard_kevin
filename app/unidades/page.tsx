"use client"

import { useState } from "react"
import PageHeader from "@/components/page-header"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, Filter, Plus, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import useAdminDataStore from "@/lib/adminDataStore"
import { type Unit } from "@/components/admin/unit-management"

export default function UnidadesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)

  const unidades = useAdminDataStore((state) => state.unitData)

  const filteredUnidades = unidades.filter(
    (unidad) =>
      unidad.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unidad.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const vendidas = unidades.filter((u) => u.estado === "Vendida").length
  const disponibles = unidades.filter((u) => u.estado === "Disponible").length
  const reservadas = unidades.filter((u) => u.estado === "Reservada").length
  const total = unidades.length

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <>
      <PageHeader title="Unidades - Edificio Corporativo Zenith">
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar unidades..."
                className="w-[250px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </PageHeader>

      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Unidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unidades Vendidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{vendidas}</div>
              <Progress value={total > 0 ? (vendidas / total) * 100 : 0} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{total > 0 ? Math.round((vendidas / total) * 100) : 0}% del total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unidades Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{disponibles}</div>
              <Progress value={total > 0 ? (disponibles / total) * 100 : 0} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{total > 0 ? Math.round((disponibles / total) * 100) : 0}% del total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unidades Reservadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reservadas}</div>
              <Progress value={total > 0 ? (reservadas / total) * 100 : 0} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{total > 0 ? Math.round((reservadas / total) * 100) : 0}% del total</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tabla">
          <TabsList className="mb-4">
            <TabsTrigger value="tabla">Vista de Tabla</TabsTrigger>
            <TabsTrigger value="tarjetas">Vista de Tarjetas</TabsTrigger>
          </TabsList>

          <TabsContent value="tabla">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Área (m²)</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Planta</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnidades.map((unidad: Unit) => (
                      <TableRow key={unidad.id}>
                        <TableCell className="font-medium">{unidad.numero}</TableCell>
                        <TableCell>{unidad.tipo}</TableCell>
                        <TableCell>{unidad.area} m²</TableCell>
                        <TableCell>{formatCurrency(unidad.precio)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              unidad.estado === "Vendida"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : unidad.estado === "Reservada"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                            }
                          >
                            {unidad.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>{unidad.planta}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedUnit(unidad)}>
                            Ver detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tarjetas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUnidades.map((unidad: Unit) => (
                <Card key={unidad.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <Image
                        src={unidad.imagen || "/placeholder.svg"}
                        alt={`Unidad ${unidad.numero}`}
                        fill
                        className="object-cover"
                      />
                      <Badge
                        variant="outline"
                        className={`absolute top-2 right-2 ${
                          unidad.estado === "Vendida"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : unidad.estado === "Reservada"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {unidad.estado}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">Unidad {unidad.numero}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tipo:</span> {unidad.tipo}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Área:</span> {unidad.area} m²
                        </div>
                        <div>
                          <span className="text-muted-foreground">Planta:</span> {unidad.planta}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Precio:</span> {formatCurrency(unidad.precio)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setSelectedUnit(unidad)}>
                      Ver detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {selectedUnit && (
          <Dialog open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Detalles de la Unidad {selectedUnit.numero}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="relative h-64 mb-4">
                    <Image
                      src={selectedUnit.imagen || "/placeholder.svg"}
                      alt={`Unidad ${selectedUnit.numero}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={
                        selectedUnit.estado === "Vendida"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : selectedUnit.estado === "Reservada"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                      }
                    >
                      {selectedUnit.estado}
                    </Badge>
                    <Badge variant="outline">{selectedUnit.tipo}</Badge>
                    <Badge variant="outline">Planta {selectedUnit.planta}</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Información</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Número:</span>
                      <span className="font-medium">{selectedUnit.numero}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">{selectedUnit.tipo}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Área:</span>
                      <span className="font-medium">{selectedUnit.area} m²</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Precio:</span>
                      <span className="font-medium">{formatCurrency(selectedUnit.precio)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Estado:</span>
                      <span className="font-medium">{selectedUnit.estado}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Planta:</span>
                      <span className="font-medium">{selectedUnit.planta}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    {selectedUnit.estado === "Disponible" && (
                      <>
                        <Button className="flex-1 gap-2">
                          <Check className="h-4 w-4" />
                          Reservar
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2">
                          <X className="h-4 w-4" />
                          Cancelar
                        </Button>
                      </>
                    )}
                    {selectedUnit.estado === "Vendida" && (
                      <Button variant="outline" className="flex-1">
                        Ver Contrato
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </>
  )
}
