import { useSimulationStore } from '../../store/useSimulationStore'
import { useSimulationTimer } from '../../hooks/useSimulationTimer'
import { useEmployeesByHour } from '../../hooks/useEmployeesByHour'
// import { StationsGrid } from './StationsGrid'
import { AnimatedMap } from './AnimateMap'     
import { TimeControls } from './TimeControls'
import { TechnicalOverlay } from './TechnicalOverlay'
import { StationDetails } from './StationDetails'
import { useState, useEffect } from 'react'

export function VizPageContent() {
  useSimulationTimer()
  const { forecast, currentDateIndex, currentHour, selectedStationKey, setSelectedStationKey } = useSimulationStore()
  const employeesByStation = useEmployeesByHour()

  const [requiredByStation, setRequiredByStation] = useState({
    C: 0, K: 0, BVR: 0, FF: 0, TS: 0
  })

  useEffect(() => {
    if (!forecast.length) return
    const uniqueDates = [...new Map(forecast.map(f => [f.date, f.date])).values()]
    const currentDate = uniqueDates[currentDateIndex]
    const currentData = forecast.find(f => f.date === currentDate && f.hour === currentHour)
    const guests = currentData?.guests_count || 0

    setRequiredByStation({
      C: Math.ceil(guests / 40),
      K: Math.ceil(guests / 35),
      BVR: Math.ceil(guests / 50),
      FF: Math.ceil(guests / 60),
      TS: Math.ceil(guests / 25)
    })
  }, [forecast, currentDateIndex, currentHour])

  const selectedStationEmployees = selectedStationKey ? (employeesByStation[selectedStationKey] || []) : []

  return (
    <div>
      <TimeControls />
      {/* <TechnicalOverlay 
        employeesByStation={employeesByStation}
        requiredByStation={requiredByStation}
      /> */}
      {/* <StationsGrid 
        employeesByStation={employeesByStation}
        requiredByStation={requiredByStation}
        onSelectStation={setSelectedStationKey}
      /> */}
      <AnimatedMap 
        employeesByStation={employeesByStation}
      />
      {selectedStationKey && (
        <StationDetails 
          stationKey={selectedStationKey}
          employees={selectedStationEmployees}
          onClose={() => setSelectedStationKey(null)}
        />
      )}
    </div>
  )
}