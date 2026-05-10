export async function loadForecast() {
  const response = await fetch('/data/forecast.json');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function loadSchedule() {
  const response = await fetch('/data/schedule.json');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}