import { useEffect, useRef } from 'react'
import { useSimulationStore } from '../store/useSimulationStore'

export function useSimulationTimer() {
  const { isPlaying, speed, nextHour } = useSimulationStore()
  const intervalRef = useRef(null)
  
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        nextHour()
      }, speed)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed, nextHour])
}