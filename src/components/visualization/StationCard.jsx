import { EmployeeIcon } from './EmployeeIcon'
import { ProgressBar } from '../common/ProgressBar'

const stationNames = {
  C: 'Прилавок',
  C2: 'Прилавок',
  K: 'Кухня',
  K2: 'Кухня',
  BVR: 'Напитки',
  FF: 'Картофель',
  TS: 'Зал'
}

const stationIcons = {
  C: 'counter.png',
  C2: 'counter.png',
  K: 'kitchen.png',
  K2: 'kitchen.png',
  BVR: 'drinks.png',
  FF: 'fries.png',
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
      <div className="employees-list">
        {employeeIds.map(empId => (
          <EmployeeIcon key={empId} employeeId={empId} />
        ))}
      </div>
      <ProgressBar actual={actualCount} required={requiredCount} />
      <div style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '4px' }}>
        {actualCount} / {requiredCount}
      </div>
    </div>
  )
}