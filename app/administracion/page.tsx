"use client"

import { useState } from "react"
import PageHeader from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Settings, FileText, Bell, BarChart, ImageIcon, Grid } from "lucide-react"

// Import admin panel components
import GeneralSettings from "@/components/admin/general-settings"
import KpiManagement from "@/components/admin/kpi-management"
import ImageManagement from "@/components/admin/image-management"
import UnitManagement from "@/components/admin/unit-management"

export default function AdministracionPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <>
      <PageHeader title="Panel de Administración - Edificio Corporativo Zenith">
        <div className="mt-4">
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="general" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="kpis" className="gap-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">KPIs</span>
              </TabsTrigger>
              <TabsTrigger value="imagenes" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Imágenes</span>
              </TabsTrigger>
              <TabsTrigger value="unidades" className="gap-2">
                <Grid className="h-4 w-4" />
                <span className="hidden sm:inline">Unidades</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </PageHeader>

      <main className="p-4">
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="general" className="mt-0">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="kpis" className="mt-0">
          <KpiManagement />
        </TabsContent>

        <TabsContent value="imagenes" className="mt-0">
          <ImageManagement />
        </TabsContent>

        <TabsContent value="unidades" className="mt-0">
          <UnitManagement />
        </TabsContent>
        </Tabs>
      </main>
    </>
  )
}
