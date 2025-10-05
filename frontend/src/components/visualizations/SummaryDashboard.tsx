import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import type { Facility } from '../../types/Facility'

interface SummaryDashboardProps {
  facility: Facility
}

export default function SummaryDashboard({ facility }: SummaryDashboardProps) {
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Calculate statistics
  const allHourlyData = facility.populartimes.flatMap(day => day.data)
  const peakPopularity = Math.max(...allHourlyData)
  const avgPopularity = Math.round(allHourlyData.reduce((sum, val) => sum + val, 0) / allHourlyData.length)

  // Find peak time
  let peakDay = ''
  let peakHour = 0
  facility.populartimes.forEach(dayData => {
    const dayPeak = Math.max(...dayData.data)
    if (dayPeak === peakPopularity) {
      peakDay = dayData.name
      peakHour = dayData.data.indexOf(dayPeak)
    }
  })

  // Peak hours by day
  const peakByDay = dayOrder.map(dayName => {
    const dayData = facility.populartimes.find(d => d.name === dayName)
    return {
      day: dayName.slice(0, 3),
      peak: dayData ? Math.max(...dayData.data) : 0,
    }
  })

  // Weekday vs Weekend
  const weekdayAvg = Math.round(
    facility.populartimes
      .filter(d => !['Saturday', 'Sunday'].includes(d.name))
      .flatMap(d => d.data)
      .reduce((sum, val) => sum + val, 0) / (5 * 24)
  )
  const weekendAvg = Math.round(
    facility.populartimes
      .filter(d => ['Saturday', 'Sunday'].includes(d.name))
      .flatMap(d => d.data)
      .reduce((sum, val) => sum + val, 0) / (2 * 24)
  )

  const weekdayWeekendData = [
    { category: 'Weekday', avg: weekdayAvg },
    { category: 'Weekend', avg: weekendAvg },
  ]

  // Average hourly pattern across all days
  const avgHourlyPattern = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    avg: Math.round(
      facility.populartimes.reduce((sum, day) => sum + day.data[hour], 0) / facility.populartimes.length
    ),
  }))

  // Busiest day
  const busiestDay = dayOrder.reduce((prev, curr) => {
    const prevData = facility.populartimes.find(d => d.name === prev)
    const currData = facility.populartimes.find(d => d.name === curr)
    const prevSum = prevData ? prevData.data.reduce((a, b) => a + b, 0) : 0
    const currSum = currData ? currData.data.reduce((a, b) => a + b, 0) : 0
    return currSum > prevSum ? curr : prev
  })

  return (
    <div className="w-full space-y-6">
      <h3 className="text-lg font-semibold">Facility Summary Dashboard</h3>

      {/* Statistics Table */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
        <h4 className="font-semibold mb-4">Key Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Rating</div>
            <div className="text-2xl font-bold text-blue-600">
              {facility.rating ? `⭐ ${facility.rating}` : 'N/A'}
            </div>
            {facility.rating_n && (
              <div className="text-xs text-gray-500">{facility.rating_n} reviews</div>
            )}
          </div>
          <div>
            <div className="text-sm text-gray-600">Peak Popularity</div>
            <div className="text-2xl font-bold text-red-600">{peakPopularity}</div>
            <div className="text-xs text-gray-500">
              {peakDay} at {peakHour}:00
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Avg Popularity</div>
            <div className="text-2xl font-bold text-green-600">{avgPopularity}</div>
            <div className="text-xs text-gray-500">Across all hours</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Busiest Day</div>
            <div className="text-2xl font-bold text-purple-600">{busiestDay}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Weekday Avg</div>
            <div className="text-2xl font-bold text-blue-600">{weekdayAvg}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Weekend Avg</div>
            <div className="text-2xl font-bold text-pink-600">{weekendAvg}</div>
          </div>
        </div>
      </div>

      {/* Two-column layout for charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekday vs Weekend */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-3">Weekday vs. Weekend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekdayWeekendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="avg" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak by Day */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-3">Peak Popularity by Day</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={peakByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="peak" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average Daily Pattern */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-3">Average Daily Pattern</h4>
        <p className="text-xs text-gray-600 mb-3">
          Mean popularity across all days of the week
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={avgHourlyPattern}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              tickFormatter={(hour) => `${hour}:00`}
              label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
            />
            <YAxis domain={[0, 100]} label={{ value: 'Avg Popularity', angle: -90, position: 'insideLeft' }} />
            <Tooltip labelFormatter={(hour) => `${hour}:00`} />
            <Line type="monotone" dataKey="avg" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Heatmap */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-3">Weekly Overview (Compact Heatmap)</h4>
        <div className="space-y-1">
          {facility.populartimes
            .sort((a, b) => dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name))
            .map(dayData => (
              <div key={dayData.name} className="flex items-center gap-2">
                <div className="w-20 text-xs font-medium text-gray-600">{dayData.name.slice(0, 3)}</div>
                <div className="flex-1 flex gap-0.5">
                  {dayData.data.map((value, hour) => {
                    const getColor = (val: number) => {
                      if (val === 0) return '#f3f4f6'
                      if (val < 25) return '#fef3c7'
                      if (val < 50) return '#fed7aa'
                      if (val < 75) return '#fca5a5'
                      return '#dc2626'
                    }
                    return (
                      <div
                        key={hour}
                        className="flex-1 h-4"
                        style={{ backgroundColor: getColor(value) }}
                        title={`${dayData.name} ${hour}:00 - ${value}`}
                      ></div>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
