"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase'

export default function GeneralSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settingsId, setSettingsId] = useState<string | null>(null)

  const [projectSettings, setProjectSettings] = useState({
    name: "Edificio Corporativo Zenith",
    address: "Paseo de la Castellana 200, Madrid",
    description: "",
    developer: "",
    start_date: "",
    end_date: ""
  })

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('settings').select('*').limit(1).single();
      if (!error && data) {
        setProjectSettings({
          name: data.name || '',
          address: data.address || '',
          description: data.description || '',
          developer: data.developer || '',
          start_date: data.start_date || '',
          end_date: data.end_date || ''
        });
        setSettingsId(data.id);
      }
    };
    fetchSettings();
  }, []);

  const handleProjectChange = (field: keyof typeof projectSettings, value: string) => {
    setProjectSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    const upsertData = { ...projectSettings };
    if (settingsId) upsertData['id'] = settingsId;
    const { error, data } = await supabase.from('settings').upsert([upsertData]).select();
    if (!error) {
      if (data && data.length > 0) setSettingsId(data[0].id);
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido aplicados correctamente.",
      })
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
    setIsLoading(false)
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
              <div className="space-y-2">
                <Label htmlFor="project-description">Descripción</Label>
                <Input
                  id="project-description"
                  value={projectSettings.description}
                  onChange={(e) => handleProjectChange("description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-developer">Desarrollador</Label>
                <Input
                  id="project-developer"
                  value={projectSettings.developer}
                  onChange={(e) => handleProjectChange("developer", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-start-date">Fecha de Inicio</Label>
                <Input
                  id="project-start-date"
                  type="date"
                  value={projectSettings.start_date || ''}
                  onChange={(e) => handleProjectChange("start_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-end-date">Fecha de Finalización</Label>
                <Input
                  id="project-end-date"
                  type="date"
                  value={projectSettings.end_date || ''}
                  onChange={(e) => handleProjectChange("end_date", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
    </div>
  )
}
