export function StationDetails({ stationKey, employees, onClose }) {
  const stationNames = {
      C: 'Прилавок',
      C2: 'Прилавок',
      K: 'Кухня',
      K2: 'Кухня',
      BVR: 'Напитки',
      FF: 'Картофель',
      TS: 'Зал'
  }
  return (
    <div className="station-details">
      <button className="close-btn" onClick={onClose}>×</button>
      <h3>{stationNames[stationKey]}</h3>
      <h4>Сотрудники сейчас:</h4>
      <ul>
        {employees.length === 0 && <li>Нет сотрудников</li>}
        {employees.map(empId => <li key={empId}>ID: {empId}</li>)}
      </ul>
    </div>
  )
}