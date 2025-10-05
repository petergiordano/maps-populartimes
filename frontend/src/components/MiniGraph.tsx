import { useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

interface MiniGraphProps {
  data: number[] // 24 hourly values (0-100)
  width?: number
  height?: number
  inspectMode?: boolean
  dayName?: string
  hoveredHour?: number | null
  hoveredDay?: string | null
  onHourChange?: (hour: number | null) => void
  onCursorXChange?: (x: number) => void
  onDayChange?: (day: string | null) => void
}

export default function MiniGraph({
  data,
  width = 120,
  height = 60,
  inspectMode = false,
  dayName = '',
  hoveredHour = null,
  hoveredDay = null,
  onHourChange,
  onCursorXChange,
  onDayChange
}: MiniGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Transform data into format for Recharts
  const chartData = data.map((value, hour) => ({
    hour,
    value,
  }))

  // Color based on popularity level
  const getColor = (value: number) => {
    if (value === 0) return '#e5e7eb' // gray for no data
    if (value < 34) return '#22c55e' // green - low
    if (value < 67) return '#eab308' // yellow - medium
    return '#ef4444' // red - high
  }

  const handleMouseMove = (e: any) => {
    if (!inspectMode || !e || !onHourChange || !onCursorXChange || !onDayChange || !containerRef.current) return

    const hour = e.activeLabel !== undefined ? e.activeLabel : null

    if (hour !== null) {
      onHourChange(hour)
      onDayChange(dayName) // Track which day column is being hovered

      // Calculate absolute cursor X position on the page
      const rect = containerRef.current.getBoundingClientRect()
      const table = document.getElementById('facilities-table')
      if (table) {
        const tableRect = table.getBoundingClientRect()
        const relativeX = rect.left - tableRect.left + (hour / 24) * width
        onCursorXChange(relativeX)
      }
    }
  }

  const handleMouseLeave = () => {
    if (onHourChange) {
      onHourChange(null)
    }
    if (onDayChange) {
      onDayChange(null)
    }
  }

  return (
    <div ref={containerRef} className="relative" style={{ width, height }}>
      <ResponsiveContainer width={width} height={height}>
        <BarChart
          data={chartData}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <XAxis dataKey="hour" hide />
          <YAxis hide domain={[0, 100]} />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Inspect Mode: Value Display - shows only for graphs in the hovered day column */}
      {inspectMode && hoveredHour !== null && hoveredDay === dayName && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: `${(hoveredHour / 24) * 100}%`,
            top: '-30px',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-black text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg">
            {data[hoveredHour]}
          </div>
        </div>
      )}
    </div>
  )
}
