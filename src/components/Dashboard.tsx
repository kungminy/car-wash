'use client';

import { useEffect, useState } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import { useSupplyStore } from '@/store/supplyStore';
import { generatePlan } from '@/lib/washPlanEngine';
import { WashIntensity } from '@/types';
import TodayWeatherCard from './TodayWeatherCard';
import WeatherForecast from './WeatherForecast';
import OptimalDayBanner, { OptimalDayBannerEmpty } from './OptimalDayBanner';
import IntensitySelector from './IntensitySelector';
import WashPlanView from './WashPlanView';
import Link from 'next/link';
import { FlaskConical } from 'lucide-react';

export default function Dashboard() {
  const { forecast, optimalDay, init, isLoading, error } = useWeatherStore();
  const { supplies } = useSupplyStore();
  const [intensity, setIntensity] = useState<WashIntensity>('light');

  useEffect(() => {
    init();
  }, [init]);

  const today = forecast[0];
  const plan = generatePlan(supplies, intensity);
  const hasSupplies = supplies.length > 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* 날씨 */}
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
        <WeatherForecast forecast={forecast} optimalDate={optimalDay?.day.date ?? null} />
      )}

      {optimalDay ? (
        <OptimalDayBanner optimalDay={optimalDay} />
      ) : forecast.length > 0 ? (
        <OptimalDayBannerEmpty />
      ) : null}

      <div className="border-t border-slate-200 pt-6 flex flex-col gap-5">
        {/* 용품 없을 때 안내 */}
        {!hasSupplies && (
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
            <FlaskConical className="w-10 h-10 text-sky-400" />
            <div>
              <p className="font-bold text-slate-800">보유 용품을 먼저 등록해주세요</p>
              <p className="text-sm text-slate-500 mt-1">
                내 용품을 등록하면 그에 맞는 세차 플랜을 만들어드려요
              </p>
            </div>
            <Link
              href="/supplies"
              className="bg-sky-500 text-white text-sm font-semibold rounded-xl px-5 py-2.5"
            >
              용품 등록하러 가기
            </Link>
          </div>
        )}

        {/* 강도 선택 */}
        <IntensitySelector value={intensity} onChange={setIntensity} />

        {/* 플랜 */}
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-3">오늘의 세차 플랜</h2>
          <WashPlanView plan={plan} />
        </div>
      </div>
    </main>
  );
}
