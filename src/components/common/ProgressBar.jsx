export function ProgressBar({ actual, required }) {
  const percent = required === 0 ? 0 : Math.min(100, (actual / required) * 100);
  let statusClass = 'progress-ok';
  if (actual < required) statusClass = 'progress-danger';
  else if (actual > required + 2) statusClass = 'progress-excess';
  else if (actual > required) statusClass = 'progress-warning';

  return (
    <div className="progress-bar">
      <div className={`progress-fill ${statusClass}`} style={{ width: `${percent}%` }} />
    </div>
  );
}