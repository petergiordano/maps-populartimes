import { useState, useRef } from 'react'
import type { Facility } from '../types/Facility'
import WeeklyHeatmap from './visualizations/WeeklyHeatmap'
import DayComparisonChart from './visualizations/DayComparisonChart'
import SummaryDashboard from './visualizations/SummaryDashboard'
import CompetitiveComparison from './visualizations/CompetitiveComparison'
import { exportAsCSV, exportAsPNG, exportAsPDF, exportAsJSON } from '../utils/exportUtils'

interface FacilityModalProps {
  facility: Facility
  allFacilities: Facility[]
  onClose: () => void
}

type TabType = 'heatmap' | 'daycomparison' | 'summary' | 'competitive'

export default function FacilityModal({ facility, allFacilities, onClose }: FacilityModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('heatmap')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const tabContentRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: 'heatmap' as TabType, label: 'Weekly Heatmap', icon: '📊' },
    { id: 'daycomparison' as TabType, label: 'Day Comparison', icon: '📈' },
    { id: 'summary' as TabType, label: 'Summary', icon: '📋' },
    { id: 'competitive' as TabType, label: 'Compare', icon: '⚔️' },
  ]

  const handleExportCSV = async () => {
    setIsExporting(true)
    setShowExportMenu(false)
    try {
      await exportAsCSV(facility)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export CSV. Please try again.')
    }
    setIsExporting(false)
  }

  const handleExportPNG = async () => {
    setIsExporting(true)
    setShowExportMenu(false)
    try {
      if (tabContentRef.current) {
        const tabName = tabs.find(t => t.id === activeTab)?.label || activeTab
        await exportAsPNG('modal-tab-content', facility.name, tabName)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export PNG. Please try again.')
    }
    setIsExporting(false)
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    setShowExportMenu(false)
    try {
      const tabElements = tabs.map(tab => ({
        id: `tab-${tab.id}`,
        name: tab.label
      }))
      await exportAsPDF(facility, tabElements)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export PDF. Please try again.')
    }
    setIsExporting(false)
  }

  const handleExportJSON = async () => {
    setIsExporting(true)
    setShowExportMenu(false)
    try {
      await exportAsJSON(facility)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export JSON. Please try again.')
    }
    setIsExporting(false)
  }

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
        <div id="modal-tab-content" ref={tabContentRef} className="flex-1 overflow-y-auto p-6">
          <div id="tab-heatmap" style={{ display: activeTab === 'heatmap' ? 'block' : 'none' }}>
            {activeTab === 'heatmap' && <WeeklyHeatmap facility={facility} />}
          </div>
          <div id="tab-daycomparison" style={{ display: activeTab === 'daycomparison' ? 'block' : 'none' }}>
            {activeTab === 'daycomparison' && <DayComparisonChart facility={facility} />}
          </div>
          <div id="tab-summary" style={{ display: activeTab === 'summary' ? 'block' : 'none' }}>
            {activeTab === 'summary' && <SummaryDashboard facility={facility} />}
          </div>
          <div id="tab-competitive" style={{ display: activeTab === 'competitive' ? 'block' : 'none' }}>
            {activeTab === 'competitive' && (
              <CompetitiveComparison facility={facility} allFacilities={allFacilities} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-2 ${
                  isExporting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                📥 Export
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showExportMenu && !isExporting && (
                <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-lg">📊</span>
                    <div>
                      <div className="font-medium">CSV/Excel Data</div>
                      <div className="text-xs text-gray-500">Download spreadsheet</div>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPNG}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-lg">🖼️</span>
                    <div>
                      <div className="font-medium">PNG Image</div>
                      <div className="text-xs text-gray-500">Current tab screenshot</div>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-lg">📄</span>
                    <div>
                      <div className="font-medium">PDF Report</div>
                      <div className="text-xs text-gray-500">All tabs combined</div>
                    </div>
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-lg">💾</span>
                    <div>
                      <div className="font-medium">JSON Data</div>
                      <div className="text-xs text-gray-500">Raw data format</div>
                    </div>
                  </button>
                </div>
              )}

              {/* Click outside to close */}
              {showExportMenu && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setShowExportMenu(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
