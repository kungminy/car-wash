'use client';

import { X } from 'lucide-react';
import { CarWashProduct } from '@/types';
import { STEP_SHORT_LABELS, STEP_TAG_STYLES } from './StepTabBar';

interface Props {
  products: CarWashProduct[];
  onRemove: (id: string) => void;
}

export default function SelectedProductsTray({ products, onRemove }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-bold text-sky-900">내가 쓰는 용품</p>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-sky-600">
          {products.length}개
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-sky-100 bg-white px-2 py-1.5"
          >
            <span
              className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STEP_TAG_STYLES[product.stepTag]}`}
            >
              {STEP_SHORT_LABELS[product.stepTag]}
            </span>
            <span className="min-w-0 truncate text-xs font-bold text-slate-800">
              {product.name}
            </span>
            <button
              onClick={() => onRemove(product.id)}
              className="flex-shrink-0 rounded-full p-0.5 text-slate-300 hover:bg-slate-50 hover:text-red-400"
              aria-label={`${product.name} 제거`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
