import { useSimulationStore } from '../../store/useSimulationStore'
import { useSimulationTimer } from '../../hooks/useSimulationTimer'
import { useEmployeesByHour } from '../../hooks/useEmployeesByHour'
import { StationsGrid } from './StationsGrid'
import { AnimatedMap } from './AnimateMap'     
import { TimeControls } from './TimeControls'
import { TechnicalOverlay } from './TechnicalOverlay'
import { StationDetails } from './StationDetails'
import { useState, useEffect } from 'react'

export function VizPageContent() {
  useSimulationTimer()
  const { forecast, demand, currentDateIndex, currentHour, selectedStationKey, setSelectedStationKey } = useSimulationStore()
  const employeesByStation = useEmployeesByHour()

  const [requiredByStation, setRequiredByStation] = useState({
    C: 0, K: 0, K2: 0, BVR: 0, FF: 0, TS: 0
  })

  // Используем demand.json для расчёта required
  useEffect(() => {
    if (!demand.length || !forecast.length) {
      console.log('⚠️ demand или forecast пуст, required не рассчитан')
      return
    }
    
    // Получаем уникальные даты из forecast
    const uniqueDates = [...new Map(forecast.map(f => [f.date, f.date])).values()]
    const currentDate = uniqueDates[currentDateIndex]
    
    // Ищем требуемое количество сотрудников для текущей даты и часа
    const demandForHour = demand.filter(d => d.date === currentDate && d.hour === currentHour)
    
    console.log('demandForHour для', currentDate, currentHour + ':00', ':', demandForHour)
    
    const newRequired = { C: 0, K: 0, K2: 0, BVR: 0, FF: 0, TS: 0 }
    demandForHour.forEach(d => {
      if (newRequired.hasOwnProperty(d.station_key)) {
        newRequired[d.station_key] = d.required
      }
    })
    
    setRequiredByStation(newRequired)
  }, [demand, forecast, currentDateIndex, currentHour])

  const selectedStationEmployees = selectedStationKey ? (employeesByStation[selectedStationKey] || []) : []

  return (
    <div>
      <TimeControls />
      {/* <TechnicalOverlay 
        employeesByStation={employeesByStation}
        requiredByStation={requiredByStation}
      /> */}
      <StationsGrid 
        employeesByStation={employeesByStation}
        requiredByStation={requiredByStation}
        onSelectStation={setSelectedStationKey}
      />
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