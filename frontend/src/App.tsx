import { useState, useEffect } from 'react'
import type { Facility, FacilityWithVisibility } from './types/Facility'
import MiniGraph from './components/MiniGraph'
import FacilityModal from './components/FacilityModal'
import './index.css'

type SortField = 'name' | 'type' | 'rating' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | null
type SortDirection = 'asc' | 'desc'

function App() {
  const [facilities, setFacilities] = useState<FacilityWithVisibility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)

  useEffect(() => {
    // Load facilities data
    fetch('/facilities.json')
      .then((res) => res.json())
      .then((data: Facility[]) => {
        // Add visibility flag to each facility
        const facilitiesWithVisibility = data.map((facility) => ({
          ...facility,
          visible: true,
        }))
        setFacilities(facilitiesWithVisibility)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const toggleFacility = (id: string) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f))
    )
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedFacilities = [...facilities].sort((a, b) => {
    if (!sortField) return 0

    let comparison = 0

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'type':
        comparison = a.type.localeCompare(b.type)
        break
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0)
        break
      case 'monday':
      case 'tuesday':
      case 'wednesday':
      case 'thursday':
      case 'friday':
      case 'saturday':
      case 'sunday': {
        // Find the day data and get peak popularity
        const dayName = sortField.charAt(0).toUpperCase() + sortField.slice(1)
        const aDayData = a.populartimes.find(d => d.name === dayName)
        const bDayData = b.populartimes.find(d => d.name === dayName)
        const aPeak = aDayData ? Math.max(...aDayData.data) : 0
        const bPeak = bDayData ? Math.max(...bDayData.data) : 0
        comparison = aPeak - bPeak
        break
      }
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Sort populartimes to ensure correct day order (Mon-Sun)
  const sortedPopularTimes = (facility: FacilityWithVisibility) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return [...facility.populartimes].sort((a, b) =>
      dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name)
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading facilities...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🏓 Pickleball Facility Traffic Comparison
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Compare popular times across {facilities.length} facilities in the Chicago area
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Facilities</div>
            <div className="text-3xl font-bold text-gray-900">{facilities.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Public Courts</div>
            <div className="text-3xl font-bold text-green-600">
              {facilities.filter((f) => f.type === 'public').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Private Clubs</div>
            <div className="text-3xl font-bold text-blue-600">
              {facilities.filter((f) => f.type === 'private').length}
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Facility
                      {sortField === 'name' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Type
                      {sortField === 'type' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Rating
                      {sortField === 'rating' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  {days.map((day, index) => {
                    const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index] as SortField
                    return (
                      <th
                        key={day}
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort(dayName)}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {day}
                          {sortField === dayName && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedFacilities.map((facility) => (
                    <tr
                      key={facility.id}
                      className={`hover:bg-gray-50 cursor-pointer ${!facility.visible ? 'opacity-40' : ''}`}
                      onClick={() => setSelectedFacility(facility)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={facility.visible}
                            onChange={(e) => {
                              e.stopPropagation()
                              toggleFacility(facility.id)
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 text-blue-600 rounded mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {facility.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <div className="text-sm">
                          {facility.type === 'public' ? (
                            <span className="text-green-600 font-medium">Public</span>
                          ) : (
                            <span className="text-blue-600 font-medium">Private</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <div className="text-sm">
                          {facility.rating && (
                            <span>
                              ⭐ {facility.rating} <span className="text-gray-500">({facility.rating_n})</span>
                            </span>
                          )}
                        </div>
                      </td>
                      {sortedPopularTimes(facility).map((day) => (
                        <td key={day.name} className="px-4 py-4">
                          <MiniGraph data={day.data} width={100} height={50} />
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Facility Detail Modal */}
      {selectedFacility && (
        <FacilityModal
          facility={selectedFacility}
          allFacilities={facilities}
          onClose={() => setSelectedFacility(null)}
        />
      )}
    </div>
  )
}

export default App
