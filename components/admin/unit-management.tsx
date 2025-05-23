"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash, Plus, Save, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import useAdminDataStore from '@/lib/adminDataStore'
import { supabase } from '@/lib/supabase'

export interface Unit {
  id: string
  numero: string
  tipo: string
  area: number
  precio: number
  estado: "Disponible" | "Vendida" | "Reservada"
  planta: number
  dormitorios?: number
  baños?: number
  descripcion?: string
  caracteristicas?: string[]
  fechaVenta?: string
  cliente?: string
}

function isValidUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}

export default function UnitManagement() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isUnitEditDialogOpen, setIsUnitEditDialogOpen] = useState(false)
  const [unitToEdit, setUnitToEdit] = useState<Unit | null>(null)

  const setUnitData = useAdminDataStore((state) => state.setUnitData)

  const [unidades, setUnidades] = useState<Unit[]>([
    {
      id: "1",
      numero: "A-101",
      tipo: "Oficina",
      area: 120,
      precio: 450000,
      estado: "Vendida",
      planta: 1,
      descripcion: "Oficina amplia con vistas a la ciudad",
      caracteristicas: ["Aire acondicionado", "Fibra óptica", "Suelo técnico"],
      fechaVenta: "15/01/2025",
      cliente: "Empresa ABC S.L.",
    },
    {
      id: "2",
      numero: "A-102",
      tipo: "Oficina",
      area: 150,
      precio: 560000,
      estado: "Vendida",
      planta: 1,
      descripcion: "Oficina de esquina con doble orientación",
      caracteristicas: ["Aire acondicionado", "Fibra óptica", "Suelo técnico", "Sala de reuniones"],
      fechaVenta: "28/02/2025",
      cliente: "Consultora XYZ",
    },
    {
      id: "3",
      numero: "B-201",
      tipo: "Oficina",
      area: 200,
      precio: 750000,
      estado: "Vendida",
      planta: 2,
      descripcion: "Oficina premium con terraza privada",
      caracteristicas: ["Aire acondicionado", "Fibra óptica", "Suelo técnico", "Terraza", "Domótica"],
      fechaVenta: "10/03/2025",
      cliente: "Inversiones DEF S.A.",
    },
    {
      id: "4",
      numero: "B-202",
      tipo: "Oficina",
      area: 180,
      precio: 680000,
      estado: "Vendida",
      planta: 2,
      descripcion: "Oficina con distribución diáfana",
      caracteristicas: ["Aire acondicionado", "Fibra óptica", "Suelo técnico", "Espacio diáfano"],
      fechaVenta: "05/04/2025",
      cliente: "Tecnología GHI S.L.",
    },
    {
      id: "5",
      numero: "C-301",
      tipo: "Oficina",
      area: 250,
      precio: 950000,
      estado: "Disponible",
      planta: 3,
      descripcion: "Oficina de lujo con vistas panorámicas",
      caracteristicas: [
        "Aire acondicionado",
        "Fibra óptica",
        "Suelo técnico",
        "Vistas panorámicas",
        "Domótica avanzada",
      ],
    },
    {
      id: "6",
      numero: "C-302",
      tipo: "Oficina",
      area: 220,
      precio: 830000,
      estado: "Disponible",
      planta: 3,
      descripcion: "Oficina premium con acabados de alta calidad",
      caracteristicas: ["Aire acondicionado", "Fibra óptica", "Suelo técnico", "Acabados premium"],
    },
  ])

  const [newUnit, setNewUnit] = useState<Omit<Unit, "id">>({
    numero: "",
    tipo: "Oficina",
    area: 0,
    precio: 0,
    estado: "Disponible",
    planta: 1,
    descripcion: "",
    caracteristicas: [],
  })

  const fetchAndSyncUnits = async () => {
    const { data, error } = await supabase.from('unidades').select('*');
    if (!error) {
      setUnidades(data || []);
      setUnitData(data || []);
    }
  };

  const handleAddUnit = async () => {
    setIsLoading(true);
    // Basic validation
    if (!newUnit.numero || !newUnit.tipo || !newUnit.area || !newUnit.precio || !newUnit.estado || !newUnit.planta) {
      toast({ title: "Campos requeridos faltantes", description: "Por favor, completa todos los campos obligatorios.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    const { data, error } = await supabase.from('unidades').insert([{ ...newUnit }]).select();
    console.log('Supabase insert result:', { data, error });
    if (!error) {
      await fetchAndSyncUnits();
      setNewUnit({
        numero: "",
        tipo: "Oficina",
        area: 0,
        precio: 0,
        estado: "Disponible",
        planta: 1,
        descripcion: "",
        caracteristicas: [],
      });
      setIsAddDialogOpen(false);
      toast({ title: "Unidad añadida", description: "La nueva unidad ha sido añadida correctamente." });
    } else {
      toast({ title: "Error al añadir unidad", description: error.message, variant: "destructive" });
      alert('Error al añadir unidad: ' + error.message); // For extra visibility
    }
    setIsLoading(false);
  };

  const openUnitEditDialog = (unit: Unit) => {
    setUnitToEdit({ ...unit })
    setIsUnitEditDialogOpen(true)
  }

  const handleUnitEditFormChange = (field: keyof Unit, value: any) => {
    if (!unitToEdit) return
    setUnitToEdit(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleUnitEditNumberChange = (field: keyof Unit, value: string) => {
    if (!unitToEdit) return
    const numValue = Number.parseFloat(value)
    const finalValue = (field === 'area' || field === 'precio')
      ? (isNaN(numValue) ? 0 : numValue)
      : (isNaN(Number.parseInt(value)) ? 0 : Number.parseInt(value))
    setUnitToEdit(prev => prev ? { ...prev, [field]: finalValue } : null)
  }

  const handleUnitEditFeatureChange = (feature: string, checked: boolean) => {
    if (!unitToEdit) return
    const currentFeatures = unitToEdit.caracteristicas || []
    const newFeatures = checked
      ? [...currentFeatures, feature]
      : currentFeatures.filter((f) => f !== feature)
    setUnitToEdit(prev => prev ? { ...prev, caracteristicas: newFeatures } : null)
  }

  const handleUnitEditDateChange = (field: 'fechaVenta', value: string) => {
    if (!unitToEdit) return
    setUnitToEdit(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleUpdateUnit = async () => {
    if (!unitToEdit) return;
    setIsLoading(true);
    const { id, ...updateData } = unitToEdit;
    console.log('Updating unit:', { id, updateData });
    const { data, error } = await supabase.from('unidades').update(updateData).eq('id', id);
    console.log('Supabase update result:', { data, error });
    if (!error) {
      await fetchAndSyncUnits();
      setIsUnitEditDialogOpen(false);
      setUnitToEdit(null);
      toast({ title: "Unidad actualizada", description: "La unidad ha sido actualizada correctamente." });
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      alert('Error al actualizar unidad: ' + error.message);
    }
    setIsLoading(false);
  };

  const handleDeleteUnit = async (id: string) => {
    setIsLoading(true);
    const { error } = await supabase.from('unidades').delete().eq('id', id);
    if (!error) {
      await fetchAndSyncUnits();
      toast({ title: "Unidad eliminada", description: "La unidad ha sido eliminada correctamente." });
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleSaveAllChanges = () => {
    setIsLoading(true)
    setUnitData(unidades)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Cambios guardados",
        description: "Todos los cambios han sido guardados correctamente.",
      })
    }, 1000)
  }

  const formatCurrency = (value: number) => {
    // Default to U$ (USD), but you can switch to AR$ (ARS) if needed
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD", // Change to 'ARS' for Argentine pesos
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("US$", "U$") // For U$ display
      .replace("ARS", "AR$"); // For AR$ display
  }

  const handleFeatureChange = (features: string[], feature: string, checked: boolean) => {
    if (checked) {
      return [...features, feature]
    } else {
      return features.filter((f) => f !== feature)
    }
  }

  // On mount, fetch units from Supabase
  useEffect(() => {
    fetchAndSyncUnits();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Unidades</h2>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Añadir Unidad
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Añadir Nueva Unidad</DialogTitle>
                <DialogDescription>Completa los campos para crear una nueva unidad.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit-number">Número de Unidad</Label>
                    <Input
                      id="unit-number"
                      value={newUnit.numero}
                      onChange={(e) => setNewUnit({ ...newUnit, numero: e.target.value })}
                      placeholder="Ej: A-101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit-type">Tipo</Label>
                    <Select value={newUnit.tipo} onValueChange={(value) => setNewUnit({ ...newUnit, tipo: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oficina">Oficina</SelectItem>
                        <SelectItem value="Local">Local Comercial</SelectItem>
                        <SelectItem value="Departamento">Departamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit-area">Área (m²)</Label>
                      <Input
                        id="unit-area"
                        type="number"
                        value={newUnit.area.toString()}
                        onChange={(e) => setNewUnit({ ...newUnit, area: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit-floor">Planta</Label>
                      <Input
                        id="unit-floor"
                        type="number"
                        value={newUnit.planta.toString()}
                        onChange={(e) => setNewUnit({ ...newUnit, planta: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit-price">Precio (U$)</Label>
                    <Input
                      id="unit-price"
                      type="number"
                      value={newUnit.precio.toString()}
                      onChange={(e) => setNewUnit({ ...newUnit, precio: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit-status">Estado</Label>
                    <Select
                      value={newUnit.estado}
                      onValueChange={(value: "Disponible" | "Vendida" | "Reservada") =>
                        setNewUnit({ ...newUnit, estado: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Disponible">Disponible</SelectItem>
                        <SelectItem value="Reservada">Reservada</SelectItem>
                        <SelectItem value="Vendida">Vendida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit-description">Descripción</Label>
                    <Textarea
                      id="unit-description"
                      value={newUnit.descripcion || ""}
                      onChange={(e) => setNewUnit({ ...newUnit, descripcion: e.target.value })}
                      placeholder="Descripción detallada de la unidad"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Características</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="feature-ac"
                          onCheckedChange={(checked) =>
                            setNewUnit({
                              ...newUnit,
                              caracteristicas: handleFeatureChange(
                                newUnit.caracteristicas || [],
                                "Aire acondicionado",
                                checked,
                              ),
                            })
                          }
                        />
                        <Label htmlFor="feature-ac">Aire acondicionado</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="feature-fiber"
                          onCheckedChange={(checked) =>
                            setNewUnit({
                              ...newUnit,
                              caracteristicas: handleFeatureChange(
                                newUnit.caracteristicas || [],
                                "Fibra óptica",
                                checked,
                              ),
                            })
                          }
                        />
                        <Label htmlFor="feature-fiber">Fibra óptica</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="feature-floor"
                          onCheckedChange={(checked) =>
                            setNewUnit({
                              ...newUnit,
                              caracteristicas: handleFeatureChange(
                                newUnit.caracteristicas || [],
                                "Suelo técnico",
                                checked,
                              ),
                            })
                          }
                        />
                        <Label htmlFor="feature-floor">Suelo técnico</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="feature-domotics"
                          onCheckedChange={(checked) =>
                            setNewUnit({
                              ...newUnit,
                              caracteristicas: handleFeatureChange(newUnit.caracteristicas || [], "Domótica", checked),
                            })
                          }
                        />
                        <Label htmlFor="feature-domotics">Domótica</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddUnit} disabled={isLoading || !newUnit.numero || !newUnit.tipo || !newUnit.area || !newUnit.precio || !newUnit.estado || !newUnit.planta}>
                  {isLoading ? 'Guardando...' : 'Añadir Unidad'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSaveAllChanges} disabled={isLoading} className="gap-2">
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Lista de Unidades</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Unidades Configuradas</CardTitle>
              <CardDescription>Gestiona todas las unidades del proyecto.</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {unidades.map((unidad) => (
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
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openUnitEditDialog(unidad)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteUnit(unidad.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Unidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total de Unidades:</span>
                    <span className="font-bold">{unidades.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Unidades Vendidas:</span>
                    <span className="font-bold">{unidades.filter((u) => u.estado === "Vendida").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Unidades Reservadas:</span>
                    <span className="font-bold">{unidades.filter((u) => u.estado === "Reservada").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Unidades Disponibles:</span>
                    <span className="font-bold">{unidades.filter((u) => u.estado === "Disponible").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Área Total:</span>
                    <span className="font-bold">{unidades.reduce((sum, u) => sum + u.area, 0)} m²</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Valor Total:</span>
                    <span className="font-bold">{formatCurrency(unidades.reduce((sum, u) => sum + u.precio, 0))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <div className="relative h-40 w-40">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      {/* Simplified pie chart */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="20" />

                      {/* Vendidas */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#22c55e"
                        strokeWidth="20"
                        strokeDasharray={`${(unidades.filter((u) => u.estado === "Vendida").length / unidades.length) * 251.2} 251.2`}
                        strokeDashoffset="0"
                      />

                      {/* Reservadas */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="20"
                        strokeDasharray={`${(unidades.filter((u) => u.estado === "Reservada").length / unidades.length) * 251.2} 251.2`}
                        strokeDashoffset={`${-(unidades.filter((u) => u.estado === "Vendida").length / unidades.length) * 251.2}`}
                      />

                      {/* Disponibles */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="20"
                        strokeDasharray={`${(unidades.filter((u) => u.estado === "Disponible").length / unidades.length) * 251.2} 251.2`}
                        strokeDashoffset={`${-((unidades.filter((u) => u.estado === "Vendida").length + unidades.filter((u) => u.estado === "Reservada").length) / unidades.length) * 251.2}`}
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Vendidas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Reservadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Disponibles</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Planta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(unidades.map((u) => u.planta)))
                    .sort((a, b) => b - a)
                    .map((planta) => {
                      const unidadesEnPlanta = unidades.filter((u) => u.planta === planta)
                      const vendidas = unidadesEnPlanta.filter((u) => u.estado === "Vendida").length
                      const total = unidadesEnPlanta.length
                      const porcentaje = (vendidas / total) * 100

                      return (
                        <div key={planta} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span>Planta {planta}</span>
                            <span className="text-sm text-muted-foreground">
                              {vendidas}/{total} unidades
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${porcentaje}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Unidades</CardTitle>
              <CardDescription>Configura las opciones generales para las unidades.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unit-numbering">Sistema de Numeración</Label>
                <Select defaultValue="alphanumeric">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sistema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphanumeric">Alfanumérico (A-101)</SelectItem>
                    <SelectItem value="numeric">Numérico (101)</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit-types">Tipos de Unidades</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    Oficina{" "}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    Local Comercial{" "}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    Almacén{" "}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    Departamento{" "}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Button variant="outline" size="sm" className="h-7">
                    <Plus className="h-3 w-3 mr-1" />
                    Añadir Tipo
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit-features">Características Disponibles</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    Aire acondicionado{" "}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    Fibra óptica{" "}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    Suelo técnico{" "}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    Domótica{" "}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Button variant="outline" size="sm" className="h-7">
                    <Plus className="h-3 w-3 mr-1" />
                    Añadir Característica
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="unit-auto-numbering">Numeración Automática</Label>
                  <Switch id="unit-auto-numbering" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Genera automáticamente números de unidad basados en la planta y posición.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="unit-price-calculation">Cálculo Automático de Precios</Label>
                  <Switch id="unit-price-calculation" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Calcula automáticamente los precios basados en el área y otros factores.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price-per-sqm">Precio Base por m² (U$)</Label>
                <div className="flex gap-2">
                  <Input id="price-per-sqm" type="number" defaultValue="3500" />
                  <Select defaultValue="USD">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">U$</SelectItem>
                      <SelectItem value="ARS">AR$</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isUnitEditDialogOpen} onOpenChange={setIsUnitEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Unidad</DialogTitle>
            <DialogDescription>Modifica los detalles de la unidad.</DialogDescription>
          </DialogHeader>
          {unitToEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-unit-number">Número de Unidad</Label>
                  <Input
                    id="edit-unit-number"
                    value={unitToEdit.numero}
                    onChange={(e) => handleUnitEditFormChange('numero', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit-type">Tipo</Label>
                  <Select
                    value={unitToEdit.tipo}
                    onValueChange={(value) => handleUnitEditFormChange('tipo', value)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oficina">Oficina</SelectItem>
                      <SelectItem value="Local">Local Comercial</SelectItem>
                      <SelectItem value="Departamento">Departamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label htmlFor="edit-unit-area">Área (m²)</Label>
                    <Input
                      id="edit-unit-area"
                      type="number"
                      value={unitToEdit.area}
                      onChange={(e) => handleUnitEditNumberChange('area', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-unit-floor">Planta</Label>
                    <Input
                      id="edit-unit-floor"
                      type="number"
                      value={unitToEdit.planta}
                      onChange={(e) => handleUnitEditNumberChange('planta', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit-price">Precio (U$)</Label>
                  <Input
                    id="edit-unit-price"
                    type="number"
                    value={unitToEdit.precio}
                    onChange={(e) => handleUnitEditNumberChange('precio', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit-status">Estado</Label>
                  <Select
                    value={unitToEdit.estado}
                    onValueChange={(value: "Disponible" | "Vendida" | "Reservada") => handleUnitEditFormChange('estado', value)}
                  >
                     <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disponible">Disponible</SelectItem>
                      <SelectItem value="Reservada">Reservada</SelectItem>
                      <SelectItem value="Vendida">Vendida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit-description">Descripción</Label>
                  <Textarea
                    id="edit-unit-description"
                    value={unitToEdit.descripcion || ""}
                    onChange={(e) => handleUnitEditFormChange('descripcion', e.target.value)}
                  />
                </div>
              </div>

              {unitToEdit.estado === "Vendida" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-unit-sale-date">Fecha de Venta</Label>
                    <Input
                      id="edit-unit-sale-date"
                      type="date"
                      value={unitToEdit.fechaVenta || ''}
                      onChange={(e) => handleUnitEditDateChange('fechaVenta', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-unit-client">Cliente</Label>
                    <Input
                      id="edit-unit-client"
                      value={unitToEdit.cliente || ""}
                      onChange={(e) => handleUnitEditFormChange('cliente', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                  <Label>Características</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                     <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-feature-ac"
                        checked={unitToEdit.caracteristicas?.includes("Aire acondicionado") || false}
                        onCheckedChange={(checked) => handleUnitEditFeatureChange("Aire acondicionado", checked)}
                      />
                      <Label htmlFor="edit-feature-ac">Aire acondicionado</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-feature-fiber"
                        checked={unitToEdit.caracteristicas?.includes("Fibra óptica") || false}
                        onCheckedChange={(checked) => handleUnitEditFeatureChange("Fibra óptica", checked)}
                      />
                      <Label htmlFor="edit-feature-fiber">Fibra óptica</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-feature-floor"
                        checked={unitToEdit.caracteristicas?.includes("Suelo técnico") || false}
                        onCheckedChange={(checked) => handleUnitEditFeatureChange("Suelo técnico", checked)}
                      />
                      <Label htmlFor="edit-feature-floor">Suelo técnico</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-feature-domotics"
                        checked={unitToEdit.caracteristicas?.includes("Domótica") || false}
                        onCheckedChange={(checked) => handleUnitEditFeatureChange("Domótica", checked)}
                      />
                      <Label htmlFor="edit-feature-domotics">Domótica</Label>
                    </div>
                  </div>
                </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsUnitEditDialogOpen(false); setUnitToEdit(null); }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateUnit} disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
