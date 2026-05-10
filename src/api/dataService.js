export async function loadForecast() {
  return getMockForecast();
}

export async function loadSchedule() {
  return getMockSchedule();
}

function getMockForecast() {
  const days = ['2026-05-09', '2026-05-10', '2026-05-11', '2026-05-12', '2026-05-13', '2026-05-14', '2026-05-15'];
  const forecast = [];
  for (let d of days) {
    for (let h = 7; h <= 23; h++) {
      let guests = 30 + Math.floor(Math.random() * 70);
      if (h >= 12 && h <= 14) guests += 40;
      if (h >= 18 && h <= 21) guests += 50;
      forecast.push({ date: d, hour: h, guests_count: guests });
    }
  }
  return forecast;
}

function getMockSchedule() {
  const employees = Array.from({ length: 40 }, (_, i) => i + 1);
  const stations = ['C', 'K', 'BVR', 'FF', 'TS'];
  const days = ['2026-05-09', '2026-05-10', '2026-05-11', '2026-05-12', '2026-05-13', '2026-05-14', '2026-05-15'];
  const schedule = [];
  employees.forEach(empId => {
    const workDays = [...days];
    for (let i = workDays.length; i > 5; i--) {
      const removeIdx = Math.floor(Math.random() * i);
      workDays.splice(removeIdx, 1);
    }
    workDays.forEach(date => {
      const station = stations[Math.floor(Math.random() * stations.length)];
      const startHour = 7 + Math.floor(Math.random() * 8);
      const finishHour = startHour + 8;
      if (finishHour <= 24) {
        schedule.push({
          employee_id: empId,
          station_key: station,
          date: date,
          starttime: startHour,
          finishtime: finishHour
        });
      }
    });
  });
  return schedule;
}
