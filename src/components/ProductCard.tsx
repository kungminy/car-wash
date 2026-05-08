'use client';

import { Plus, CheckCircle2 } from 'lucide-react';
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
      {product.imageUrl && (
        <div className="aspect-square rounded-lg bg-slate-50 overflow-hidden">
          <img
            src={product.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${STEP_TAG_STYLES[product.stepTag]}`}
            >
              {STEP_SHORT_LABELS[product.stepTag]}
            </span>
          </div>
          <p className="text-sm font-bold text-slate-800 leading-tight">{product.name}</p>
          {product.price && (
            <p className="text-sm font-bold text-slate-800">
              {product.price.toLocaleString('ko-KR')}원
              {product.mallName && (
                <span className="ml-1 text-xs font-medium text-slate-400">{product.mallName}</span>
              )}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed flex-1">{product.description}</p>

      <div className="flex gap-2">
        <button
          onClick={() => onToggle(product.id)}
          className={[
            'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all',
            isInDeck
              ? 'bg-sky-500 text-white hover:bg-sky-600'
              : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100',
          ].join(' ')}
        >
          {isInDeck ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              추가됨
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              내 덱
            </>
          )}
        </button>
        {product.link && (
          <a
            href={product.link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
          >
            보기
          </a>
        )}
      </div>
    </div>
  );
}
