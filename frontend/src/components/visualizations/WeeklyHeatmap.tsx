import { ResponsiveContainer, Cell } from 'recharts'
import type { Facility } from '../../types/Facility'

interface WeeklyHeatmapProps {
  facility: Facility
}

export default function WeeklyHeatmap({ facility }: WeeklyHeatmapProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Sort populartimes by day order
  const sortedDays = [...facility.populartimes].sort((a, b) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name)
  })

  // Color function based on popularity
  const getColor = (value: number) => {
    if (value === 0) return '#f3f4f6' // gray-100
    if (value < 25) return '#fef3c7' // yellow-100
    if (value < 50) return '#fed7aa' // orange-200
    if (value < 75) return '#fca5a5' // red-300
    return '#dc2626' // red-600
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Weekly Traffic Heatmap</h3>
      <p className="text-sm text-gray-600 mb-6">
        Color intensity shows popularity level (0-100). Hover for exact values.
      </p>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-24 flex-shrink-0"></div>
            <div className="flex-1 flex">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex-1 text-center text-xs text-gray-500 font-medium"
                  style={{ minWidth: '32px' }}
                >
                  {hour % 3 === 0 ? `${hour}:00` : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap grid */}
          {sortedDays.map((dayData) => (
            <div key={dayData.name} className="flex mb-1">
              {/* Day label */}
              <div className="w-24 flex-shrink-0 flex items-center">
                <span className="text-sm font-medium text-gray-700">{dayData.name}</span>
              </div>

              {/* Hour cells */}
              <div className="flex-1 flex gap-1">
                {dayData.data.map((value, hourIndex) => (
                  <div
                    key={hourIndex}
                    className="flex-1 h-10 rounded cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all group relative"
                    style={{
                      backgroundColor: getColor(value),
                      minWidth: '32px',
                    }}
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10 transition-opacity">
                      {dayData.name} {hourIndex}:00
                      <br />
                      Popularity: {value}
                    </div>

                    {/* Show value in cell if significant */}
                    {value >= 50 && (
                      <div className="flex items-center justify-center h-full text-xs font-semibold text-white">
                        {value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Popularity:</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#f3f4f6' }}></div>
                <span className="text-xs text-gray-600">0</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#fef3c7' }}></div>
                <span className="text-xs text-gray-600">25</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#fed7aa' }}></div>
                <span className="text-xs text-gray-600">50</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#fca5a5' }}></div>
                <span className="text-xs text-gray-600">75</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#dc2626' }}></div>
                <span className="text-xs text-gray-600">100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
