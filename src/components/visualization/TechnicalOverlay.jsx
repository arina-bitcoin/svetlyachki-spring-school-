export function TechnicalOverlay({ employeesByStation, requiredByStation }) {
  const stations = [
    { key: 'C', name: 'Прилавок' },
    { key: 'K', name: 'Кухня' },
    { key: 'BVR', name: 'Напитки' },
    { key: 'FF', name: 'Картофель' },
    { key: 'TS', name: 'Зал' }
  ]

  const getStatusClass = (actual, required) => {
    if (actual < required) return 'status-danger'
    if (actual > required + 2) return 'status-excess'
    if (actual > required) return 'status-warning'
    return 'status-ok'
  }

  return (
    <div className="technical-overlay">
      <div className="station-status">
        {stations.map(s => {
          const actual = employeesByStation[s.key]?.length || 0
          const required = requiredByStation[s.key] || 0
          return (
            <div key={s.key} className={`status-item ${getStatusClass(actual, required)}`}>
              {s.name}: {actual} / {required}
            </div>
          )
        })}
      </div>
    </div>
  )
}