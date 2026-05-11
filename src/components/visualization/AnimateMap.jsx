import { useState, useEffect, useMemo } from 'react';
import { EmployeeIcon } from './EmployeeIcon';
import { stationPositions } from '../../utils/stationPositions';
import { useSimulationStore } from '../../store/useSimulationStore';

const MANAGER_PATH = {
    start: { top: '62%', left: '69%' },
    end: { top: '69%', left: '50%' }
};

export function AnimatedMap({ employeesByStation }) {
    const { setSelectedStationKey } = useSimulationStore();

    // Теперь только два этапа: менеджер идет (walking) и все готово (ready)
    const [animationStep, setAnimationStep] = useState('walking');

    useEffect(() => {
        // Через 2 секунды (когда менеджер дойдет) включаем всё остальное
        const timer = setTimeout(() => {
            setAnimationStep('ready');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const isReady = animationStep === 'ready';

    // Логика перераспределения сотрудников K -> K2 (макс 3 на K)
    const processedEmployees = useMemo(() => {
        const result = { ...employeesByStation };
        const kEmployees = result['K'] || [];

        if (kEmployees.length > 3) {
            result['K'] = kEmployees.slice(0, 3);
            result['K2'] = [...(result['K2'] || []), ...kEmployees.slice(3)];
        }
        return result;
    }, [employeesByStation]);

    return (
        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
            <style>{`
                @keyframes managerWalk {
                    from { top: ${MANAGER_PATH.start.top}; left: ${MANAGER_PATH.start.left}; }
                    to { top: ${MANAGER_PATH.end.top}; left: ${MANAGER_PATH.end.left}; }
                }
                .employee-slot {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 4px;
                    min-height: 32px; /* Резервируем место, чтобы мебель не прыгала */
                    width: 100%;
                }
            `}</style>

            {/* Фон всегда на месте */}
            <img
                src="/assets/background.png"
                alt="Background"
                style={{ width: '70%', display: 'block', margin: '0 auto', borderRadius: '20px', userSelect: 'none' }}
            />

            {/* МЕНЕДЖЕР: исчезает, как только наступает этап 'ready' */}
            {animationStep === 'walking' && (
                <img
                    src="/assets/animated_cook.gif"
                    alt="Manager"
                    style={{
                        position: 'absolute',
                        width: '60px',
                        zIndex: 10,
                        transform: 'translate(-50%, -50%)',
                        animation: 'managerWalk 2s linear forwards'
                    }}
                />
            )}

            {/* Отрисовка станций */}
            {Object.entries(stationPositions).map(([key, pos]) => {
                const isCounter = key === 'C';
                const isTS = key === 'TS';

                // Считаем общую сумму для K (K + K2)
                let totalCount = (processedEmployees[key] || []).length;
                if (key === 'K') {
                    totalCount = (employeesByStation['K'] || []).length + (employeesByStation['K2'] || []).length;
                }

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
                        onClick={() => setSelectedStationKey(key === 'K2' ? 'K' : key)}
                    >
                        {/* Верхний слот для человечков */}
                        <div className="employee-slot">
                            {isReady && isCounter && (
                                (processedEmployees[key] || []).map(empId => (
                                    <EmployeeIcon key={empId} employeeId={empId} />
                                ))
                            )}
                        </div>

                        {/* Мебель */}
                        {!isTS && (
                            <img
                                src={`/assets/stations/${pos.img}`}
                                alt={pos.name}
                                style={{ width: '100%', objectFit: 'contain', display: 'block' }}
                            />
                        )}

                        {/* Нижний слот для человечков */}
                        <div className="employee-slot">
                            {isReady && !isCounter && (
                                (processedEmployees[key] || []).map(empId => (
                                    <EmployeeIcon key={empId} employeeId={empId} />
                                ))
                            )}
                        </div>

                        {/* Индикатор количества (скрыт на K2) */}
                        {isReady && key !== 'K2' && (
                            <div style={{
                                fontSize: '0.7rem',
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                borderRadius: '12px',
                                padding: '2px 6px',
                                marginTop: '4px',
                                display: 'inline-block'
                            }}>
                                {totalCount}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}