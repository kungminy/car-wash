import { WeatherDay } from '@/types';

export const mockForecast: WeatherDay[] = [
  {
    date: '2026-04-29',
    dayLabel: '오늘',
    condition: 'partly_cloudy',
    rainProbability: 20,
    temperature: 18,
    humidity: 65,
  },
  {
    date: '2026-04-30',
    dayLabel: '내일',
    condition: 'sunny',
    rainProbability: 5,
    temperature: 22,
    humidity: 45,
  },
  {
    date: '2026-05-01',
    dayLabel: '금',
    condition: 'sunny',
    rainProbability: 0,
    temperature: 24,
    humidity: 40,
  },
  {
    date: '2026-05-02',
    dayLabel: '토',
    condition: 'cloudy',
    rainProbability: 35,
    temperature: 19,
    humidity: 70,
  },
  {
    date: '2026-05-03',
    dayLabel: '일',
    condition: 'rainy',
    rainProbability: 80,
    temperature: 16,
    humidity: 85,
  },
];
