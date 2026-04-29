import { create } from 'zustand';
import { WeatherDay, OptimalDayResult } from '@/types';
import { mockForecast } from '@/lib/mockWeather';
import { findOptimalDay } from '@/lib/weatherScore';

interface WeatherStore {
  forecast: WeatherDay[];
  optimalDay: OptimalDayResult | null;
  init: () => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  forecast: [],
  optimalDay: null,
  init: () => {
    const optimalDay = findOptimalDay(mockForecast);
    set({ forecast: mockForecast, optimalDay });
  },
}));
