import { useState } from 'react'
import type { Facility } from '../types/Facility'
import WeeklyHeatmap from './visualizations/WeeklyHeatmap'
import DayComparisonChart from './visualizations/DayComparisonChart'
import SummaryDashboard from './visualizations/SummaryDashboard'
import CompetitiveComparison from './visualizations/CompetitiveComparison'

interface FacilityModalProps {
  facility: Facility
  allFacilities: Facility[]
  onClose: () => void
}

type TabType = 'heatmap' | 'daycomparison' | 'summary' | 'competitive'

export default function FacilityModal({ facility, allFacilities, onClose }: FacilityModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('heatmap')

  const tabs = [
    { id: 'heatmap' as TabType, label: 'Weekly Heatmap', icon: '📊' },
    { id: 'daycomparison' as TabType, label: 'Day Comparison', icon: '📈' },
    { id: 'summary' as TabType, label: 'Summary', icon: '📋' },
    { id: 'competitive' as TabType, label: 'Compare', icon: '⚔️' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{facility.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  facility.type === 'public'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {facility.type === 'public' ? 'Public' : 'Private'}
                </span>
                {facility.rating && (
                  <span className="text-sm text-gray-600">
                    ⭐ {facility.rating} ({facility.rating_n} reviews)
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'heatmap' && <WeeklyHeatmap facility={facility} />}
          {activeTab === 'daycomparison' && <DayComparisonChart facility={facility} />}
          {activeTab === 'summary' && <SummaryDashboard facility={facility} />}
          {activeTab === 'competitive' && (
            <CompetitiveComparison facility={facility} allFacilities={allFacilities} />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                📥 Export
              </button>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                🔗 Share
              </button>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                📝 Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
