"use client"

import { useState } from "react"
import PageHeader from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import useAdminDataStore from '@/lib/adminDataStore'
import { type KPI } from "@/components/admin/kpi-management"
import { type DateRange } from "react-day-picker"
import { Skeleton } from "@/components/ui/skeleton"

const data = [
  { name: "Ene", progreso: 5, ventas: 1 },
  { name: "Feb", progreso: 8, ventas: 2 },
  { name: "Mar", progreso: 12, ventas: 3 },
  { name: "Abr", progreso: 15, ventas: 3 },
  { name: "May", progreso: 20, ventas: 4 },
]

export default function KPIsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: addDays(new Date(), 0),
  })

  const kpiSettings = useAdminDataStore((state) => state.kpiSettings)
  const lastUpdated = useAdminDataStore((state) => state.lastUpdated)
  const isLoading = lastUpdated === null

  const displayKpis = Array.isArray(kpiSettings)
    ? kpiSettings
        .filter((kpi: KPI) => kpi.visible)
        .map((kpi: KPI) => ({
          title: kpi.name,
          value: kpi.format === 'percentage' ? `${kpi.value}%` : kpi.value.toString(),
          change: kpi.change || "",
          trend: kpi.trend || "neutral",
          description: kpi.description || "",
        }))
    : [];

  return (
    <>
      <PageHeader title="KPIs - Edificio Corporativo Zenith">
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            {/* Removed the date range preset buttons */}
            {/* 
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Mensual
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Trimestral
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Anual
            </Button>
             */}
          </div>
          {/* Keep the DatePickerWithRange component */}
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </PageHeader>

      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {displayKpis.map((kpi, index: number) => (
            <Card key={kpi.title + index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <div
                  className={`flex items-center mt-2 text-sm ${kpi.trend === "up" ? "text-green-600" : kpi.trend === "down" ? "text-red-600" : "text-gray-600"}`}
                >
                  <span>{kpi.change}</span>
                  {(kpi.trend === "up" || kpi.trend === "down") && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 ml-1 ${kpi.trend === "down" && "transform rotate-180"}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 01-1 1H9v9a1 1 0 01-2 0V8H5a1 1 0 110-2h6a1 1 0 011 1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Progreso de Obra</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="progreso" stroke="#000000" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ventas Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ventas" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
