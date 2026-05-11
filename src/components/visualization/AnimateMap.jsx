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
                alt="Background"
                style={{
                    width: '70%',
                    display: 'block',
                    margin: '0 auto',
                    borderRadius: '20px',
                    userSelect: 'none'
                }}
            />

            {/* Станции поверх фона */}
            {Object.entries(stationPositions).map(([key, pos]) => {
                const isCounter = key === 'C';
                const isTS = key === 'TS'; // Новое условие

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
                        {/* 1. Человечки СВЕРХУ для прилавка */}
                        {isCounter && employeesBlock}

                        {/* Картинка мебели: НЕ отображаем, если это TS */}
                        {!isTS && (
                            <img
                                src={`/assets/stations/${pos.img}`}
                                alt={pos.name}
                                style={{ width: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                            />
                        )}

                        {/* 2. Человечки СНИЗУ для остальных станций */}
                        {!isCounter && employeesBlock}

                        {/* Мини-индикатор количества */}
                        <div style={{
                            fontSize: '0.7rem',
                            background: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            borderRadius: '12px',
                            padding: '2px 6px',
                            marginTop: '4px',
                            display: 'inline-block'
                        }}>
                            {(employeesByStation[key] || []).length}
                        </div>
                    </div>
                );
            })} {/* <--- Вот эта скобка (90 строка) теперь должна закрываться корректно */}
        </div>
    );
}