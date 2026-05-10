import { StationCard } from './StationCard'

const stations = ['C', 'K', 'BVR', 'FF', 'TS']

export function StationsGrid({ employeesByStation, requiredByStation, onSelectStation }) {
  return (
    <div className="stations-grid">
      {stations.map(key => (
        <StationCard
          key={key}
          stationKey={key}
          employeeIds={employeesByStation[key] || []}
          requiredCount={requiredByStation[key] || 0}
          onSelect={onSelectStation}
        />
      ))}
    </div>
  )
}