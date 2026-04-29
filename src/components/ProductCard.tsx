'use client';

import { Plus, CheckCircle2, Star } from 'lucide-react';
import { CarWashProduct } from '@/types';
import { STEP_TAG_STYLES, STEP_SHORT_LABELS } from './StepTabBar';

interface Props {
  product: CarWashProduct;
  isInDeck: boolean;
  onToggle: (id: string) => void;
}

export default function ProductCard({ product, isInDeck, onToggle }: Props) {
  return (
    <div
      className={[
        'bg-white rounded-xl border p-4 flex flex-col gap-3 transition-all',
        isInDeck ? 'border-sky-300 shadow-sm shadow-sky-100' : 'border-slate-100 hover:border-slate-200',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${STEP_TAG_STYLES[product.stepTag]}`}
            >
              {STEP_SHORT_LABELS[product.stepTag]}
            </span>
            {product.recommended && (
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                추천
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-slate-800 leading-tight">{product.name}</p>
          <p className="text-xs text-slate-400 font-medium">
            {product.brand}
            {product.capacity && ` · ${product.capacity}`}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed flex-1">{product.description}</p>

      <button
        onClick={() => onToggle(product.id)}
        className={[
          'w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all',
          isInDeck
            ? 'bg-sky-500 text-white hover:bg-sky-600'
            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100',
        ].join(' ')}
      >
        {isInDeck ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5" />
            내 덱에 추가됨
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            내 덱에 추가
          </>
        )}
      </button>
    </div>
  );
}
