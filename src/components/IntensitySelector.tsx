'use client';

import { WashIntensity } from '@/types';
import { Zap, Waves } from 'lucide-react';

interface Props {
  value: WashIntensity;
  onChange: (v: WashIntensity) => void;
}

const OPTIONS: { value: WashIntensity; label: string; sub: string; time: string; icon: React.ElementType }[] = [
  {
    value: 'light',
    label: '라이트 세차',
    sub: '빠르게 가볍게',
    time: '20–40분',
    icon: Zap,
  },
  {
    value: 'deep',
    label: '딥 세차',
    sub: '꼼꼼하게 완벽하게',
    time: '1.5–3시간',
    icon: Waves,
  },
];

export default function IntensitySelector({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-base font-bold text-slate-800 mb-3">오늘 세차 강도를 선택하세요</h2>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={[
                'flex flex-col items-start gap-1.5 rounded-2xl border-2 p-4 text-left transition-all',
                isActive
                  ? 'border-sky-500 bg-sky-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-sky-200',
              ].join(' ')}
            >
              <div className={['rounded-xl p-2', isActive ? 'bg-sky-500' : 'bg-slate-100'].join(' ')}>
                <Icon className={['w-4 h-4', isActive ? 'text-white' : 'text-slate-500'].join(' ')} />
              </div>
              <div>
                <p className={['text-sm font-bold', isActive ? 'text-sky-700' : 'text-slate-700'].join(' ')}>
                  {opt.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.sub}</p>
                <p className={['text-xs font-semibold mt-1', isActive ? 'text-sky-600' : 'text-slate-400'].join(' ')}>
                  {opt.time}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
