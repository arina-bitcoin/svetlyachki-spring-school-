import { useMemo } from 'react'
import { useSimulationStore } from '../store/useSimulationStore'

export function useEmployeesByHour() {
  const { schedule, currentDateIndex, forecast, currentHour } = useSimulationStore()
  
  const currentDate = useMemo(() => {
    if (!forecast.length) return ''
    const uniqueDates = [...new Map(forecast.map(f => [f.date, f.date])).values()]
    return uniqueDates[currentDateIndex] || ''
  }, [forecast, currentDateIndex])
  
  const employeesByStation = useMemo(() => {
    if (!schedule.length || !currentDate) return { C: [], K: [], BVR: [], FF: [], TS: [] }
    
    const result = { C: [], K: [], BVR: [], FF: [], TS: [] }
    for (const shift of schedule) {
      if (shift.date === currentDate && shift.starttime <= currentHour && shift.finishtime > currentHour) {
        const station = shift.station_key
        if (result[station]) result[station].push(shift.employee_id)
      }
    }
    return result
  }, [schedule, currentDate, currentHour])
  
  return employeesByStation
}