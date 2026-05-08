import { NextResponse } from 'next/server';
import { WeatherCondition, WeatherDay } from '@/types';
import { findOptimalDay } from '@/lib/weatherScore';
import { mockForecast } from '@/lib/mockWeather';

const SEOUL = {
  latitude: 37.5665,
  longitude: 126.978,
};

interface OpenMeteoResponse {
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    precipitation_probability_max?: number[];
  };
  hourly?: {
    time?: string[];
    relative_humidity_2m?: number[];
  };
}

function getCondition(code: number): WeatherCondition {
  if ([0, 1].includes(code)) return 'sunny';
  if ([2, 3, 45, 48].includes(code)) return code === 2 ? 'partly_cloudy' : 'cloudy';
  return 'rainy';
}

function getDayLabel(date: string, index: number): string {
  if (index === 0) return '오늘';
  if (index === 1) return '내일';

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[new Date(`${date}T00:00:00+09:00`).getDay()];
}

function getNoonHumidity(data: OpenMeteoResponse, date: string): number {
  const times = data.hourly?.time ?? [];
  const humidity = data.hourly?.relative_humidity_2m ?? [];
  const noonIndex = times.findIndex((time) => time === `${date}T12:00`);

  if (noonIndex >= 0 && typeof humidity[noonIndex] === 'number') {
    return Math.round(humidity[noonIndex]);
  }

  const dailyValues = times
    .map((time, index) => (time.startsWith(date) ? humidity[index] : null))
    .filter((value): value is number => typeof value === 'number');

  if (dailyValues.length === 0) return 60;
  return Math.round(dailyValues.reduce((sum, value) => sum + value, 0) / dailyValues.length);
}

function mapForecast(data: OpenMeteoResponse): WeatherDay[] {
  const dates = data.daily?.time ?? [];
  const codes = data.daily?.weather_code ?? [];
  const temperatures = data.daily?.temperature_2m_max ?? [];
  const rainProbabilities = data.daily?.precipitation_probability_max ?? [];

  return dates.slice(0, 7).map((date, index) => ({
    date,
    dayLabel: getDayLabel(date, index),
    condition: getCondition(codes[index] ?? 3),
    rainProbability: Math.round(rainProbabilities[index] ?? 0),
    temperature: Math.round(temperatures[index] ?? 0),
    humidity: getNoonHumidity(data, date),
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('lat') ?? String(SEOUL.latitude);
  const longitude = searchParams.get('lon') ?? String(SEOUL.longitude);

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('timezone', 'Asia/Seoul');
    url.searchParams.set('forecast_days', '7');
    url.searchParams.set(
      'daily',
      'weather_code,temperature_2m_max,precipitation_probability_max'
    );
    url.searchParams.set('hourly', 'relative_humidity_2m');

    const response = await fetch(url, { next: { revalidate: 60 * 30 } });

    if (!response.ok) {
      throw new Error(`Open-Meteo request failed: ${response.status}`);
    }

    const data = (await response.json()) as OpenMeteoResponse;
    const forecast = mapForecast(data);
    const optimalDay = findOptimalDay(forecast);

    return NextResponse.json({
      source: 'open-meteo',
      location: { name: '서울', latitude, longitude },
      forecast,
      optimalDay,
    });
  } catch {
    return NextResponse.json({
      source: 'fallback',
      location: { name: '서울', latitude, longitude },
      forecast: mockForecast,
      optimalDay: findOptimalDay(mockForecast),
    });
  }
}
