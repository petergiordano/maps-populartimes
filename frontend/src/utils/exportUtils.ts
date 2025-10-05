import Papa from 'papaparse'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import type { Facility } from '../types/Facility'

/**
 * Utility functions for exporting facility data in various formats
 */

/**
 * Download a file with the given content
 */
function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate a safe filename from facility name and current date
 */
function generateFilename(facilityName: string, suffix: string, extension: string): string {
  const safeName = facilityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  return `${safeName}-${suffix}-${date}.${extension}`
}

/**
 * Export facility data as CSV
 */
export async function exportAsCSV(facility: Facility): Promise<void> {
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

  // Weekday vs Weekend averages
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

  // Build CSV data
  const csvRows = []

  // Metadata section
  csvRows.push(['# Facility Information'])
  csvRows.push(['Facility Name', facility.name])
  csvRows.push(['Address', facility.formatted_address || facility.address])
  csvRows.push(['Type', facility.type === 'public' ? 'Public' : 'Private'])
  if (facility.rating) {
    csvRows.push(['Rating', facility.rating])
    csvRows.push(['Reviews', facility.rating_n || 0])
  }
  csvRows.push(['Google Place ID', facility.place_id])
  csvRows.push(['Data Fetched', facility.fetched_at])
  csvRows.push([]) // Empty row

  // Statistics section
  csvRows.push(['# Statistics'])
  csvRows.push(['Peak Hour', `${peakDay} ${peakHour}:00`])
  csvRows.push(['Peak Popularity', peakPopularity])
  csvRows.push(['Average Popularity', avgPopularity])
  csvRows.push(['Average Weekday', weekdayAvg])
  csvRows.push(['Average Weekend', weekendAvg])
  csvRows.push([]) // Empty row

  // Hourly data section
  csvRows.push(['# Hourly Popularity Data'])
  csvRows.push(['Day', 'Hour', 'Popularity (0-100)'])

  dayOrder.forEach(dayName => {
    const dayData = facility.populartimes.find(d => d.name === dayName)
    if (dayData) {
      dayData.data.forEach((popularity, hour) => {
        csvRows.push([dayName, hour, popularity])
      })
    }
  })

  // Convert to CSV string
  const csv = Papa.unparse(csvRows)

  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const filename = generateFilename(facility.name, 'popular-times', 'csv')
  downloadFile(blob, filename)
}

/**
 * Export current visible content as PNG
 */
export async function exportAsPNG(elementId: string, facilityName: string, tabName: string): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Element not found for PNG export')
    return
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution for better quality
      backgroundColor: '#ffffff',
      logging: false,
    })

    canvas.toBlob((blob) => {
      if (blob) {
        const filename = generateFilename(facilityName, tabName, 'png')
        downloadFile(blob, filename)
      }
    })
  } catch (error) {
    console.error('Failed to export PNG:', error)
    throw error
  }
}

/**
 * Export all tabs as multi-page PDF
 */
export async function exportAsPDF(facility: Facility, tabElements: { id: string; name: string }[]): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Cover page
    pdf.setFontSize(24)
    pdf.text(facility.name, pageWidth / 2, 40, { align: 'center' })

    pdf.setFontSize(12)
    pdf.text(`${facility.type === 'public' ? 'Public' : 'Private'} Facility`, pageWidth / 2, 50, { align: 'center' })

    if (facility.rating) {
      pdf.text(`★ ${facility.rating} (${facility.rating_n} reviews)`, pageWidth / 2, 60, { align: 'center' })
    }

    pdf.setFontSize(10)
    pdf.text(facility.formatted_address || facility.address, pageWidth / 2, 70, { align: 'center' })
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 80, { align: 'center' })

    // Add each tab as a new page
    for (let i = 0; i < tabElements.length; i++) {
      const { id, name } = tabElements[i]
      const element = document.getElementById(id)

      if (element) {
        const canvas = await html2canvas(element, {
          scale: 1.5,
          backgroundColor: '#ffffff',
          logging: false,
        })

        pdf.addPage()

        // Add tab name as header
        pdf.setFontSize(16)
        pdf.text(name, 10, 15)

        // Add canvas to PDF
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = pageWidth - 20 // 10mm margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Scale down if image is too tall for the page
        if (imgHeight > pageHeight - 30) {
          const scale = (pageHeight - 30) / imgHeight
          pdf.addImage(imgData, 'PNG', 10, 20, imgWidth * scale, imgHeight * scale)
        } else {
          pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight)
        }
      }
    }

    // Download
    const filename = generateFilename(facility.name, 'report', 'pdf')
    pdf.save(filename)
  } catch (error) {
    console.error('Failed to export PDF:', error)
    throw error
  }
}

/**
 * Export facility data as JSON
 */
export async function exportAsJSON(facility: Facility): Promise<void> {
  const json = JSON.stringify(facility, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const filename = generateFilename(facility.name, 'data', 'json')
  downloadFile(blob, filename)
}
