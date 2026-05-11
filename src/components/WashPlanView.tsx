'use client';

import { WashPlan } from '@/types';
import { SUPPLY_META } from '@/lib/supplyMeta';
import { AlertTriangle, CheckCircle2, Clock, ShoppingBag, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  plan: WashPlan;
}

export default function WashPlanView({ plan }: Props) {
  const readyPercent = Math.round(plan.readyRatio * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* 요약 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="20" strokeWidth="4" className="stroke-slate-100 fill-none" />
              <circle
                cx="24"
                cy="24"
                r="20"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - plan.readyRatio)}`}
                strokeLinecap="round"
                className={[
                  'fill-none transition-all',
                  readyPercent >= 80 ? 'stroke-emerald-500' : readyPercent >= 50 ? 'stroke-amber-400' : 'stroke-red-400',
                ].join(' ')}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
              {readyPercent}%
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">준비도 {readyPercent}%</p>
            <p className="text-xs text-slate-500">
              {plan.missingCategories.length === 0
                ? '모든 필수 용품이 준비됐어요!'
                : `${plan.missingCategories.length}가지 용품이 부족해요`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-semibold">
            {plan.totalMinutes.min}–{plan.totalMinutes.max}분
          </span>
        </div>
      </div>

      {/* pH 경고 */}
      {plan.warnings.map((w, i) => (
        <div key={i} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">{w}</p>
        </div>
      ))}

      {/* 단계별 플랜 */}
      <div className="flex flex-col gap-2">
        {plan.steps.map((step, idx) => {
          const hasSupply = step.availableSupplies.length > 0;
          const noRequired = step.required.length === 0;

          return (
            <div
              key={step.id}
              className={[
                'bg-white rounded-2xl border p-4',
                step.isMissing ? 'border-red-100' : 'border-slate-200',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                {/* 번호 / 아이콘 */}
                <div
                  className={[
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5',
                    step.isMissing
                      ? 'bg-red-100 text-red-500'
                      : 'bg-sky-100 text-sky-600',
                  ].join(' ')}
                >
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-800">{step.title}</p>
                    <span className="text-xs text-slate-400 shrink-0">{step.estimatedMinutes}분</span>
                  </div>

                  <p className="text-xs text-slate-500 mb-2">{step.description}</p>

                  {/* 보유 용품 */}
                  {hasSupply && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {step.availableSupplies.map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {s.name ?? SUPPLY_META[s.category].label}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 누락 */}
                  {step.isMissing && (
                    <div className="flex items-start gap-1.5 text-xs text-red-500 mt-1">
                      <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>
                        {step.required.map((c) => SUPPLY_META[c].label).join(' 또는 ')} 없음
                        {step.skipSuggestion && ` — ${step.skipSuggestion}`}
                      </span>
                    </div>
                  )}

                  {/* 필수 없음 (항상 가능) */}
                  {noRequired && !hasSupply && (
                    <p className="text-xs text-slate-400 italic">용품 없이도 가능한 단계예요</p>
                  )}

                  {/* pH 노트 */}
                  {step.phNote && (
                    <p className="text-xs text-amber-600 mt-1.5">⚠️ {step.phNote}</p>
                  )}

                  {/* 팁 */}
                  {step.tips.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {step.tips.map((tip, ti) => (
                        <li key={ti} className="text-xs text-slate-400 flex gap-1">
                          <span>•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 부족 용품 CTA */}
      {plan.missingCategories.length > 0 && (
        <Link
          href="/recommend"
          className="flex items-center justify-center gap-2 bg-sky-500 text-white rounded-2xl px-4 py-3 font-semibold text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          부족한 {plan.missingCategories.length}가지 용품 추천 받기
        </Link>
      )}
    </div>
  );
}
