import { EmployeeIcon } from './EmployeeIcon';
import { stationPositions } from '../../utils/stationPositions';
import { useSimulationStore } from '../../store/useSimulationStore';

export function AnimatedMap({ employeesByStation }) {
  const { setSelectedStationKey } = useSimulationStore();

  return (
    <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Фон зала */}
      <img 
        src="/assets/background.png"
        style={{ 
            width: '70%',              // стало 80% от родительского контейнера
            display: 'block', 
            margin: '0 auto',          // центрируем по горизонтали
            borderRadius: '20px', 
            userSelect: 'none' 
        }}
        />

      {/* Станции поверх фона */}
        {Object.entries(stationPositions).map(([key, pos]) => {
            // Определяем, является ли эта станция прилавком или "C"
            const isCounter =  key === 'C';

            // Выносим блок с человечками в переменную, чтобы не дублировать код
            const employeesBlock = (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', margin: '8px 0' }}>
                    {(employeesByStation[key] || []).map(empId => (
                        <EmployeeIcon key={empId} employeeId={empId} />
                    ))}
                </div>
            );

            return (
                <div
                    key={key}
                    style={{
                        position: 'absolute',
                        top: pos.top,
                        left: pos.left,
                        transform: 'translate(-50%, -50%)',
                        width: pos.width,
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}
                    onClick={() => setSelectedStationKey(key)}
                >
                    {/* 1. Если это прилавок, рисуем человечков СВЕРХУ */}
                    {isCounter && employeesBlock}

                    {/* Картинка мебели */}
                    <img
                        src={`/assets/stations/${pos.img}`}
                        alt={pos.name}
                        style={{ width: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                    />

                    {/* 2. Если это НЕ прилавок, рисуем человечков СНИЗУ */}
                    {!isCounter && employeesBlock}

                    {/* Мини-индикатор количества всегда внизу */}
                    <div style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '12px', padding: '2px 6px', marginTop: '4px', display: 'inline-block' }}>
                        {(employeesByStation[key] || []).length}
                    </div>
                </div>
            );
        })}
    </div>
  );
}