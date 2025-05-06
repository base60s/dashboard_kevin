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
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash, Plus, BarChart, LineChart, PieChart, Save, Eye, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import useAdminDataStore, { type KPI } from '@/lib/adminDataStore'

export default function KpiManagement() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [kpiToEdit, setKpiToEdit] = useState<KPI | null>(null)

  const { 
    kpiSettings, 
    isLoadingKpis, 
    kpiError, 
    fetchKpiSettings, 
    addKpi, 
    updateKpi, 
    deleteKpi 
  } = useAdminDataStore();

  useEffect(() => {
    fetchKpiSettings();
  }, [fetchKpiSettings]);

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

  const handleAddKpi = async () => {
    setIsLoading(true);
    try {
      await addKpi(newKpi);
      setNewKpi({
        name: "", description: "", value: 0, target: 100, unit: "%", 
        format: "percentage", category: "progress", visible: true, chartType: "none",
      })
      setIsAddDialogOpen(false)
      toast({ title: "KPI añadido", description: "El nuevo KPI ha sido guardado en la base de datos." })
    } catch (error) {
      console.error("Failed to add KPI:", error);
      toast({ title: "Error", description: "No se pudo añadir el KPI.", variant: "destructive" })
    } finally {
       setIsLoading(false);
    }
  }

  const openEditDialog = (kpi: KPI) => {
    setKpiToEdit({ ...kpi });
    setIsEditDialogOpen(true);
  }

  const handleEditFormChange = (field: keyof KPI, value: any) => {
    if (!kpiToEdit) return;
    const processedValue = typeof value === 'boolean' ? value : value;
    setKpiToEdit(prev => prev ? { ...prev, [field]: processedValue } : null);
  }

  const handleEditFormNumberChange = (field: keyof KPI, value: string) => {
    if (!kpiToEdit) return;
    const numValue = Number.parseFloat(value);
    setKpiToEdit(prev => prev ? { ...prev, [field]: isNaN(numValue) ? 0 : numValue } : null);
  }

  const handleUpdateKpi = async () => {
    if (!kpiToEdit) return;
    setIsLoading(true);
    try {
      await updateKpi(kpiToEdit);
      setIsEditDialogOpen(false);
      setKpiToEdit(null);
      toast({ title: "KPI actualizado", description: "El KPI ha sido actualizado en la base de datos." });
    } catch (error) {
       console.error("Failed to update KPI:", error);
      toast({ title: "Error", description: "No se pudo actualizar el KPI.", variant: "destructive" });
    } finally {
       setIsLoading(false);
    }
  }

  const handleDeleteKpi = async (id: string) => {
    setIsLoading(true);
     try {
      await deleteKpi(id);
      toast({ title: "KPI eliminado", description: "El KPI ha sido eliminado de la base de datos." });
    } catch (error) {
      console.error("Failed to delete KPI:", error);
      toast({ title: "Error", description: "No se pudo eliminar el KPI.", variant: "destructive" });
    } finally {
       setIsLoading(false);
    }
  }

  const handleToggleVisibility = async (kpi: KPI) => {
     setIsLoading(true);
    try {
      await updateKpi({ ...kpi, visible: !kpi.visible });
      toast({ title: "Visibilidad actualizada", description: "La visibilidad del KPI ha sido actualizada." });
    } catch (error) {
       console.error("Failed to toggle visibility:", error);
      toast({ title: "Error", description: "No se pudo actualizar la visibilidad.", variant: "destructive" });
    } finally {
       setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de KPIs</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={isLoadingKpis || isLoading}>
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
                  <Label htmlFor="kpi-add-name">Nombre</Label>
                  <Input
                    id="kpi-add-name"
                    value={newKpi.name}
                    onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })}
                    placeholder="Ej: Progreso de Obra"
                  />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="kpi-add-description">Descripción</Label>
                    <Input
                        id="kpi-add-description"
                        value={newKpi.description}
                        onChange={(e) => setNewKpi({ ...newKpi, description: e.target.value })}
                        placeholder="Breve descripción del KPI"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="kpi-add-target">Valor Objetivo</Label>
                    <Input
                        id="kpi-add-target"
                        type="number"
                        value={newKpi.target}
                        onChange={(e) => setNewKpi({ ...newKpi, target: parseFloat(e.target.value) || 0 })}
                    />
                </div>
                 <div className="space-y-2">
                     <Label htmlFor="kpi-add-format">Formato</Label>
                     <Select value={newKpi.format} onValueChange={(value) => setNewKpi({ ...newKpi, format: value }) }>
                        <SelectTrigger id="kpi-add-format">
                            <SelectValue placeholder="Seleccionar formato" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="percentage">Porcentaje</SelectItem>
                            <SelectItem value="number">Número</SelectItem>
                            <SelectItem value="currency">Moneda</SelectItem> 
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                     <Label htmlFor="kpi-add-unit">Unidad</Label>
                     <Input
                         id="kpi-add-unit"
                         value={newKpi.unit}
                         onChange={(e) => setNewKpi({ ...newKpi, unit: e.target.value }) }
                         placeholder="Ej: %, días, €"
                     />
                 </div>
                 <div className="space-y-2">
                     <Label htmlFor="kpi-add-category">Categoría</Label>
                     <Select value={newKpi.category} onValueChange={(value) => setNewKpi({ ...newKpi, category: value }) }>
                         <SelectTrigger id="kpi-add-category">
                             <SelectValue placeholder="Seleccionar categoría" />
                         </SelectTrigger>
                         <SelectContent>
                             <SelectItem value="progress">Progreso</SelectItem>
                             <SelectItem value="time">Tiempo</SelectItem>
                             <SelectItem value="sales">Ventas</SelectItem>
                             <SelectItem value="budget">Presupuesto</SelectItem>
                             <SelectItem value="other">Otro</SelectItem>
                         </SelectContent>
                     </Select>
                 </div>
                 <div className="space-y-2">
                     <Label htmlFor="kpi-add-chartType">Tipo de Gráfico</Label>
                     <Select value={newKpi.chartType} onValueChange={(value) => setNewKpi({ ...newKpi, chartType: value }) }>
                         <SelectTrigger id="kpi-add-chartType">
                             <SelectValue placeholder="Seleccionar gráfico" />
                         </SelectTrigger>
                         <SelectContent>
                             <SelectItem value="none">Ninguno</SelectItem>
                             <SelectItem value="line">Línea</SelectItem>
                             <SelectItem value="bar">Barra</SelectItem>
                             <SelectItem value="pie">Circular</SelectItem>
                         </SelectContent>
                     </Select>
                 </div>
                 <div className="flex items-center space-x-2">
                     <Switch 
                        id="kpi-add-visible"
                        checked={newKpi.visible}
                        onCheckedChange={(checked) => setNewKpi({ ...newKpi, visible: checked })}
                     />
                     <Label htmlFor="kpi-add-visible">Visible en Dashboard</Label>
                 </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddKpi} disabled={isLoading}> 
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Añadir KPI
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoadingKpis && <p className="text-center p-4">Cargando KPIs... <Loader2 className="inline h-4 w-4 animate-spin" /></p>}
      {kpiError && <p className="text-center p-4 text-red-600">Error al cargar KPIs: {kpiError}</p>}

      {!isLoadingKpis && !kpiError && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de KPIs</CardTitle>
            <CardDescription>Gestiona los indicadores clave de rendimiento del proyecto.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Valor Actual</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kpiSettings.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center">No hay KPIs definidos.</TableCell></TableRow>
                )}
                {kpiSettings.map((kpi) => (
                  <TableRow key={kpi.id}>
                    <TableCell className="font-medium">{kpi.name}</TableCell>
                    <TableCell>{kpi.value}</TableCell>
                    <TableCell>{kpi.target}</TableCell>
                    <TableCell>{kpi.unit}</TableCell>
                    <TableCell><Badge variant="secondary">{kpi.category}</Badge></TableCell>
                    <TableCell>
                       <Switch 
                          checked={kpi.visible}
                          onCheckedChange={() => handleToggleVisibility(kpi)}
                          disabled={isLoading}
                       /> 
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog open={isEditDialogOpen && kpiToEdit?.id === kpi.id} onOpenChange={(open) => {if (!open) {setIsEditDialogOpen(false); setKpiToEdit(null);}}}>
                        <DialogTrigger asChild>
                           <Button variant="outline" size="icon" onClick={() => openEditDialog(kpi)} disabled={isLoading}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar KPI: {kpiToEdit?.name}</DialogTitle>
                            <DialogDescription>
                              Modifica los detalles del KPI seleccionado.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-6">
                            <div className="space-y-2">
                              <Label htmlFor="kpi-edit-name">Nombre</Label>
                              <Input
                                id="kpi-edit-name"
                                value={kpiToEdit?.name || ''}
                                onChange={(e) => handleEditFormChange('name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="kpi-edit-description">Descripción</Label>
                                <Input
                                    id="kpi-edit-description"
                                    value={kpiToEdit?.description || ''}
                                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="kpi-edit-target">Valor Objetivo</Label>
                                <Input
                                    id="kpi-edit-target"
                                    type="number"
                                    value={kpiToEdit?.target ?? ''}
                                    onChange={(e) => handleEditFormNumberChange('target', e.target.value)}
                                />
                            </div>
                             <div className="space-y-2">
                                 <Label htmlFor="kpi-edit-format">Formato</Label>
                                 <Select value={kpiToEdit?.format || ''} onValueChange={(value) => handleEditFormChange('format', value)}>
                                    <SelectTrigger id="kpi-edit-format">
                                        <SelectValue placeholder="Seleccionar formato" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Porcentaje</SelectItem>
                                        <SelectItem value="number">Número</SelectItem>
                                        <SelectItem value="currency">Moneda</SelectItem> 
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                 <Label htmlFor="kpi-edit-unit">Unidad</Label>
                                 <Input
                                     id="kpi-edit-unit"
                                     value={kpiToEdit?.unit || ''}
                                     onChange={(e) => handleEditFormChange('unit', e.target.value)}
                                 />
                             </div>
                             <div className="space-y-2">
                                 <Label htmlFor="kpi-edit-category">Categoría</Label>
                                 <Select value={kpiToEdit?.category || ''} onValueChange={(value) => handleEditFormChange('category', value)}>
                                     <SelectTrigger id="kpi-edit-category">
                                         <SelectValue placeholder="Seleccionar categoría" />
                                     </SelectTrigger>
                                     <SelectContent>
                                         <SelectItem value="progress">Progreso</SelectItem>
                                         <SelectItem value="time">Tiempo</SelectItem>
                                         <SelectItem value="sales">Ventas</SelectItem>
                                         <SelectItem value="budget">Presupuesto</SelectItem>
                                         <SelectItem value="other">Otro</SelectItem>
                                     </SelectContent>
                                 </Select>
                             </div>
                              <div className="space-y-2">
                                 <Label htmlFor="kpi-edit-chartType">Tipo de Gráfico</Label>
                                 <Select value={kpiToEdit?.chartType || ''} onValueChange={(value) => handleEditFormChange('chartType', value)}>
                                     <SelectTrigger id="kpi-edit-chartType">
                                         <SelectValue placeholder="Seleccionar gráfico" />
                                     </SelectTrigger>
                                     <SelectContent>
                                         <SelectItem value="none">Ninguno</SelectItem>
                                         <SelectItem value="line">Línea</SelectItem>
                                         <SelectItem value="bar">Barra</SelectItem>
                                         <SelectItem value="pie">Circular</SelectItem>
                                     </SelectContent>
                                 </Select>
                             </div>
                             <div className="flex items-center space-x-2">
                                 <Switch 
                                    id="kpi-edit-visible"
                                    checked={kpiToEdit?.visible ?? false}
                                    onCheckedChange={(checked) => handleEditFormChange('visible', checked)}
                                 />
                                 <Label htmlFor="kpi-edit-visible">Visible en Dashboard</Label>
                             </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {setIsEditDialogOpen(false); setKpiToEdit(null);}}>Cancelar</Button>
                            <Button onClick={handleUpdateKpi} disabled={isLoading}>
                              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Guardar Cambios
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="destructive" size="icon" onClick={() => handleDeleteKpi(kpi.id)} disabled={isLoading}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
