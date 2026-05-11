import { EmployeeIcon } from './EmployeeIcon'
import { ProgressBar } from '../common/ProgressBar'

const stationNames = {
  C: 'Прилавок',
  K: 'Кухня',
  K2: 'Кухня',
  BVR: 'Напитки',
  FF: 'Картофель',
  TS: 'Зал'
}

const stationIcons = {
  C: 'counter2.png',
  K: 'kitchen2.png',
  K2: 'kitchen.png',
  BVR: 'cup2.png',
  FF: 'fries2.png',
  TS: 'hall.png'
}

export function StationCard({ stationKey, employeeIds, requiredCount, onSelect }) {
  const actualCount = employeeIds.length
  return (
    <div className="station-card" onClick={() => onSelect(stationKey)}>
       <img
        src={`/assets/stations/${stationIcons[stationKey]}`}
        alt={stationNames[stationKey]}
      />
      <ProgressBar actual={actualCount} required={requiredCount} />
      <div style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '4px' }}>
        {actualCount} / {requiredCount}
      </div>
    </div>
  )
}