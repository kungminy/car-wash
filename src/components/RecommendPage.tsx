'use client';

import { useEffect, useState } from 'react';
import { useSupplyStore } from '@/store/supplyStore';
import { getMissingForDeep, getMissingForLight, getReadinessForDeep, getReadinessForLight } from '@/lib/missingSupplies';
import { SUPPLY_META } from '@/lib/supplyMeta';
import { SupplyCategory } from '@/types';
import { CheckCircle2, ExternalLink, Loader2, ShoppingBag } from 'lucide-react';

interface NaverProduct {
  id: string;
  name: string;
  brand: string;
  imageUrl?: string;
  link?: string;
  price?: number;
  mallName?: string;
}

const CATEGORY_QUERIES: Partial<Record<SupplyCategory, string>> = {
  pre_wash_foam: '세차 스노우폼 프리워시',
  iron_remover: '자동차 철분제거제',
  tar_remover: '자동차 타르제거제',
  wheel_cleaner: '자동차 휠클리너',
  tire_dressing: '타이어 코팅제 드레싱',
  car_shampoo: '카샴푸 중성 세차',
  wash_mitt: '세차 미트 극세사',
  wash_bucket: '세차 버킷 그릿가드',
  clay_bar: '세차 클레이바',
  drying_towel: '세차 드라잉타월 극세사',
  air_dryer: '차량용 에어건 송풍기',
  quick_wax: '자동차 물왁스 퀵디테일러',
  carnauba_wax: '카나우바왁스 자동차',
  sealant: '자동차 실런트 코팅',
  ceramic_coating: '자동차 세라믹코팅제',
  glass_cleaner: '자동차 유리세정제 유막',
  interior_cleaner: '자동차 실내클리너',
};

function ReadinessBar({ label, ratio }: { label: string; ratio: number }) {
  const pct = Math.round(ratio * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-slate-600">{label}</p>
        <p className="text-xs font-bold text-slate-800">{pct}%</p>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={[
            'h-full rounded-full transition-all',
            pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400',
          ].join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function RecommendPage() {
  const { supplies } = useSupplyStore();
  const [products, setProducts] = useState<Record<string, NaverProduct[]>>({});
  const [loading, setLoading] = useState(false);

  const lightMissing = getMissingForLight(supplies);
  const deepMissing = getMissingForDeep(supplies);
  const lightRatio = getReadinessForLight(supplies);
  const deepRatio = getReadinessForDeep(supplies);

  const allMissing = Array.from(
    new Set([...lightMissing.required, ...lightMissing.recommended, ...deepMissing.required, ...deepMissing.recommended])
  );

  useEffect(() => {
    if (allMissing.length === 0) return;
    setLoading(true);
    fetch('/api/recommend?' + new URLSearchParams({ cats: allMissing.join(',') }))
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? {}))
      .catch(() => setProducts({}))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplies.length]);

  const allOwned = allMissing.length === 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">용품 추천</h1>
        <p className="text-sm text-slate-500 mt-0.5">내 용품함 기준으로 부족한 용품을 추천해드려요</p>
      </div>

      {/* 준비도 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3">
        <p className="text-sm font-bold text-slate-700">내 세차 준비도</p>
        <ReadinessBar label="라이트 세차" ratio={lightRatio} />
        <ReadinessBar label="딥 세차" ratio={deepRatio} />
      </div>

      {allOwned ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          <p className="font-bold text-slate-800">모든 필수 용품이 준비됐어요!</p>
          <p className="text-sm text-slate-500">홈으로 돌아가 세차 플랜을 확인해보세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* 라이트 부족 */}
          {(lightMissing.required.length > 0 || lightMissing.recommended.length > 0) && (
            <Section title="라이트 세차" required={lightMissing.required} recommended={lightMissing.recommended} products={products} loading={loading} />
          )}

          {/* 딥 부족 (라이트와 중복 제외) */}
          {(() => {
            const lightAll = new Set([...lightMissing.required, ...lightMissing.recommended]);
            const deepOnlyReq = deepMissing.required.filter((c) => !lightAll.has(c));
            const deepOnlyRec = deepMissing.recommended.filter((c) => !lightAll.has(c));
            if (deepOnlyReq.length === 0 && deepOnlyRec.length === 0) return null;
            return <Section title="딥 세차 추가 필요" required={deepOnlyReq} recommended={deepOnlyRec} products={products} loading={loading} />;
          })()}
        </div>
      )}
    </main>
  );
}

function Section({
  title,
  required,
  recommended,
  products,
  loading,
}: {
  title: string;
  required: SupplyCategory[];
  recommended: SupplyCategory[];
  products: Record<string, NaverProduct[]>;
  loading: boolean;
}) {
  const cats = [...required.map((c) => ({ cat: c, isRequired: true })), ...recommended.map((c) => ({ cat: c, isRequired: false }))];
  if (cats.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-bold text-slate-700">{title}</p>
      {cats.map(({ cat, isRequired }) => {
        const meta = SUPPLY_META[cat];
        const catProducts = products[cat] ?? [];
        return (
          <div key={cat} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100">
              <span className="text-xl">{meta.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-800">{meta.label}</p>
                  {isRequired && (
                    <span className="text-xs bg-red-100 text-red-500 rounded-full px-2 py-0.5 font-semibold">필수</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{meta.description}</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-6 gap-2 text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                상품 검색 중
              </div>
            ) : catProducts.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {catProducts.slice(0, 3).map((p) => (
                  <a
                    key={p.id}
                    href={p.link ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                      {p.price && (
                        <p className="text-xs text-sky-600 font-bold mt-0.5">
                          {p.price.toLocaleString('ko-KR')}원
                        </p>
                      )}
                      {p.mallName && <p className="text-xs text-slate-400">{p.mallName}</p>}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-5 text-sm text-slate-400">
                <ShoppingBag className="w-4 h-4" />
                {CATEGORY_QUERIES[cat] ? `"${CATEGORY_QUERIES[cat]}"로 검색해보세요` : '네이버 쇼핑에서 검색해보세요'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
