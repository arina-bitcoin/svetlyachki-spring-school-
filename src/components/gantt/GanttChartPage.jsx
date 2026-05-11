import { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';

const stationColors = {
  C:   { bg: '#a8c5da', text: '#2c4a5a' },
  K:   { bg: '#b5d5b8', text: '#2a4a2c' },
  K2:  { bg: '#9dc4a0', text: '#243d26' },
  BVR: { bg: '#e8d5a8', text: '#5a4010' },
  FF:  { bg: '#e8c4a0', text: '#5a3010' },
  TS:  { bg: '#c8b8d8', text: '#3a2450' }
};

const stationNames = {
  C: 'Прилавок',
  K: 'Кухня',
  K2: 'Кухня 2',
  BVR: 'Напитки',
  FF: 'Картофель',
  TS: 'Зал'
};

const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

export function GanttChart({ employeeId }) {
  const { schedule, forecast } = useSimulationStore();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const uniqueDates = [...new Map(forecast.map(f => [f.date, f.date])).values()];
  const currentDate = uniqueDates[selectedDayIndex];
  const hours = Array.from({ length: 16 }, (_, i) => i + 7);

  const employeesWithShifts = [...new Set(
    schedule
      .filter(shift => shift.date === currentDate)
      .map(shift => shift.employee_id)
  )].sort((a, b) => a - b);

  const employeeScheduleMap = {};
  schedule.forEach(shift => {
    if (shift.date === currentDate) {
      if (!employeeScheduleMap[shift.employee_id]) {
        employeeScheduleMap[shift.employee_id] = {};
      }
      for (let hour = shift.starttime; hour < shift.finishtime; hour++) {
        employeeScheduleMap[shift.employee_id][hour] = shift.station_key;
      }
    }
  });

  return (
    <div style={{
      background: '#f7f4f0',
      borderRadius: '20px',
      padding: '24px',
      marginTop: '20px',
      boxShadow: '0 2px 16px rgba(60,45,30,0.07)'
    }}>
      {/* Шапка */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '600',
          color: '#3a3028',
          letterSpacing: '-0.3px'
        }}>
          Расписание сотрудников
        </h2>
        <div style={{
          fontSize: '13px',
          color: '#8a7e74',
          background: '#ede9e4',
          padding: '5px 12px',
          borderRadius: '20px'
        }}>
          {currentDate} · {employeesWithShifts.length} сотр.
        </div>
      </div>

      {/* Вкладки дней */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        background: '#ede9e4',
        padding: '6px',
        borderRadius: '14px',
        justifyContent: 'center'
      }}>
        {uniqueDates.map((date, idx) => (
          <button
            key={date}
            onClick={() => setSelectedDayIndex(idx)}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: idx === selectedDayIndex ? '600' : '400',
              background: idx === selectedDayIndex ? '#fff' : 'transparent',
              color: idx === selectedDayIndex ? '#3a3028' : '#8a7e74',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: idx === selectedDayIndex ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
              lineHeight: '1.4'
            }}
          >
            <div style={{ fontWeight: '600' }}>{daysOfWeek[idx]}</div>
            <div style={{ fontSize: '10px', opacity: 0.75 }}>{date.slice(5)}</div>
          </button>
        ))}
      </div>

      {employeesWithShifts.length === 0 ? (
        <div style={{
          padding: '60px',
          textAlign: 'center',
          background: '#ede9e4',
          borderRadius: '16px',
          color: '#8a7e74',
          fontSize: '15px'
        }}>
          В этот день нет работающих сотрудников
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '14px', display: 'flex', justifyContent: 'center' }}>
          <table style={{
            width: 'auto',
            borderCollapse: 'collapse',
            background: '#fff',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1px solid #e8e2db',
            tableLayout: 'auto'
          }}>
            <thead>
              <tr style={{ background: '#ede9e4', borderBottom: '1px solid #ddd8d0' }}>
                <th style={{
                  padding: '10px 12px',
                  fontWeight: '600',
                  fontSize: '12px',
                  color: '#6a5e54',
                  textAlign: 'center',
                  borderRight: '1px solid #ddd8d0',
                  whiteSpace: 'nowrap'
                }}>
                  ID
                </th>
                {hours.map(hour => (
                  <th key={hour} style={{
                    padding: '10px 6px',
                    fontWeight: '500',
                    fontSize: '11px',
                    color: '#6a5e54',
                    textAlign: 'center',
                    borderRight: '1px solid #ddd8d0',
                    whiteSpace: 'nowrap'
                  }}>
                    {hour}:00
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employeesWithShifts.map((empId, idx) => {
                const scheduleForEmployee = employeeScheduleMap[empId] || {};
                const isSelected = empId === employeeId;
                const isEven = idx % 2 === 0;

                return (
                  <tr
                    key={empId}
                    style={{
                      borderBottom: '1px solid #f0ebe4',
                      backgroundColor: isSelected ? '#edf5ee' : (isEven ? '#fff' : '#faf8f5')
                    }}
                  >
                    <td style={{
                      padding: '6px 10px',
                      textAlign: 'center',
                      fontWeight: isSelected ? '700' : '500',
                      borderRight: '1px solid #f0ebe4',
                      fontSize: '12px',
                      color: isSelected ? '#5a8a5c' : '#5a5048',
                      whiteSpace: 'nowrap'
                    }}>
                      {empId}{isSelected && <span style={{ marginLeft: '3px', fontSize: '10px' }}>✓</span>}
                    </td>
                    {hours.map(hour => {
                      const station = scheduleForEmployee[hour];
                      const colors = station ? stationColors[station] : null;
                      return (
                        <td
                          key={hour}
                          style={{
                            padding: '5px',
                            borderRight: '1px solid #f5f0ea',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{
                            background: colors ? colors.bg : '#f5f0ea',
                            borderRadius: '7px',
                            padding: '6px 4px',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: colors ? colors.text : '#c8c0b8',
                            cursor: station ? 'pointer' : 'default',
                            whiteSpace: 'nowrap'
                          }}
                          title={station ? stationNames[station] : ''}
                          >
                            {station ? station.slice(0, 2) : '—'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Легенда */}
      <div style={{
        marginTop: '18px',
        padding: '14px 18px',
        background: '#ede9e4',
        borderRadius: '14px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: '600', color: '#6a5e54', fontSize: '12px' }}>Станции:</span>
        {Object.entries(stationColors).map(([key, colors]) => (
          <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '14px',
              height: '14px',
              background: colors.bg,
              border: `1px solid ${colors.text}22`,
              borderRadius: '5px',
              display: 'inline-block'
            }}></span>
            <span style={{ fontSize: '11px', color: '#7a6e64' }}>{stationNames[key]}</span>
          </span>
        ))}
        <span style={{ width: '1px', height: '18px', background: '#ccc8c0', margin: '0 4px' }}></span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            background: '#edf5ee',
            border: '1px solid #b8d8ba',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#5a8a5c'
          }}>ID ✓</span>
          <span style={{ fontSize: '11px', color: '#7a6e64' }}>Выбранный сотрудник</span>
        </span>
      </div>
    </div>
  );
}