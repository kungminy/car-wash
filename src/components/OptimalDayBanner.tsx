'use client';

import { Sun, CloudSun, Cloud, CloudRain, Droplets, Thermometer } from 'lucide-react';
import { OptimalDayResult, WeatherCondition } from '@/types';
import { getScoreMessage, getDaysFromNowLabel } from '@/lib/weatherScore';

const weatherIcons: Record<WeatherCondition, React.ReactNode> = {
  sunny: <Sun className="w-16 h-16 text-amber-400" />,
  partly_cloudy: <CloudSun className="w-16 h-16 text-sky-400" />,
  cloudy: <Cloud className="w-16 h-16 text-slate-400" />,
  rainy: <CloudRain className="w-16 h-16 text-slate-500" />,
};

const weatherLabels: Record<WeatherCondition, string> = {
  sunny: '맑음',
  partly_cloudy: '구름 조금',
  cloudy: '흐림',
  rainy: '비',
};

function formatDateKorean(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number);
  return `${month}월 ${day}일`;
}

function getDayOfWeekKorean(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const d = new Date(dateStr);
  return days[d.getDay()] + '요일';
}

interface Props {
  optimalDay: OptimalDayResult;
}

export default function OptimalDayBanner({ optimalDay }: Props) {
  const { day, score, daysFromNow } = optimalDay;

  return (
    <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 rounded-2xl p-6 border border-sky-100 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full mb-3">
            ⭐ 세차 최적일
          </span>
          <p className="text-sm font-medium text-sky-600">{getDaysFromNowLabel(daysFromNow)}</p>
          <div className="mt-1">
            <span className="text-3xl font-bold text-slate-800 mr-2">
              {getDayOfWeekKorean(day.date)}
            </span>
            <span className="text-xl font-semibold text-slate-500">
              {formatDateKorean(day.date)}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{weatherLabels[day.condition]}</p>
        </div>
        <div className="flex-shrink-0 p-2">
          {weatherIcons[day.condition]}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 bg-white/70 rounded-xl px-3 py-2">
          <Droplets className="w-4 h-4 text-sky-500" />
          <span className="text-sm font-semibold text-sky-700">강수확률 {day.rainProbability}%</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/70 rounded-xl px-3 py-2">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-slate-700">{day.temperature}℃</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/70 rounded-xl px-3 py-2">
          <Droplets className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-600">습도 {day.humidity}%</span>
        </div>
      </div>

      <div className="bg-sky-500 rounded-xl px-4 py-3 flex items-center justify-between">
        <p className="text-white font-semibold text-sm">{getScoreMessage(score)}</p>
        <div className="flex items-center gap-1.5">
          <div className="text-white/70 text-xs">최적 점수</div>
          <div className="bg-white/20 rounded-lg px-2 py-0.5">
            <span className="text-white font-bold text-sm">{score}</span>
            <span className="text-white/70 text-xs">/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OptimalDayBannerEmpty() {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
      <CloudRain className="w-12 h-12 text-slate-400 mx-auto mb-3" />
      <p className="text-slate-600 font-medium">향후 5일간 세차하기 어려운 날씨예요.</p>
      <p className="text-slate-400 text-sm mt-1">비 소식이 없는 날을 기다려 보세요.</p>
    </div>
  );
}
