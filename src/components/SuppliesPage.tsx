'use client';

import { useState } from 'react';
import { useSupplyStore } from '@/store/supplyStore';
import { SUPPLY_META, PH_LABELS } from '@/lib/supplyMeta';
import AddSupplySheet from './AddSupplySheet';
import { FlaskConical, Plus, Trash2 } from 'lucide-react';

export default function SuppliesPage() {
  const { supplies, removeSupply } = useSupplyStore();
  const [showSheet, setShowSheet] = useState(false);

  // 그룹별로 묶기
  const grouped = Object.entries(
    supplies.reduce<Record<string, typeof supplies>>((acc, s) => {
      const group = SUPPLY_META[s.category].group;
      if (!acc[group]) acc[group] = [];
      acc[group].push(s);
      return acc;
    }, {})
  );

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">내 용품함</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {supplies.length === 0 ? '아직 등록된 용품이 없어요' : `${supplies.length}가지 용품 등록됨`}
          </p>
        </div>
        <button
          onClick={() => setShowSheet(true)}
          className="flex items-center gap-1.5 bg-sky-500 text-white text-sm font-semibold rounded-xl px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      {supplies.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <FlaskConical className="w-12 h-12 text-slate-300" />
          <div>
            <p className="font-semibold text-slate-600">보유 용품을 등록해보세요</p>
            <p className="text-sm text-slate-400 mt-1">
              등록한 용품을 기반으로<br />맞춤 세차 플랜을 만들어드려요
            </p>
          </div>
          <button
            onClick={() => setShowSheet(true)}
            className="bg-sky-500 text-white text-sm font-semibold rounded-xl px-5 py-2.5"
          >
            첫 용품 추가하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{group}</p>
              <div className="flex flex-col gap-2">
                {items.map((supply) => {
                  const meta = SUPPLY_META[supply.category];
                  return (
                    <div
                      key={supply.id}
                      className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex items-center gap-3"
                    >
                      <span className="text-2xl">{meta.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {supply.name ?? meta.label}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {supply.brand && (
                            <span className="text-xs text-slate-400">{supply.brand}</span>
                          )}
                          {supply.ph && (
                            <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
                              {PH_LABELS[supply.ph]}
                            </span>
                          )}
                          {!supply.brand && !supply.ph && (
                            <span className="text-xs text-slate-400">{meta.label}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeSupply(supply.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors p-1"
                        aria-label="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSheet && <AddSupplySheet onClose={() => setShowSheet(false)} />}
    </main>
  );
}
