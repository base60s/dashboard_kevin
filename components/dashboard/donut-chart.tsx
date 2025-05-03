"use client"

import { useState } from "react"

export interface ChartItem {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  data: ChartItem[]
  size?: number
  innerRadius?: number
  outerRadius?: number
}

export default function DonutChart({
  data,
  size = 160,
  innerRadius = size * 0.25,
  outerRadius = size * 0.375,
}: DonutChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
  const total = data.reduce((acc, item) => acc + item.value, 0)
  let cumulativePercent = 0

  const center = size / 2

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={outerRadius} fill="transparent" />
        {data.map((item, i) => {
          const startPercent = cumulativePercent
          const percent = item.value / total
          cumulativePercent += percent

          const startX = center + outerRadius * Math.cos(2 * Math.PI * startPercent - Math.PI / 2)
          const startY = center + outerRadius * Math.sin(2 * Math.PI * startPercent - Math.PI / 2)
          const endX = center + outerRadius * Math.cos(2 * Math.PI * cumulativePercent - Math.PI / 2)
          const endY = center + outerRadius * Math.sin(2 * Math.PI * cumulativePercent - Math.PI / 2)

          const largeArcFlag = percent > 0.5 ? 1 : 0

          const pathData = [
            `M ${center} ${center}`,
            `L ${startX} ${startY}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `Z`,
          ].join(" ")

          // Calculate position for tooltip
          const midPercent = startPercent + percent / 2
          const midX = center + (outerRadius + 10) * Math.cos(2 * Math.PI * midPercent - Math.PI / 2)
          const midY = center + (outerRadius + 10) * Math.sin(2 * Math.PI * midPercent - Math.PI / 2)

          const isHovered = hoveredSegment === i
          const scale = isHovered ? 1.05 : 1
          const transformOrigin = `${center}px ${center}px`

          return (
            <path
              key={i}
              d={pathData}
              className={item.color}
              style={{
                transform: `scale(${scale})`,
                transformOrigin,
                transition: "transform 0.2s ease-out",
              }}
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          )
        })}
        <circle cx={center} cy={center} r={innerRadius} fill="white" />
      </svg>
    </div>
  )
}
