'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { PackagePlus } from 'lucide-react';
import { useDeckStore } from '@/store/deckStore';
import MyDeckPanel from './MyDeckPanel';

export default function DeckPage() {
  const { myDeck, myDeckByStep, toggleMyDeck, clearMyDeck, initProducts } = useDeckStore();

  useEffect(() => {
    initProducts();
  }, [initProducts]);

  const deckByStep = myDeckByStep();

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">내 덱</h1>
            <p className="text-sm text-slate-500 mt-1">담은 용품을 세차 순서대로 확인하세요.</p>
          </div>
          <span className="bg-sky-500 text-white text-xs font-bold rounded-full px-2.5 py-1">
            {myDeck.length}개
          </span>
        </div>
      </section>

      {myDeck.length > 0 ? (
        <MyDeckPanel
          deckByStep={deckByStep}
          totalCount={myDeck.length}
          onRemove={toggleMyDeck}
          onClear={clearMyDeck}
        />
      ) : (
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm font-bold text-slate-800">내 덱이 비어 있어요.</p>
          <p className="text-sm text-slate-500 mt-1">용품 탭에서 세차 단계별 상품을 추가할 수 있어요.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-1.5 bg-sky-500 text-white rounded-xl px-4 py-2 text-sm font-semibold"
          >
            <PackagePlus className="w-4 h-4" />
            용품 추가하기
          </Link>
        </section>
      )}
    </main>
  );
}
