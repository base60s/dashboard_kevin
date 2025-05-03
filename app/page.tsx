"use client"

import { useState } from "react"
import PageHeader from "@/components/page-header"
import KpiCard from "@/components/dashboard/kpi-card"
import CircularProgress from "@/components/dashboard/circular-progress"
import DonutChart, { type ChartItem } from "@/components/dashboard/donut-chart"
import DateDisplay from "@/components/dashboard/date-display"
import CustomizeButton from "@/components/dashboard/customize-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useAdminDataStore from "@/lib/adminDataStore"
import { type KPI } from "@/components/admin/kpi-management"
import { type Unit } from "@/components/admin/unit-management"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  const [visibleComponents, setVisibleComponents] = useState({
    progress: true,
    days: true,
    units: true,
    duration: true,
    summary: true,
    distribution: true,
  })

  const kpiSettings = useAdminDataStore((state) => state.kpiSettings)
  const unidades = useAdminDataStore((state) => state.unitData)
  const lastUpdated = useAdminDataStore((state) => state.lastUpdated)
  
  const isLoading = lastUpdated === null

  const progressKpi = kpiSettings.find((k: KPI) => k.name === "Progreso de Obra" && k.visible)
  const daysKpi = kpiSettings.find((k: KPI) => k.name === "Días Pendientes" && k.visible)
  const unitsSoldKpi = kpiSettings.find((k: KPI) => k.name === "Unidades Vendidas" && k.visible)
  const durationKpi = kpiSettings.find((k: KPI) => k.name === "Duración Total" && k.visible)

  const projectProgress = progressKpi?.value ?? 0
  const pendingDays = daysKpi?.value ?? 0
  const unitsSoldPercent = unitsSoldKpi?.value ?? 0
  const totalDuration = durationKpi?.value ?? 0

  const totalUnits = unidades.length
  const soldUnitsCount = unidades.filter(u => u.estado === 'Vendida').length
  const availableUnitsCount = unidades.filter(u => u.estado === 'Disponible').length
  const reservedUnitsCount = unidades.filter(u => u.estado === 'Reservada').length

  const unitsByType: ChartItem[] = Array.from(new Set(unidades.map(u => u.tipo)))
    .map(tipo => ({
      name: tipo,
      value: unidades.filter(u => u.tipo === tipo).length,
      color: tipo === 'Oficina' ? "bg-blue-500" : "bg-gray-400"
    }))

  const unitsByStatus: ChartItem[] = [
    { name: "Vendidas", value: soldUnitsCount, color: "bg-green-500" },
    { name: "Disponibles", value: availableUnitsCount, color: "bg-amber-400" },
    { name: "Reservadas", value: reservedUnitsCount, color: "bg-red-500" },
  ].filter(item => item.value > 0)

  return (
    <>
      <PageHeader title="Edificio Corporativo Zenith" address="Paseo de la Castellana 200, Madrid">
        <div className="mt-4">
          <CustomizeButton />
        </div>
      </PageHeader>

      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {visibleComponents.progress && (
            isLoading ? (
              <Skeleton className="h-[126px]" />
            ) : progressKpi ? (
            <KpiCard
                title={progressKpi.name}
              value={`${projectProgress}%`}
                subtitle={progressKpi.description}
              progress={projectProgress}
            />
            ) : (
               <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Progreso de Obra</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">No visible</p></CardContent></Card>
            )
          )}

          {visibleComponents.days && daysKpi && (
            <KpiCard 
              title={daysKpi.name}
              value={pendingDays} 
              subtitle={daysKpi.description}
            />
          )}

          {visibleComponents.units && (
             isLoading ? (
               <Skeleton className="h-[126px]" /> 
             ) : unitsSoldKpi ? (
            <KpiCard
                title={unitsSoldKpi.name}
                value={`${unitsSoldPercent}%`}
                subtitle={`${soldUnitsCount} de ${totalUnits} unidades`}
                progress={unitsSoldPercent}
            />
            ) : (
              <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Unidades Vendidas</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">No visible</p></CardContent></Card>
            )
          )}

          {visibleComponents.duration && durationKpi && (
            <KpiCard 
              title={durationKpi.name} 
              value={totalDuration} 
              subtitle={durationKpi.description}
            /> 
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visibleComponents.summary && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Edificio de oficinas de clase A con 15 plantas, 4 niveles de estacionamiento subterráneo y áreas
                  comunes.
                </p>

                <div className="flex justify-center mb-6">
                  {isLoading ? (
                    <Skeleton className="h-[160px] w-[160px] rounded-full" />
                  ) : (
                  <CircularProgress value={projectProgress} />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <DateDisplay label="Inicio idea proyecto" date="9/9/2023" />
                    <DateDisplay label="Fecha fin proyecto" date="14/12/2025" />
                  </div>

                  <div>
                    <DateDisplay label="Inicio construcción" date="9/9/2023" />
                    <DateDisplay label="Fecha fin estimada" date="2025-05-02" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Removed the Distribution Card */}
          {/* 
          {visibleComponents.distribution && (
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Unidades</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tipo">
                  <TabsList className="mb-4">
                    <TabsTrigger value="tipo">Por Tipo</TabsTrigger>
                    <TabsTrigger value="estado">Por Estado</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tipo" className="flex justify-center items-center min-h-[200px]"> 
                    {unitsByType.length > 0 ? (
                    <DonutChart data={unitsByType} />
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay datos de unidades por tipo.</p>
                    )}
                  </TabsContent>
                  <TabsContent value="estado" className="flex justify-center items-center min-h-[200px]"> 
                    {unitsByStatus.length > 0 ? (
                    <DonutChart data={unitsByStatus} />
                    ) : (
                       <p className="text-sm text-muted-foreground">No hay datos de unidades por estado.</p>
                    )}
                  </TabsContent>
                </Tabs>


                <div className="flex justify-center gap-6 mt-4">
                  
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Apartamentos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Vendidas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <span className="text-sm">Disponibles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
           */}
        </div>
      </main>
    </>
  )
}
