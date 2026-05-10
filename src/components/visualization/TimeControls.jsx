import { useSimulationStore } from '../../store/useSimulationStore'

export function TimeControls() {
  const { currentHour, setHour, isPlaying, togglePlay, getCurrentDate } = useSimulationStore()

  return (
    <div className="time-controls">
      <button onClick={togglePlay}>
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
  )
}