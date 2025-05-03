"use client"

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash, Plus, BarChart, LineChart, PieChart, Save, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import useAdminDataStore from '@/lib/adminDataStore'

export interface KPI {
  id: string
  name: string
  description: string
  value: number
  target: number
  unit: string
  format: string
  category: string
  visible: boolean
  chartType: string
  trend?: "up" | "down" | "neutral"
  change?: string
}

export default function KpiManagement() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [kpiToEdit, setKpiToEdit] = useState<KPI | null>(null)
  const setKpiSettings = useAdminDataStore((state) => state.setKpiSettings)

  const [kpis, setKpis] = useState<KPI[]>([
    {
      id: "1",
      name: "Progreso de Obra",
      description: "Avance según cronograma planificado",
      value: 20,
      target: 100,
      unit: "%",
      format: "percentage",
      category: "progress",
      visible: true,
      chartType: "line",
      trend: "up",
      change: "+5%",
    },
    {
      id: "2",
      name: "Días Pendientes",
      description: "Días restantes hasta la fecha estimada de finalización",
      value: 10,
      target: 0,
      unit: "días",
      format: "number",
      category: "time",
      visible: true,
      chartType: "none",
      trend: "down",
      change: "-2",
    },
    {
      id: "3",
      name: "Unidades Vendidas",
      description: "Porcentaje de unidades vendidas",
      value: 90,
      target: 100,
      unit: "%",
      format: "percentage",
      category: "sales",
      visible: true,
      chartType: "pie",
      trend: "up",
      change: "+15%",
    },
    {
      id: "4",
      name: "Duración Total",
      description: "Meses planificados para la construcción",
      value: 24.6,
      target: 24,
      unit: "meses",
      format: "number",
      category: "time",
      visible: true,
      chartType: "none",
      trend: "neutral",
      change: "0",
    },
    {
      id: "5",
      name: "Presupuesto Utilizado",
      description: "Porcentaje del presupuesto utilizado hasta la fecha",
      value: 25,
      target: 100,
      unit: "%",
      format: "percentage",
      category: "budget",
      visible: true,
      chartType: "bar",
      trend: "up",
      change: "+5%",
    },
  ])

  const [newKpi, setNewKpi] = useState<Omit<KPI, "id">>({
    name: "",
    description: "",
    value: 0,
    target: 100,
    unit: "%",
    format: "percentage",
    category: "progress",
    visible: true,
    chartType: "none",
  })

  const handleAddKpi = () => {
    const updatedKpis = [...kpis, { ...newKpi, id: Date.now().toString() }];
    setKpis(updatedKpis);
    setKpiSettings(updatedKpis);
    setNewKpi({
      name: "",
      description: "",
      value: 0,
      target: 100,
      unit: "%",
      format: "percentage",
      category: "progress",
      visible: true,
      chartType: "none",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "KPI añadido",
      description: "El nuevo KPI ha sido añadido correctamente.",
    })
  }

  const openEditDialog = (kpi: KPI) => {
    setKpiToEdit({ ...kpi });
    setIsEditDialogOpen(true);
  }

  const handleEditFormChange = (field: keyof KPI, value: any) => {
    if (!kpiToEdit) return;
    setKpiToEdit(prev => prev ? { ...prev, [field]: value } : null);
  }

  const handleEditFormNumberChange = (field: keyof KPI, value: string) => {
    if (!kpiToEdit) return;
    const numValue = Number.parseFloat(value);
    setKpiToEdit(prev => prev ? { ...prev, [field]: isNaN(numValue) ? 0 : numValue } : null);
  }

  const handleUpdateKpi = () => {
    if (!kpiToEdit) return;

    const updatedKpis = kpis.map((kpi) => 
      kpi.id === kpiToEdit.id ? { ...kpiToEdit } : kpi
    );

    setKpis(updatedKpis);
    setKpiSettings(updatedKpis);
    setIsEditDialogOpen(false);
    setKpiToEdit(null);

    toast({
      title: "KPI actualizado",
      description: "El KPI ha sido actualizado correctamente.",
    });
  }

  const handleDeleteKpi = (id: string) => {
    const updatedKpis = kpis.filter((kpi) => kpi.id !== id);
    setKpis(updatedKpis);
    setKpiSettings(updatedKpis);
    toast({
      title: "KPI eliminado",
      description: "El KPI ha sido eliminado correctamente.",
    })
  }

  const handleToggleVisibility = (id: string) => {
    const updatedKpis = kpis.map((kpi) => (kpi.id === id ? { ...kpi, visible: !kpi.visible } : kpi));
    setKpis(updatedKpis);
    setKpiSettings(updatedKpis);
    toast({
      title: "Visibilidad actualizada",
      description: "La visibilidad del KPI ha sido actualizada.",
    })
  }

  const handleSaveAllChanges = () => {
    setIsLoading(true)
    setKpiSettings(kpis)

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Cambios guardados",
        description: "Todos los cambios han sido guardados correctamente (y actualizados globalmente).",
      })
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de KPIs</h2>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Añadir KPI
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nuevo KPI</DialogTitle>
                <DialogDescription>
                  Completa los campos para crear un nuevo indicador clave de rendimiento.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="kpi-name">Nombre</Label>
                  <Input
                    id="kpi-name"
                    value={newKpi.name}
                    onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })}
                    placeholder="Ej: Progreso de Obra"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kpi-description">Descripción</Label>
                  <Input
                    id="kpi-description"
                    value={newKpi.description}
                    onChange={(e) => setNewKpi({ ...newKpi, description: e.target.value })}
                    placeholder="Breve descripción del KPI"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kpi-value">Valor Actual</Label>
                    <Input
                      id="kpi-value"
                      type="number"
                      value={newKpi.value.toString()}
                      onChange={(e) => setNewKpi({ ...newKpi, value: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kpi-target">Valor Objetivo</Label>
                    <Input
                      id="kpi-target"
                      type="number"
                      value={newKpi.target.toString()}
                      onChange={(e) => setNewKpi({ ...newKpi, target: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kpi-unit">Unidad</Label>
                    <Input
                      id="kpi-unit"
                      value={newKpi.unit}
                      onChange={(e) => setNewKpi({ ...newKpi, unit: e.target.value })}
                      placeholder="Ej: %, días, €"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kpi-format">Formato</Label>
                    <Select value={newKpi.format} onValueChange={(value) => setNewKpi({ ...newKpi, format: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Porcentaje</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="currency">Moneda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kpi-category">Categoría</Label>
                    <Select
                      value={newKpi.category}
                      onValueChange={(value) => setNewKpi({ ...newKpi, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="progress">Progreso</SelectItem>
                        <SelectItem value="time">Tiempo</SelectItem>
                        <SelectItem value="sales">Ventas</SelectItem>
                        <SelectItem value="budget">Presupuesto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kpi-chart">Tipo de Gráfico</Label>
                    <Select
                      value={newKpi.chartType}
                      onValueChange={(value) => setNewKpi({ ...newKpi, chartType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Ninguno</SelectItem>
                        <SelectItem value="line">Línea</SelectItem>
                        <SelectItem value="bar">Barra</SelectItem>
                        <SelectItem value="pie">Circular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="kpi-visible"
                    checked={newKpi.visible}
                    onCheckedChange={(checked) => setNewKpi({ ...newKpi, visible: checked })}
                  />
                  <Label htmlFor="kpi-visible">Visible en Dashboard</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddKpi}>Añadir KPI</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSaveAllChanges} disabled={isLoading} className="gap-2">
            <Save className="h-4 w-4" />
            Guardar Todos los Cambios
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Lista de KPIs</TabsTrigger>
          <TabsTrigger value="dashboard">Vista Previa Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>KPIs Configurados</CardTitle>
              <CardDescription>
                Gestiona los indicadores clave de rendimiento que se muestran en el dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Valor Actual</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Gráfico</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpis.map((kpi) => (
                    <TableRow key={kpi.id}>
                      <TableCell className="font-medium">{kpi.name}</TableCell>
                      <TableCell>
                        {kpi.value} {kpi.unit}
                        {kpi.trend && (
                          <span
                            className={`ml-2 ${
                              kpi.trend === "up"
                                ? "text-green-600"
                                : kpi.trend === "down"
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {kpi.change}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {kpi.target} {kpi.unit}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {kpi.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {kpi.chartType === "line" && <LineChart className="h-4 w-4" />}
                        {kpi.chartType === "bar" && <BarChart className="h-4 w-4" />}
                        {kpi.chartType === "pie" && <PieChart className="h-4 w-4" />}
                        {kpi.chartType === "none" && <span>-</span>}
                      </TableCell>
                      <TableCell>
                        <Switch checked={kpi.visible} onCheckedChange={() => handleToggleVisibility(kpi.id)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(kpi)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteKpi(kpi.id)}>
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

        <TabsContent value="dashboard" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa del Dashboard</CardTitle>
              <CardDescription>Previsualiza cómo se verán los KPIs en el dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis
                  .filter((kpi) => kpi.visible)
                  .map((kpi) => (
                    <Card key={kpi.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {kpi.value}
                          {kpi.unit}
                        </div>
                        {kpi.format === "percentage" && (
                          <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                            <div className="h-2 bg-black rounded-full" style={{ width: `${kpi.value}%` }}></div>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">{kpi.description}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <Eye className="h-4 w-4" />
                Ver Dashboard Completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de KPIs</CardTitle>
              <CardDescription>Configura las opciones generales para los KPIs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-refresh">Actualización Automática</Label>
                  <Switch id="auto-refresh" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Actualiza automáticamente los valores de los KPIs según la frecuencia establecida.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refresh-frequency">Frecuencia de Actualización</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Cada hora</SelectItem>
                    <SelectItem value="daily">Diaria</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-trends">Mostrar Tendencias</Label>
                  <Switch id="show-trends" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Muestra indicadores de tendencia (subida/bajada) junto a los valores de los KPIs.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="alert-thresholds">Alertas por Umbrales</Label>
                  <Switch id="alert-thresholds" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Envía alertas cuando los KPIs superen o estén por debajo de umbrales definidos.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-chart">Tipo de Gráfico Predeterminado</Label>
                <Select defaultValue="line">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Línea</SelectItem>
                    <SelectItem value="bar">Barra</SelectItem>
                    <SelectItem value="pie">Circular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar KPI</DialogTitle>
            <DialogDescription>
              Modifica los detalles del indicador clave de rendimiento.
            </DialogDescription>
          </DialogHeader>
          {kpiToEdit && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-kpi-name">Nombre</Label>
                <Input
                  id="edit-kpi-name"
                  value={kpiToEdit.name}
                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-kpi-description">Descripción</Label>
                <Input
                  id="edit-kpi-description"
                  value={kpiToEdit.description}
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-kpi-value">Valor Actual</Label>
                  <Input
                    id="edit-kpi-value"
                    type="number"
                    value={kpiToEdit.value}
                    onChange={(e) => handleEditFormNumberChange('value', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-kpi-target">Valor Objetivo</Label>
                  <Input
                    id="edit-kpi-target"
                    type="number"
                    value={kpiToEdit.target}
                    onChange={(e) => handleEditFormNumberChange('target', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-kpi-unit">Unidad</Label>
                  <Input
                    id="edit-kpi-unit"
                    value={kpiToEdit.unit}
                    onChange={(e) => handleEditFormChange('unit', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-kpi-format">Formato</Label>
                  <Select
                    value={kpiToEdit.format}
                    onValueChange={(value) => handleEditFormChange('format', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentaje</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="currency">Moneda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-kpi-category">Categoría</Label>
                  <Select
                    value={kpiToEdit.category}
                    onValueChange={(value) => handleEditFormChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="progress">Progreso</SelectItem>
                      <SelectItem value="time">Tiempo</SelectItem>
                      <SelectItem value="sales">Ventas</SelectItem>
                      <SelectItem value="budget">Presupuesto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-kpi-chart">Tipo de Gráfico</Label>
                  <Select
                    value={kpiToEdit.chartType}
                    onValueChange={(value) => handleEditFormChange('chartType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguno</SelectItem>
                      <SelectItem value="line">Línea</SelectItem>
                      <SelectItem value="bar">Barra</SelectItem>
                      <SelectItem value="pie">Circular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-kpi-visible"
                  checked={kpiToEdit.visible}
                  onCheckedChange={(checked) => handleEditFormChange('visible', checked)}
                />
                <Label htmlFor="edit-kpi-visible">Visible en Dashboard</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setKpiToEdit(null); }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateKpi}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
