import { create } from 'zustand';

export const useSimulationStore = create((set, get) => ({
  // Данные
  forecast: [],
  schedule: [],
  demand: [], 

  // Время
  currentDateIndex: 0,
  currentHour: 7,
  isPlaying: false,
  speed: 1500,

  // UI
  selectedStationKey: null,

  // Экшены
  setForecast: (forecast) => set({ forecast }),
  setSchedule: (schedule) => set({ schedule }),
  setDemand: (demand) => set({ demand }),
  setHour: (hour) => set({ currentHour: Math.min(23, Math.max(7, hour)) }),

  nextHour: () => {
    const { currentHour, currentDateIndex, forecast } = get();
    let nextHour = currentHour + 1;
    let nextDateIndex = currentDateIndex;

    if (nextHour > 23) {
      nextHour = 7;
      nextDateIndex = (currentDateIndex + 1) % 7;
    }
    set({ currentHour: nextHour, currentDateIndex: nextDateIndex });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setSpeed: (speed) => set({ speed }),

  setSelectedStationKey: (key) => set({ selectedStationKey: key }),

  getCurrentDate: () => {
    const { forecast, currentDateIndex } = get();
    if (!forecast.length) return '';
    const uniqueDates = [...new Map(forecast.map(f => [f.date, f.date])).values()];
    return uniqueDates[currentDateIndex] || '';
  },
}));