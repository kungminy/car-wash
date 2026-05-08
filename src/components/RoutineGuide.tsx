'use client';

import Link from 'next/link';
import { Clock, PackagePlus } from 'lucide-react';
import { CarWashProduct, StepTag } from '@/types';
import { STEP_SHORT_LABELS, STEP_TAG_STYLES } from './StepTabBar';

const ROUTINE_STEPS: Array<{
  title: string;
  time: string;
  stepTag?: StepTag;
  method: string;
  tip: string;
}> = [
  {
    title: '차량 열 식히기',
    time: '5~10분',
    method: '주행 직후라면 세차 부스에 세운 뒤 휠과 도장면 열을 먼저 식혀요.',
    tip: '뜨거운 패널이나 휠에 약제를 바로 뿌리면 얼룩이 생기기 쉬워요.',
  },
  {
    title: '고압수 예비 헹굼',
    time: '2~3분',
    method: '지붕, 유리, 보닛, 측면, 범퍼, 하부 순서로 큰 먼지와 모래를 먼저 밀어내요.',
    tip: '건은 차에서 1m 이상 떨어뜨리고 한 곳에 오래 쏘지 않는 편이 좋아요.',
  },
  {
    title: '휠/타이어 세정',
    time: '5~8분',
    stepTag: '1_휠/타이어',
    method: '휠과 타이어에 제품을 뿌리고 1~3분 반응시킨 뒤 브러시로 스포크, 림, 타이어 사이드월을 닦아요.',
    tip: '휠용 브러시와 도장면용 미트는 분리해서 사용하세요.',
  },
  {
    title: '프리워시',
    time: '3~5분',
    stepTag: '2_프리워시',
    method: '차 전체에 폼이나 프리워시제를 고르게 분사하고 문지르지 않은 채 오염을 불려요.',
    tip: '약제가 마르기 전에 고압수로 충분히 헹구는 게 중요해요.',
  },
  {
    title: '본세차',
    time: '8~12분',
    stepTag: '3_본세차',
    method: '샴푸를 충분히 묻힌 미트로 위에서 아래로 닦고, 하단부는 마지막에 작업해요.',
    tip: '미트는 자주 헹궈서 모래가 도장면을 긁지 않게 해요.',
  },
  {
    title: '최종 헹굼',
    time: '2~3분',
    method: '거품과 약제가 남지 않도록 틈새, 미러, 그릴, 문손잡이 주변까지 헹궈요.',
    tip: '헹굼이 부족하면 드라잉 후 얼룩이 남기 쉬워요.',
  },
  {
    title: '드라잉',
    time: '5~10분',
    stepTag: '4_드라잉',
    method: '큰 물기는 타월로 눌러 흡수하고, 미러와 엠블럼 틈새는 송풍기나 작은 타월로 마무리해요.',
    tip: '마른 수건으로 강하게 문지르기보다 물기를 끌어내듯 처리하세요.',
  },
  {
    title: '코팅/마무리',
    time: '5~10분',
    stepTag: '5_코팅/마무리',
    method: '마른 도장면에 소량씩 분사하고 패널 단위로 펴 바른 뒤 깨끗한 타월로 버핑해요.',
    tip: '타이어 드레싱은 마지막에 얇게 바르면 튐과 얼룩을 줄일 수 있어요.',
  },
];

function productsForStep(products: CarWashProduct[], stepTag?: StepTag) {
  if (!stepTag) return [];
  return products.filter((product) => product.stepTag === stepTag);
}

export default function RoutineGuide({ products }: { products: CarWashProduct[] }) {
  const hasProducts = products.length > 0;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          총 예상 시간 35~50분
        </div>
        <Link href="/products" className="text-xs font-semibold text-sky-600">
          용품 선택
        </Link>
      </div>

      {!hasProducts && (
        <div className="mb-3 rounded-2xl border border-dashed border-slate-200 px-4 py-3">
          <p className="text-sm font-bold text-slate-800">선택한 용품이 아직 없어요.</p>
          <p className="mt-1 text-sm text-slate-500">기본 루틴을 먼저 보여드릴게요. 용품을 추가하면 단계별 사용법이 더 구체화돼요.</p>
          <Link
            href="/products"
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white"
          >
            <PackagePlus className="w-4 h-4" />
            용품 추가하기
          </Link>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {ROUTINE_STEPS.map((step, index) => {
          const stepProducts = productsForStep(products, step.stepTag);

          return (
            <div key={step.title} className="flex gap-3 px-4 py-4 border-b border-slate-100 last:border-b-0">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{step.time}</p>
                  </div>
                  {step.stepTag && (
                    <span
                      className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STEP_TAG_STYLES[step.stepTag]}`}
                    >
                      {STEP_SHORT_LABELS[step.stepTag]}
                    </span>
                  )}
                </div>

                {stepProducts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {stepProducts.map((product) => (
                      <span
                        key={product.id}
                        className="rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700"
                      >
                        {product.name}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {stepProducts.length > 0 && step.stepTag
                    ? `선택한 ${stepProducts.map((product) => product.name).join(', ')}을 사용해요. ${step.method}`
                    : step.method}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{step.tip}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
