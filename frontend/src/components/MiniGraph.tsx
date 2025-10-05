import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

interface MiniGraphProps {
  data: number[] // 24 hourly values (0-100)
  width?: number
  height?: number
}

export default function MiniGraph({ data, width = 120, height = 60 }: MiniGraphProps) {
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

  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <XAxis
          dataKey="hour"
          hide
        />
        <YAxis hide domain={[0, 100]} />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
