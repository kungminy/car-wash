'use client';

import { useEffect } from 'react';
import { Car } from 'lucide-react';
import { useWeatherStore } from '@/store/weatherStore';
import { useDeckStore } from '@/store/deckStore';
import OptimalDayBanner, { OptimalDayBannerEmpty } from './OptimalDayBanner';
import WeatherForecast from './WeatherForecast';
import StepTabBar from './StepTabBar';
import ProductCard from './ProductCard';
import MyDeckPanel from './MyDeckPanel';

export default function Dashboard() {
  const { forecast, optimalDay, init } = useWeatherStore();
  const {
    activeStep,
    filteredProducts,
    toggleMyDeck,
    setActiveStep,
    isInMyDeck,
    myDeck,
    myDeckByStep,
    clearMyDeck,
  } = useDeckStore();

  useEffect(() => {
    init();
  }, [init]);

  const products = filteredProducts();
  const deckByStep = myDeckByStep();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-sky-500 rounded-xl p-1.5">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm">CarWash Planner</span>
          </div>
          {myDeck.length > 0 && (
            <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 rounded-full px-3 py-1">
              <span className="text-xs font-semibold text-sky-600">내 덱</span>
              <span className="bg-sky-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {myDeck.length}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Section A: 세차 최적일 */}
        <section>
          <h1 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            세차 최적일 알리미
          </h1>
          {optimalDay ? (
            <OptimalDayBanner optimalDay={optimalDay} />
          ) : (
            <OptimalDayBannerEmpty />
          )}
        </section>

        {/* 5일 예보 */}
        {forecast.length > 0 && (
          <WeatherForecast
            forecast={forecast}
            optimalDate={optimalDay?.day.date ?? null}
          />
        )}

        {/* Section B: 세차 덱 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              세차 용품 덱
            </h2>
            <span className="text-xs text-slate-400">{products.length}개 용품</span>
          </div>

          <div className="mb-4">
            <StepTabBar activeStep={activeStep} onSelect={setActiveStep} />
          </div>

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
        </section>

        {/* Section: 내 덱 */}
        <MyDeckPanel
          deckByStep={deckByStep}
          totalCount={myDeck.length}
          onRemove={toggleMyDeck}
          onClear={clearMyDeck}
        />
      </main>
    </div>
  );
}
