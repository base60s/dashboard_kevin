"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function GeneralSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [projectSettings, setProjectSettings] = useState({
    name: "Edificio Corporativo Zenith",
    address: "Paseo de la Castellana 200, Madrid",
  })

  const handleProjectChange = (field: keyof typeof projectSettings, value: string) => {
    setProjectSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveSettings = () => {
    setIsLoading(true)
    console.log("Saving settings:", projectSettings); 
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido aplicados correctamente.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuración General</h2>
        <Button onClick={handleSaveSettings} disabled={isLoading} className="gap-2">
          <Save className="h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
              <CardDescription>Configura la información básica del proyecto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Nombre del Proyecto</Label>
                  <Input
                    id="project-name"
                    value={projectSettings.name}
                    onChange={(e) => handleProjectChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-address">Dirección</Label>
                  <Input
                    id="project-address"
                    value={projectSettings.address}
                    onChange={(e) => handleProjectChange("address", e.target.value)}
                  />
              </div>
            </CardContent>
          </Card>
    </div>
  )
}
