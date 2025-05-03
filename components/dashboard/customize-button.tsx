"use client"

import { Button } from "@/components/ui/button"
import { Grid } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface CustomizeOption {
  id: string
  label: string
  defaultChecked: boolean
}

export default function CustomizeButton() {
  const [options, setOptions] = useState<CustomizeOption[]>([
    { id: "progress", label: "Progreso de Obra", defaultChecked: true },
    { id: "days", label: "Días Pendientes", defaultChecked: true },
    { id: "units", label: "Unidades Vendidas", defaultChecked: true },
    { id: "duration", label: "Duración Total", defaultChecked: true },
    { id: "summary", label: "Resumen del Proyecto", defaultChecked: true },
    { id: "distribution", label: "Distribución de Unidades", defaultChecked: true },
  ])

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    options.filter((option) => option.defaultChecked).map((option) => option.id),
  )

  const handleOptionChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions((prev) => [...prev, id])
    } else {
      setSelectedOptions((prev) => prev.filter((item) => item !== id))
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Grid className="h-4 w-4" />
          Personalizar Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Personalizar Dashboard</DialogTitle>
          <DialogDescription>Selecciona los componentes que deseas mostrar en tu dashboard.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedOptions.includes(option.id)}
                onCheckedChange={(checked) => handleOptionChange(option.id, checked as boolean)}
              />
              <Label htmlFor={option.id}>{option.label}</Label>
            </div>
          ))}
        </div>
        <Button className="w-full">Guardar cambios</Button>
      </DialogContent>
    </Dialog>
  )
}
