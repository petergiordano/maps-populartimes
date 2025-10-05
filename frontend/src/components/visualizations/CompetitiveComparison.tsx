import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Facility } from '../../types/Facility'

interface CompetitiveComparisonProps {
  facility: Facility
  allFacilities: Facility[]
}

export default function CompetitiveComparison({ facility, allFacilities }: CompetitiveComparisonProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const [selectedDay, setSelectedDay] = useState('Monday')
  const [selectedHour, setSelectedHour] = useState(12)

  // Get popularity for all facilities at selected time
  const comparisonData = allFacilities
    .map(f => {
      const dayData = f.populartimes.find(d => d.name === selectedDay)
      const popularity = dayData ? dayData.data[selectedHour] : 0
      return {
        name: f.name,
        popularity,
        isCurrent: f.id === facility.id,
        type: f.type,
      }
    })
    .sort((a, b) => b.popularity - a.popularity) // Sort by popularity descending

  // Find current facility's rank
  const currentRank = comparisonData.findIndex(d => d.isCurrent) + 1

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Competitive Comparison</h3>
      <p className="text-sm text-gray-600 mb-6">
        Compare {facility.name} against all facilities at a specific time. Select day and hour below.
      </p>

      {/* Time Picker Controls */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hour of Day</label>
          <select
            value={selectedHour}
            onChange={(e) => setSelectedHour(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {hours.map(hour => (
              <option key={hour} value={hour}>
                {hour}:00 - {hour}:59
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ranking Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Your Ranking at {selectedDay} {selectedHour}:00</div>
            <div className="text-3xl font-bold text-blue-600">
              #{currentRank} <span className="text-lg text-gray-500">of {comparisonData.length}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Your Popularity</div>
            <div className="text-3xl font-bold text-purple-600">
              {comparisonData.find(d => d.isCurrent)?.popularity || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-3">All Facilities Ranked</h4>
        <ResponsiveContainer width="100%" height={Math.max(400, comparisonData.length * 40)}>
          <BarChart
            data={comparisonData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" width={140} style={{ fontSize: '12px' }} />
            <Tooltip />
            <Bar dataKey="popularity" radius={[0, 4, 4, 0]}>
              {comparisonData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isCurrent
                      ? '#3b82f6' // blue for current facility
                      : entry.type === 'public'
                      ? '#10b981' // green for public
                      : '#8b5cf6' // purple for private
                  }
                  opacity={entry.isCurrent ? 1 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Your Facility</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981', opacity: 0.6 }}></div>
          <span>Public Courts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8b5cf6', opacity: 0.6 }}></div>
          <span>Private Clubs</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-600">Facilities Above You</div>
          <div className="text-2xl font-bold text-green-600">{currentRank - 1}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-600">Avg Competitor</div>
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(
              comparisonData.reduce((sum, d) => sum + d.popularity, 0) / comparisonData.length
            )}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-600">Gap to #1</div>
          <div className="text-2xl font-bold text-purple-600">
            {comparisonData[0].popularity - (comparisonData.find(d => d.isCurrent)?.popularity || 0)}
          </div>
        </div>
      </div>
    </div>
  )
}
