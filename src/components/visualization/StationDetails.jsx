export function StationDetails({ stationKey, employees, onClose }) {
  const stationNames = {
    C: 'Прилавок',
    K: 'Кухня',
    K2: 'Кухня 2',
    BVR: 'Напитки',
    FF: 'Картофель',
    TS: 'Зал'
  }
  
  return (
    <div className="station-details">
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#999'
        }}
      >
        ×
      </button>
      <h3>{stationNames[stationKey]}</h3>
      <h4>Сотрудники сейчас:</h4>
      <ul>
        {employees.length === 0 && <li>Нет сотрудников</li>}
        {employees.map(empId => <li key={empId}>ID: {empId}</li>)}
      </ul>
    </div>
  )
}