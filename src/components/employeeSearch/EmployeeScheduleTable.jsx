import { useSimulationStore } from '../../store/useSimulationStore';

const stationNames = {
  C: 'Прилавок',
  K: 'Кухня',
  K2: 'Кухня 2',
  BVR: 'Напитки',
  FF: 'Картофель',
  TS: 'Зал'
};

const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

export function EmployeeScheduleTable({ employeeId }) {
  const { schedule, forecast } = useSimulationStore();
  
  const uniqueDates = [...new Map(forecast.map(f => [f.date, f.date])).values()];
  const employeeShifts = schedule.filter(s => s.employee_id === employeeId);
  
  const shiftMap = {};
  employeeShifts.forEach(shift => {
    if (!shiftMap[shift.date]) {
      shiftMap[shift.date] = {};
    }
    for (let hour = shift.starttime; hour < shift.finishtime; hour++) {
      shiftMap[shift.date][hour] = shift.station_key;
    }
  });

  const hours = Array.from({ length: 17 }, (_, i) => i + 7);

  return (
    <div style={{ marginTop: '30px', overflowX: 'auto' }}>
      <h2 style={{ marginBottom: '15px' }}>
        Расписание сотрудника #{employeeId}
      </h2>
      
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#2d3e40', color: 'white' }}>
            <th style={{ padding: '12px', border: '1px solid #3d5e60', minWidth: '60px' }}>Час</th>
            {uniqueDates.map((date, idx) => (
              <th key={date} style={{ padding: '12px', border: '1px solid #3d5e60', minWidth: '80px' }}>
                {daysOfWeek[idx]}<br/>{date.slice(5)}
              </th>
            ))}
           </tr>
        </thead>
        <tbody>
          {hours.map(hour => (
            <tr key={hour}>
              <td style={{ 
                padding: '10px', 
                border: '1px solid #ddd', 
                fontWeight: 'bold',
                backgroundColor: '#f5f5f0',
                textAlign: 'center'
              }}>
                {hour}:00
               </td>
              {uniqueDates.map(date => {
                const station = shiftMap[date]?.[hour];
                return (
                  <td key={date} style={{ 
                    padding: '10px', 
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    backgroundColor: station ? '#e8f5e9' : '#fafafa',
                    color: station ? '#2e7d32' : '#999'
                  }}>
                    {station ? stationNames[station] : '—'}
                   </td>
                );
              })}
             </tr>
          ))}
        </tbody>
       </table>
    </div>
  );
}