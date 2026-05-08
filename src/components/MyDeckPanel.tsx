'use client';

import { Trash2, X } from 'lucide-react';
import { CarWashProduct, StepTag } from '@/types';
import { STEP_TAG_STYLES, STEP_SHORT_LABELS } from './StepTabBar';

interface Props {
  deckByStep: Partial<Record<StepTag, CarWashProduct[]>>;
  totalCount: number;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function MyDeckPanel({ deckByStep, totalCount, onRemove, onClear }: Props) {
  if (totalCount === 0) return null;

  const stepEntries = Object.entries(deckByStep) as [StepTag, CarWashProduct[]][];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-800">내 덱</h2>
          <span className="bg-sky-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalCount}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          전체 초기화
        </button>
      </div>

      <div className="divide-y divide-slate-50">
        {stepEntries.map(([step, products]) => (
          <div key={step} className="px-5 py-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STEP_TAG_STYLES[step]}`}
              >
                {STEP_SHORT_LABELS[step]}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-2 bg-slate-50 rounded-lg px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.brand}</p>
                  </div>
                  <button
                    onClick={() => onRemove(product.id)}
                    className="flex-shrink-0 text-slate-300 hover:text-red-400 transition-colors p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
