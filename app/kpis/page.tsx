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
  PieChart,
  Pie,
  Filter,
  DropShadow,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import useAdminDataStore from '@/lib/adminDataStore'
import { type KPI } from "@/components/admin/kpi-management"
import { type DateRange } from "react-day-picker"
import { Skeleton } from "@/components/ui/skeleton"
import { Fragment } from "react"

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

  function renderKpiChart(kpi, index) {
    let data = [{ name: kpi.title, value: parseFloat(kpi.value) }];
    // Ensure at least two points for line charts
    if (kpi.format !== 'percentage' && data.length === 1) {
      data = [
        { name: kpi.title, value: parseFloat(kpi.value) },
        { name: ' ', value: parseFloat(kpi.value) }
      ];
    }
    if (kpi.format === 'percentage') {
      // Pie chart for percentage KPIs
      return (
        <ResponsiveContainer width="100%" height={80}>
          <PieChart>
            <defs>
              <linearGradient id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
              </linearGradient>
              <filter id={`pieShadow${index}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.2" />
              </filter>
            </defs>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={30} label fill={`url(#pieGradient${index})`} filter={`url(#pieShadow${index})`} isAnimationActive animationDuration={900} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    // Alternate between Bar and Line for variety
    if (index % 2 === 0) {
      return (
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={data}>
            <defs>
              <linearGradient id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
              </linearGradient>
              <filter id={`barShadow${index}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.2" />
              </filter>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" fill={`url(#barGradient${index})`} filter={`url(#barShadow${index})`} radius={[8,8,0,0]} isAnimationActive animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={data}>
            <defs>
              <linearGradient id={`lineGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
              </linearGradient>
              <filter id={`lineShadow${index}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.2" />
              </filter>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={`url(#lineGradient${index})`} strokeWidth={3} dot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2, filter: `url(#lineShadow${index})` }} filter={`url(#lineShadow${index})`} isAnimationActive animationDuration={900} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

  return (
    <>
      <PageHeader title="KPIs - Edificio Corporativo Zenith">
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            {/* Removed the date range preset buttons */}
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
                {renderKpiChart(kpi, index)}
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
                {kpi.description && <div className="text-xs text-muted-foreground mt-2">{kpi.description}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
