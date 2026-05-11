import { useSimulationStore } from '../../store/useSimulationStore';

export function EmployeeStats({ employeeId }) {
  const { schedule } = useSimulationStore();
  
  const employeeShifts = schedule.filter(s => s.employee_id === employeeId);
  
  // Общее количество часов
  const totalHours = employeeShifts.reduce((sum, shift) => {
    return sum + (shift.finishtime - shift.starttime);
  }, 0);
  
  // Количество смен
  const shiftsCount = employeeShifts.length;
  
  // Количество дней, когда работал
  const daysWorked = new Set(employeeShifts.map(s => s.date)).size;
  
  // Станции, на которых работал
  const stationsWorked = [...new Set(employeeShifts.map(s => s.station_key))];
  const stationNames = {
    C: 'Прилавок', K: 'Кухня', K2: 'Кухня 2', BVR: 'Напитки', FF: 'Картофель', TS: 'Зал'
  };
  
  // Проверка на переработку (больше 40 часов в неделю)
  const isOvertime = totalHours > 40;
  
  // Проверка на недоработку (меньше 3 часов в неделю)
  const isUnderwork = totalHours < 3;

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      marginBottom: '30px'
    }}>
      <StatCard 
        label="Общее часов" 
        value={totalHours}
        color="#2d3e40"
      />
      <StatCard 
        label="Количество смен" 
        value={shiftsCount}
        color="#2d3e40"
      />
      <StatCard 
        label="Дней работы" 
        value={daysWorked}
        color="#2d3e40"
      />
      <StatCard 
        label="Станции" 
        value={stationsWorked.map(s => stationNames[s]).join(', ')}
        color="#2d3e40"
      />
      
      {isOvertime && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          borderLeft: '4px solid #f39c12'
        }}>
          ⚠️ Внимание: переработка ({totalHours} часов при норме 40)
        </div>
      )}
      
      {isUnderwork && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          borderLeft: '4px solid #e74c3c'
        }}>
          ⚠️ Внимание: недоработка ({totalHours} часов при норме 40)
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
      minWidth: '120px'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: color }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{label}</div>
    </div>
  );
}