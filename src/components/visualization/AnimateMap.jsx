import { useState, useEffect } from 'react';
import { EmployeeIcon } from './EmployeeIcon';
import { stationPositions } from '../../utils/stationPositions';
import { useSimulationStore } from '../../store/useSimulationStore';

// Константы для путей, чтобы не дублировать
const MANAGER_PATH = {
    start: { top: '62%', left: '69%' },
    end: { top: '69%', left: '50%' }
};

export function AnimatedMap({ employeesByStation }) {
    const { setSelectedStationKey } = useSimulationStore();

    // Состояния для этапов анимации
    const [animationStep, setAnimationStep] = useState('manager_walking'); // 'manager_walking' | 'banner' | 'ready'

    useEffect(() => {
        // 1. Время на проход менеджера (например, 2 секунды)
        const walkTimer = setTimeout(() => {
            setAnimationStep('banner');
        }, 2000);

        // 2. Время показа надписи "Ресторан открыт" (еще 1.5 секунды)
        const bannerTimer = setTimeout(() => {
            setAnimationStep('ready');
        }, 3500);

        return () => {
            clearTimeout(walkTimer);
            clearTimeout(bannerTimer);
        };
    }, []);

    return (
        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', overflow: 'hidden' }}>
            {/* Стили для анимаций */}
            <style>{`
                @keyframes managerWalk {
                    from { top: ${MANAGER_PATH.start.top}; left: ${MANAGER_PATH.start.left}; }
                    to { top: ${MANAGER_PATH.end.top}; left: ${MANAGER_PATH.end.left}; }
                }
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -60%); }
                    20% { opacity: 1; transform: translate(-50%, -50%); }
                    80% { opacity: 1; transform: translate(-50%, -50%); }
                    100% { opacity: 0; transform: translate(-50%, -40%); }
                }
            `}</style>

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

            {/* МЕНЕДЖЕР (отображается только на первом этапе) */}
            {animationStep === 'manager_walking' && (
                <img
                    src="/assets/animated_cook.gif"
                    alt="Manager"
                    style={{
                        position: 'absolute',
                        width: '60px',
                        zIndex: 10,
                        animation: 'managerWalk 2s linear forwards'
                    }}
                />
            )}

            {/* НАДПИСЬ "РЕСТОРАН ОТКРЫТ" */}
            {animationStep === 'banner' && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#0F5A3C', // Цвет бренда
                    color: 'white',
                    padding: '20px 40px',
                    borderRadius: '50px',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                    zIndex: 20,
                    animation: 'fadeInOut 1.5s ease-in-out forwards'
                }}>
                    РЕСТОРАН ОТКРЫТ
                </div>
            )}

            {/* Станции поверх фона */}
            {Object.entries(stationPositions).map(([key, pos]) => {
                const isCounter = key === 'C';
                const isTS = key === 'TS';

                // Сотрудники отображаются ТОЛЬКО после того, как ресторан открылся
                const showEmployees = animationStep === 'ready';

                const employeesBlock = showEmployees && (
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

                        {/* Картинка мебели: отображается всегда */}
                        {!isTS && (
                            <img
                                src={`/assets/stations/${pos.img}`}
                                alt={pos.name}
                                style={{ width: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                            />
                        )}

                        {/* 2. Человечки СНИЗУ для остальных станций */}
                        {!isCounter && employeesBlock}

                        {/* Мини-индикатор количества (тоже только после открытия) */}
                        {showEmployees && (
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
                        )}
                    </div>
                );
            })}
        </div>
    );
}