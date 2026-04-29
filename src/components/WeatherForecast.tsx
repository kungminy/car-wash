'use client';

import { Sun, CloudSun, Cloud, CloudRain, Droplets } from 'lucide-react';
import { WeatherDay, WeatherCondition } from '@/types';

const iconMap: Record<WeatherCondition, React.ReactNode> = {
  sunny: <Sun className="w-6 h-6 text-amber-400" />,
  partly_cloudy: <CloudSun className="w-6 h-6 text-sky-400" />,
  cloudy: <Cloud className="w-6 h-6 text-slate-400" />,
  rainy: <CloudRain className="w-6 h-6 text-slate-500" />,
};

interface Props {
  forecast: WeatherDay[];
  optimalDate: string | null;
}

export default function WeatherForecast({ forecast, optimalDate }: Props) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-500 mb-3">5일 예보</h2>
      <div className="grid grid-cols-5 gap-2">
        {forecast.map((day) => {
          const isOptimal = day.date === optimalDate;
          const isRainy = day.rainProbability > 40;

          return (
            <div
              key={day.date}
              className={[
                'flex flex-col items-center gap-1.5 rounded-xl py-3 px-1 border transition-all',
                isOptimal
                  ? 'ring-2 ring-sky-400 bg-sky-50 border-sky-200'
                  : 'bg-white border-slate-100',
                isRainy && !isOptimal ? 'opacity-50' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'text-xs font-semibold',
                  isOptimal ? 'text-sky-600' : 'text-slate-500',
                ].join(' ')}
              >
                {day.dayLabel}
                {isOptimal && <span className="ml-0.5">★</span>}
              </span>
              {iconMap[day.condition]}
              <span className={['text-xs font-medium', isOptimal ? 'text-slate-700' : 'text-slate-600'].join(' ')}>
                {day.temperature}°
              </span>
              <div className="flex items-center gap-0.5">
                <Droplets className="w-3 h-3 text-sky-400" />
                <span className={['text-xs', isRainy ? 'text-red-500 font-semibold' : 'text-slate-400'].join(' ')}>
                  {day.rainProbability}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
