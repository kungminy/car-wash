'use client';

import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDeckStore } from '@/store/deckStore';
import StepTabBar from './StepTabBar';
import ProductCard from './ProductCard';
import SelectedProductsTray from './SelectedProductsTray';

export default function ProductsPage() {
  const {
    activeStep,
    filteredProducts,
    toggleMyDeck,
    setActiveStep,
    isInMyDeck,
    initProducts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    myDeckProducts,
  } = useDeckStore();

  useEffect(() => {
    initProducts();
  }, [initProducts]);

  const products = filteredProducts();
  const selectedProducts = myDeckProducts();

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      <section>
        <h1 className="text-xl font-bold text-slate-900">세차 용품</h1>
        <p className="text-sm text-slate-500 mt-1">세차 단계별로 실제 판매 데이터를 확인하고 내 덱에 담으세요.</p>
      </section>

      <SelectedProductsTray products={selectedProducts} onRemove={toggleMyDeck} />

      <section>
        <label className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="상품명, 브랜드, 단계 검색"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="mt-3">
          <StepTabBar activeStep={activeStep} onSelect={setActiveStep} />
        </div>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </section>

      {isLoading ? (
        <div className="min-h-[420px] bg-white rounded-2xl border border-slate-200 p-6 text-sm text-slate-500">
          상품 정보를 불러오는 중이에요.
        </div>
      ) : (
        <section className="min-h-[420px]">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInDeck={isInMyDeck(product.id)}
                  onToggle={toggleMyDeck}
                />
              ))}
            </div>
          ) : (
            <div className="min-h-[260px] flex items-center justify-center text-sm text-slate-400">
              검색 결과가 없어요.
            </div>
          )}
        </section>
      )}
    </main>
  );
}
