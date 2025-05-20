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
import useAdminDataStore from '@/lib/adminDataStore'

interface CustomizeOption {
  id: string
  label: string
  defaultChecked: boolean
}

interface CustomizeButtonProps {
  visibleComponents: Record<string, boolean>;
  setVisibleComponents: (v: Record<string, boolean>) => void;
  availableOptions: string[];
}

export default function CustomizeButton({ visibleComponents, setVisibleComponents, availableOptions }: CustomizeButtonProps) {
  const kpiSettings = useAdminDataStore((state) => state.kpiSettings)

  const kpiOptions: CustomizeOption[] = Array.isArray(kpiSettings)
    ? kpiSettings.map(kpi => ({
        id: `kpi-${kpi.id}`,
        label: kpi.name,
        defaultChecked: kpi.visible,
      }))
    : [];

  const options: CustomizeOption[] = [
    { id: "progress", label: "Progreso de Obra", defaultChecked: true },
    { id: "days", label: "Días Pendientes", defaultChecked: true },
    { id: "units", label: "Unidades Vendidas", defaultChecked: true },
    { id: "duration", label: "Duración Total", defaultChecked: true },
    { id: "unidades", label: "Unidades", defaultChecked: true },
    { id: "imagenes", label: "Imágenes de Progreso", defaultChecked: true },
    ...kpiOptions,
  ];

  const filteredOptions = options.filter(opt => availableOptions.includes(opt.id) || opt.id.startsWith('kpi-'));

  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Object.entries(visibleComponents).filter(([_, v]) => v).map(([k]) => k)
  );

  const handleOptionChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions((prev) => [...prev, id])
    } else {
      setSelectedOptions((prev) => prev.filter((item) => item !== id))
    }
  }

  const handleSave = () => {
    const newState: Record<string, boolean> = {};
    filteredOptions.forEach(opt => {
      newState[opt.id] = selectedOptions.includes(opt.id);
    });
    setVisibleComponents(newState);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          {filteredOptions.map((option) => (
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
        <Button className="w-full" onClick={handleSave}>Guardar cambios</Button>
      </DialogContent>
    </Dialog>
  )
}
