'use client';

import { useEffect } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import { useDeckStore } from '@/store/deckStore';
import TodayWeatherCard from './TodayWeatherCard';
import WeatherForecast from './WeatherForecast';
import RoutineGuide from './RoutineGuide';

export default function Dashboard() {
  const { forecast, optimalDay, init, isLoading, error } = useWeatherStore();
  const { myDeckProducts, initProducts } = useDeckStore();

  useEffect(() => {
    init();
    initProducts();
  }, [init, initProducts]);

  const selectedProducts = myDeckProducts();
  const today = forecast[0];

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <section>
        {isLoading && !today ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-sm text-slate-500">
            날씨 정보를 불러오는 중이에요.
          </div>
        ) : (
          today && <TodayWeatherCard day={today} />
        )}
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </section>

      {forecast.length > 0 && (
        <WeatherForecast
          forecast={forecast}
          optimalDate={optimalDay?.day.date ?? null}
        />
      )}

      <div className="border-t border-slate-200 pt-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">이렇게 세차해보세요</h2>
        <RoutineGuide products={selectedProducts} />
      </div>
    </main>
  );
}
