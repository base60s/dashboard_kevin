"use client"

import { useState, useEffect } from "react"
import PageHeader from "@/components/page-header"
import KpiCard from "@/components/dashboard/kpi-card"
import CircularProgress from "@/components/dashboard/circular-progress"
import DonutChart from "@/components/dashboard/donut-chart"
import DateDisplay from "@/components/dashboard/date-display"
import CustomizeButton from "@/components/dashboard/customize-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useAdminDataStore from "@/lib/adminDataStore"
import { type KPI } from "@/components/admin/kpi-management"
import { type Unit } from "@/components/admin/unit-management"
import { Skeleton } from "@/components/ui/skeleton"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, LineChart, Line, XAxis, YAxis } from "recharts"
import { supabase } from '@/lib/supabase'
import UnidadesSection from "@/components/dashboard/unidades-section"

function renderKpiChart(kpi) {
  const data = [{ name: kpi.name, value: kpi.value }];
  if (kpi.chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
            </linearGradient>
            <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.2" />
            </filter>
          </defs>
          <XAxis dataKey="name" hide />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="value" fill="url(#barGradient)" filter="url(#barShadow)" radius={[8,8,0,0]} isAnimationActive animationDuration={900} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (kpi.chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
            </linearGradient>
            <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.2" />
            </filter>
          </defs>
          <XAxis dataKey="name" hide />
          <YAxis hide />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="url(#lineGradient)" strokeWidth={3} dot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2, filter: 'url(#lineShadow)' }} filter="url(#lineShadow)" isAnimationActive animationDuration={900} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (kpi.chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={120}>
        <PieChart>
          <defs>
            <linearGradient id="pieGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
            </linearGradient>
            <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.2" />
            </filter>
          </defs>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} label fill="url(#pieGradient)" filter="url(#pieShadow)" isAnimationActive animationDuration={900} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  return null;
}

export default function Dashboard() {
  const [visibleComponents, setVisibleComponents] = useState({
    progress: true,
    days: true,
    units: true,
    duration: true,
    summary: true,
    unidades: true,
    imagenes: true,
  })

  const kpiSettings = useAdminDataStore((state) => state.kpiSettings)
  const unidades = useAdminDataStore((state) => state.unitData)
  const progressImages = useAdminDataStore((state) => state.progressImages)
  const lastUpdated = useAdminDataStore((state) => state.lastUpdated)
  const fetchUnitData = useAdminDataStore((state) => state.fetchUnitData)
  const fetchProgressImages = useAdminDataStore((state) => state.fetchProgressImages)
  const fetchKpiSettings = useAdminDataStore((state) => state.fetchKpiSettings)
  
  const isLoading = lastUpdated === null

  const progressKpi = (kpiSettings || []).find((k: KPI) => k.name === "Progreso de Obra" && k.visible)
  const daysKpi = (kpiSettings || []).find((k: KPI) => k.name === "Días Pendientes" && k.visible)
  const unitsSoldKpi = (kpiSettings || []).find((k: KPI) => k.name === "Unidades Vendidas" && k.visible)
  const durationKpi = (kpiSettings || []).find((k: KPI) => k.name === "Duración Total" && k.visible)

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

  const [settings, setSettings] = useState<{
    name: string;
    address: string;
    description?: string;
    developer?: string;
    start_date?: string;
    end_date?: string;
  } | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('settings').select('*').limit(1).single();
      if (!error && data) {
        setSettings({
          name: data.name || '',
          address: data.address || '',
          description: data.description || '',
          developer: data.developer || '',
          start_date: data.start_date || '',
          end_date: data.end_date || ''
        });
      }
      setSettingsLoading(false);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchKpiSettings();
    fetchUnitData();
    fetchProgressImages();
  }, [fetchKpiSettings, fetchUnitData, fetchProgressImages]);

  // Load visibleComponents from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('dashboard:visibleComponents');
    if (stored) {
      setVisibleComponents(JSON.parse(stored));
    }
  }, []);

  // Save visibleComponents to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboard:visibleComponents', JSON.stringify(visibleComponents));
  }, [visibleComponents]);

  // Determine which dashboard options have data available
  const availableOptions = [
    ...(progressKpi ? ["progress"] : []),
    ...(daysKpi ? ["days"] : []),
    ...(unitsSoldKpi ? ["units"] : []),
    ...(durationKpi ? ["duration"] : []),
    "summary",
    ...(unidades.length > 0 ? ["unidades"] : []),
    ...(progressImages.length > 0 ? ["imagenes"] : []),
  ];

  // Show only KPIs selected in visibleComponents
  const selectedKpis = Array.isArray(kpiSettings)
    ? kpiSettings.filter((k) => visibleComponents[`kpi-${k.id}`])
    : [];

  return (
    <>
      <PageHeader
        title={settingsLoading ? 'Cargando...' : (settings?.name || 'Edificio Corporativo Zenith')}
        address={settingsLoading ? '' : (settings?.address || 'Paseo de la Castellana 200, Madrid')}
      >
        <div className="mt-4">
          <CustomizeButton visibleComponents={visibleComponents} setVisibleComponents={setVisibleComponents} availableOptions={availableOptions} />
        </div>
        {/* Project extra info */}
        {!settingsLoading && settings && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            {settings.description && <div><b>Descripción:</b> {settings.description}</div>}
            {settings.developer && <div><b>Desarrollador:</b> {settings.developer}</div>}
            {settings.start_date && <div><b>Fecha de Inicio:</b> {settings.start_date}</div>}
            {settings.end_date && <div><b>Fecha de Finalización:</b> {settings.end_date}</div>}
          </div>
        )}
      </PageHeader>

      <main className="p-4">
        {/* KPIs Section */}
        {selectedKpis.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {selectedKpis.map((kpi, index) => (
              <Card key={kpi.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{kpi.format === 'percentage' ? `${kpi.value}%` : kpi.value}</div>
                  {renderKpiChart(kpi)}
                  {kpi.description && <div className="text-xs text-muted-foreground mt-2">{kpi.description}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Removed Resumen del Proyecto card as requested */}
        </div>

        {/* Unidades Section */}
        {visibleComponents.unidades && unidades.length > 0 && (
          <UnidadesSection unidades={unidades} />
        )}
      </main>
    </>
  )
}
