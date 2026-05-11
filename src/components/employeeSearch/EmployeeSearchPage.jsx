import { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { EmployeeScheduleTable } from './EmployeeScheduleTable';
import { EmployeeStats } from './EmployeeStats';

export function EmployeeSearchPage() {
  const { schedule } = useSimulationStore();
  const [searchId, setSearchId] = useState('');
  const [employeeId, setEmployeeId] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    const id = parseInt(searchId);
    if (isNaN(id)) {
      setError('Введите корректный ID сотрудника');
      return;
    }

    const employeeShifts = schedule.filter(s => s.employee_id === id);
    if (employeeShifts.length === 0) {
      setError(`Сотрудник с ID ${id} не найден`);
      setEmployeeId(null);
      return;
    }

    setError('');
    setEmployeeId(id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Поиск сотрудника</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="number"
          placeholder="Введите ID сотрудника (например, 101)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            padding: '12px 16px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            flex: 1,
            outline: 'none'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#2d3e40',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Найти
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#fee', 
          color: '#c33', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {employeeId && (
        <>
          <EmployeeStats employeeId={employeeId} />
          <EmployeeScheduleTable employeeId={employeeId} />
        </>
      )}
    </div>
  );
}