'use client';

import { useState } from 'react';
import { SupplyCategory, PHProperty } from '@/types';
import { ALL_CATEGORIES, GROUP_ORDER, PH_LABELS, SUPPLY_META } from '@/lib/supplyMeta';
import { useSupplyStore } from '@/store/supplyStore';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function AddSupplySheet({ onClose }: Props) {
  const { addSupply } = useSupplyStore();
  const [category, setCategory] = useState<SupplyCategory | ''>('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [ph, setPh] = useState<PHProperty | ''>('');

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: ALL_CATEGORIES.filter((c) => SUPPLY_META[c].group === group),
  }));

  function handleSubmit() {
    if (!category) return;
    addSupply({
      category,
      name: name.trim() || undefined,
      brand: brand.trim() || undefined,
      ph: ph || undefined,
    });
    onClose();
  }

  const selectedMeta = category ? SUPPLY_META[category] : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white px-5 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">용품 추가</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">
          {/* 카테고리 선택 */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">용품 종류 <span className="text-red-400">*</span></p>
            <div className="flex flex-col gap-3">
              {grouped.map(({ group, items }) => (
                <div key={group}>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1.5">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((cat) => {
                      const meta = SUPPLY_META[cat];
                      const isSelected = category === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategory(cat);
                            if (meta.defaultPh) setPh(meta.defaultPh);
                          }}
                          className={[
                            'flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border transition-all',
                            isSelected
                              ? 'bg-sky-500 text-white border-sky-500'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300',
                          ].join(' ')}
                        >
                          <span>{meta.emoji}</span>
                          {meta.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedMeta && (
            <p className="text-xs text-sky-600 bg-sky-50 rounded-xl px-3 py-2">
              {selectedMeta.description}
            </p>
          )}

          {/* 선택 입력 */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1">
                제품명 <span className="text-slate-400 font-normal">(선택)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 불스원 크리스탈 카샴푸"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1">
                브랜드 <span className="text-slate-400 font-normal">(선택)</span>
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="예: 불스원, Gyeon, Soft99"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1">
                pH 성질 <span className="text-slate-400 font-normal">(선택)</span>
              </label>
              <div className="flex gap-2">
                {(['acidic', 'neutral', 'alkaline', ''] as const).map((val) => (
                  <button
                    key={val}
                    onClick={() => setPh(val as PHProperty | '')}
                    className={[
                      'flex-1 text-xs font-semibold rounded-xl py-2 border transition-all',
                      ph === val
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'bg-white text-slate-600 border-slate-200',
                    ].join(' ')}
                  >
                    {val === '' ? '모름' : PH_LABELS[val]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!category}
            className={[
              'w-full py-3 rounded-2xl font-bold text-sm transition-all',
              category
                ? 'bg-sky-500 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed',
            ].join(' ')}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
