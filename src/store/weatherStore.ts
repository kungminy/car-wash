import { create } from 'zustand';
import { WeatherDay, OptimalDayResult } from '@/types';
import { mockForecast } from '@/lib/mockWeather';
import { findOptimalDay } from '@/lib/weatherScore';

interface WeatherStore {
  forecast: WeatherDay[];
  optimalDay: OptimalDayResult | null;
  source: 'open-meteo' | 'fallback';
  isLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  forecast: [],
  optimalDay: null,
  source: 'fallback',
  isLoading: false,
  error: null,
  init: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/weather');

      if (!response.ok) {
        throw new Error('날씨 정보를 불러오지 못했습니다.');
      }

      const data = (await response.json()) as {
        forecast: WeatherDay[];
        optimalDay: OptimalDayResult | null;
        source: 'open-meteo' | 'fallback';
      };

      set({
        forecast: data.forecast,
        optimalDay: data.optimalDay,
        source: data.source,
        isLoading: false,
      });
    } catch {
      const optimalDay = findOptimalDay(mockForecast);
      set({
        forecast: mockForecast,
        optimalDay,
        source: 'fallback',
        isLoading: false,
        error: '날씨 API 연결에 실패해 임시 데이터를 표시하고 있어요.',
      });
    }
  },
}));
