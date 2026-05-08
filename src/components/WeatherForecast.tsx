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
    <section>
      <h2 className="text-sm font-semibold text-slate-500 mb-3">{forecast.length}일 예보</h2>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {forecast.map((day, index) => {
          const isOptimal = day.date === optimalDate;
          const isToday = index === 0;
          const isRainy = day.rainProbability > 40;

          return (
            <div
              key={day.date}
              className={[
                'min-w-0 flex flex-col items-center gap-2 rounded-xl px-1.5 py-3 border transition-all',
                isOptimal
                  ? 'bg-sky-50 border-sky-300'
                  : 'bg-white border-slate-100',
                isToday && !isOptimal ? 'border-slate-300' : '',
                isRainy && !isOptimal ? 'opacity-50' : '',
              ].join(' ')}
            >
              <div className="h-5 flex items-center justify-center">
                {isOptimal ? (
                  <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[11px] font-bold text-white">
                    최적
                  </span>
                ) : isToday ? (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                    오늘
                  </span>
                ) : null}
              </div>
              <span className="text-xs font-semibold text-slate-500">{day.dayLabel}</span>
              {iconMap[day.condition]}
              <span className="text-xs font-medium text-slate-700">
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
    </section>
  );
}
