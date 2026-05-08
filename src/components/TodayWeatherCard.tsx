'use client';

import { Cloud, CloudRain, CloudSun, Droplets, Sun, Thermometer } from 'lucide-react';
import { WeatherCondition, WeatherDay } from '@/types';
import { calculateScore, getScoreMessage } from '@/lib/weatherScore';

const weatherIcons: Record<WeatherCondition, React.ReactNode> = {
  sunny: <Sun className="w-10 h-10 text-amber-400" />,
  partly_cloudy: <CloudSun className="w-10 h-10 text-sky-400" />,
  cloudy: <Cloud className="w-10 h-10 text-slate-400" />,
  rainy: <CloudRain className="w-10 h-10 text-slate-500" />,
};

const weatherLabels: Record<WeatherCondition, string> = {
  sunny: '맑음',
  partly_cloudy: '구름 조금',
  cloudy: '흐림',
  rainy: '비',
};

function formatFullDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00+09:00`);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Seoul',
  }).format(date);
}

export default function TodayWeatherCard({ day }: { day: WeatherDay }) {
  const score = calculateScore(day);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">오늘</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{formatFullDate(day.date)}</h1>
          <p className="mt-2 text-sm font-semibold text-slate-600">{getScoreMessage(score)}</p>
        </div>
        <div className="flex-shrink-0 text-center">
          {weatherIcons[day.condition]}
          <p className="mt-1 text-xs font-semibold text-slate-500">{weatherLabels[day.condition]}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <Droplets className="w-4 h-4 text-sky-500 mb-1" />
          <p className="text-xs text-slate-400">강수확률</p>
          <p className="text-sm font-bold text-slate-800">{day.rainProbability}%</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <Thermometer className="w-4 h-4 text-orange-400 mb-1" />
          <p className="text-xs text-slate-400">최고기온</p>
          <p className="text-sm font-bold text-slate-800">{day.temperature}℃</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <Droplets className="w-4 h-4 text-slate-400 mb-1" />
          <p className="text-xs text-slate-400">습도</p>
          <p className="text-sm font-bold text-slate-800">{day.humidity}%</p>
        </div>
      </div>
    </section>
  );
}
