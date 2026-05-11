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
    const [animationStep, setAnimationStep] = useState('walking');

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationStep('ready');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const isReady = animationStep === 'ready';

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
                
                @keyframes bubbleFade {
                    0% { opacity: 0; transform: translate(-50%, -20px) scale(0.5); }
                    15% { opacity: 1; transform: translate(-50%, -40px) scale(1); }
                    85% { opacity: 1; transform: translate(-50%, -40px) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -20px) scale(0.5); }
                }

                .employee-slot {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 4px;
                    min-height: 32px;
                    width: 100%;
                }

                .speech-bubble {
                    position: absolute;
                    left: 50%;
                    background: white;
                    color: #333;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: bold;
                    white-space: nowrap;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    z-index: 12;
                    animation: bubbleFade 2s ease-in-out forwards;
                }

                .speech-bubble::after {
                    content: '';
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-width: 6px 6px 0;
                    border-style: solid;
                    border-color: white transparent transparent;
                }
            `}</style>

            {/* Фон */}
            <img
                src="/assets/background.png"
                alt="Background"
                style={{ width: '70%', display: 'block', margin: '0 auto', borderRadius: '20px', userSelect: 'none' }}
            />

            {/* МЕНЕДЖЕР С НАДПИСЬЮ */}
            {animationStep === 'walking' && (
                <div style={{
                    position: 'absolute',
                    zIndex: 10,
                    transform: 'translate(-50%, -50%)',
                    animation: 'managerWalk 2s linear forwards'
                }}>
                    <div className="speech-bubble">
                        Доброе утро! ☀️
                    </div>
                    <img
                        src="/assets/animated_cook.gif"
                        alt="Manager"
                        style={{ width: '60px', display: 'block' }}
                    />
                </div>
            )}

            {/* Отрисовка станций */}
            {Object.entries(stationPositions).map(([key, pos]) => {
                const isCounter = key === 'C';
                const isTS = key === 'TS';

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
                        <div className="employee-slot">
                            {isReady && isCounter && (
                                (processedEmployees[key] || []).map(empId => (
                                    <EmployeeIcon key={empId} employeeId={empId} />
                                ))
                            )}
                        </div>

                        {!isTS && (
                            <img
                                src={`/assets/stations/${pos.img}`}
                                alt={pos.name}
                                style={{ width: '100%', objectFit: 'contain', display: 'block' }}
                            />
                        )}

                        <div className="employee-slot">
                            {isReady && !isCounter && (
                                (processedEmployees[key] || []).map(empId => (
                                    <EmployeeIcon key={empId} employeeId={empId} />
                                ))
                            )}
                        </div>

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