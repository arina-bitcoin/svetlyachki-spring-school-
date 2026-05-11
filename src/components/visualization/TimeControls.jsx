import { useState, useEffect } from 'react'
import { useSimulationStore } from '../../store/useSimulationStore'

export function TimeControls() {
    const { currentHour, setHour, isPlaying, togglePlay, getCurrentDate } = useSimulationStore()

    // Состояние для управления задержкой при первом старте
    const [isInitialDelayPassed, setIsInitialDelayPassed] = useState(false)

    // Запускаем таймер на 2 секунды только при первом рендере
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialDelayPassed(true)
        }, 2000)

        return () => clearTimeout(timer) // Очистка таймера при размонтировании
    }, [])

    const isOpen = currentHour === 7
    const isClosed = currentHour === 23

    // Плашка показывается, если:
    // 1. Прошло 2 секунды с запуска (для первого раза)
    // 2. И время соответствует 7:00 или 23:00
    const shouldShowBadge = isInitialDelayPassed && (isOpen || isClosed)

    return (
        <div className="time-controls-container">
            {shouldShowBadge && (
                <div style={{
                    backgroundColor: isOpen ? '#4CAF50' : '#f44336',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    marginBottom: '10px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    animation: 'fadeIn 0.4s ease-in-out' // Можно добавить простую CSS анимацию появления
                }}>
                    {isOpen ? 'Ресторан открыт' : 'Ресторан закрыт'}
                </div>
            )}

            <div className="time-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={togglePlay} style={{ cursor: 'pointer' }}>
                    {isPlaying ? '⏸️' : '▶️'}
                </button>

                <span>{getCurrentDate()}</span>

                <input
                    type="range"
                    min={7}
                    max={23}
                    value={currentHour}
                    onChange={(e) => setHour(parseInt(e.target.value))}
                />

                <span>{currentHour}:00</span>
            </div>

            {/* Добавим немного стилей для плавности появления */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    )
}