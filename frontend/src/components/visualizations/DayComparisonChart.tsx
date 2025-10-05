import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Facility } from '../../types/Facility'

interface DayComparisonChartProps {
  facility: Facility
}

export default function DayComparisonChart({ facility }: DayComparisonChartProps) {
  const dayColors = {
    Monday: '#3b82f6',    // blue
    Tuesday: '#10b981',   // green
    Wednesday: '#f59e0b', // amber
    Thursday: '#8b5cf6',  // purple
    Friday: '#ef4444',    // red
    Saturday: '#ec4899',  // pink
    Sunday: '#06b6d4',    // cyan
  }

  // Track which day is highlighted (null = all visible equally)
  const [highlightedDay, setHighlightedDay] = useState<string | null>(null)

  // Prepare data: one object per hour with all days
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const chartData = hours.map(hour => {
    const dataPoint: any = { hour }

    facility.populartimes.forEach(dayData => {
      dataPoint[dayData.name] = dayData.data[hour]
    })

    return dataPoint
  })

  const handleDayClick = (dayName: string) => {
    // If clicking the already highlighted day, unhighlight it (show all equally)
    // Otherwise, highlight the clicked day
    setHighlightedDay(prev => prev === dayName ? null : dayName)
  }

  // Calculate peak hours for each day
  const dayPeaks = facility.populartimes.map(dayData => ({
    day: dayData.name,
    peakHour: dayData.data.indexOf(Math.max(...dayData.data)),
    peakValue: Math.max(...dayData.data),
  }))

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Day-by-Day Comparison</h3>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          Compare traffic patterns across different days of the week. Click day names to highlight.
        </p>
        {highlightedDay && (
          <button
            onClick={() => setHighlightedDay(null)}
            className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="hour"
              label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
              tickFormatter={(hour) => `${hour}:00`}
            />
            <YAxis
              label={{ value: 'Popularity', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip
              formatter={(value: number) => [`${value}`, 'Popularity']}
              labelFormatter={(hour) => `Time: ${hour}:00`}
            />
            <Legend
              onClick={(e) => handleDayClick(e.value)}
              wrapperStyle={{ cursor: 'pointer' }}
            />
            {facility.populartimes.map(dayData => {
              const isHighlighted = highlightedDay === null || highlightedDay === dayData.name
              return (
                <Line
                  key={dayData.name}
                  type="monotone"
                  dataKey={dayData.name}
                  stroke={dayColors[dayData.name as keyof typeof dayColors]}
                  strokeWidth={isHighlighted ? 3 : 2}
                  strokeOpacity={isHighlighted ? 1 : 0.3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Peak Hours Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-3">Peak Hours by Day</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dayPeaks.map(({ day, peakHour, peakValue }) => {
            const isHighlighted = highlightedDay === null || highlightedDay === day
            return (
              <div
                key={day}
                className={`bg-white rounded p-3 border cursor-pointer transition-all ${
                  isHighlighted ? '' : 'opacity-30'
                }`}
                style={{ borderLeftColor: dayColors[day as keyof typeof dayColors], borderLeftWidth: '4px' }}
                onClick={() => handleDayClick(day)}
              >
                <div className="text-xs font-medium text-gray-500">{day}</div>
                <div className="text-lg font-bold" style={{ color: dayColors[day as keyof typeof dayColors] }}>
                  {peakHour}:00
                </div>
                <div className="text-xs text-gray-600">Peak: {peakValue}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekday vs Weekend Analysis */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">Weekday Pattern (Mon-Fri)</h4>
          <div className="text-xs text-gray-600">
            Average weekday peak:{' '}
            {Math.round(
              dayPeaks
                .filter(d => !['Saturday', 'Sunday'].includes(d.day))
                .reduce((sum, d) => sum + d.peakValue, 0) / 5
            )}
          </div>
        </div>
        <div className="bg-pink-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">Weekend Pattern (Sat-Sun)</h4>
          <div className="text-xs text-gray-600">
            Average weekend peak:{' '}
            {Math.round(
              dayPeaks
                .filter(d => ['Saturday', 'Sunday'].includes(d.day))
                .reduce((sum, d) => sum + d.peakValue, 0) / 2
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
