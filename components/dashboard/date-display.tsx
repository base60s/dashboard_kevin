import { Calendar } from "lucide-react"

interface DateDisplayProps {
  label: string
  date: string
}

export default function DateDisplay({ label, date }: DateDisplayProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{label}</h3>
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4" />
        {date}
      </div>
    </div>
  )
}
