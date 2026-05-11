import { MySupply, PlannedStep, SupplyCategory, WashIntensity, WashPlan, WashStepTemplate } from '@/types';

const LIGHT_STEPS: WashStepTemplate[] = [
  {
    id: 'l_wheel',
    order: 1,
    title: '휠 & 타이어 세척',
    description: '휠클리너로 브레이크 분진과 오염을 제거합니다. 본세차 전에 먼저 해야 이후 작업이 오염되지 않아요.',
    estimatedMinutes: 5,
    required: ['wheel_cleaner'],
    optional: ['tire_dressing'],
    tips: ['휠 전용 도구를 페인트 작업에 절대 쓰지 마세요', '휠클리너가 없으면 카샴푸 거품으로 대체 가능'],
    skipSuggestion: '물로만 헹구거나 카샴푸 거품으로 대체하세요',
    intensity: ['light', 'deep'],
  },
  {
    id: 'l_prewash',
    order: 2,
    title: '프리워시 (사전 세정)',
    description: '스노우폼이나 프리워시제를 뿌려 흙, 먼지를 불립니다. 차체를 건드리지 않고 오염을 제거하는 핵심 단계예요.',
    estimatedMinutes: 10,
    required: ['pre_wash_foam'],
    optional: [],
    tips: ['5~10분 불린 후 헹궈내면 본세차 시 스크래치 위험이 줄어요', '없으면 물로만 충분히 헹궈내세요'],
    phNote: '알칼리성 제품으로 기존 코팅이 조금씩 소모됩니다. 코팅차는 중성 프리워시를 권장해요.',
    skipSuggestion: '물로만 충분히 헹궈내세요. 손으로 닦기 전 물 세척이 가장 중요합니다.',
    intensity: ['light', 'deep'],
  },
  {
    id: 'l_wash',
    order: 3,
    title: '본세차',
    description: '카샴푸와 세차미트로 위→아래 순서로 세척합니다. 원형 동작을 피하고 직선으로 닦으면 스월마크를 예방할 수 있어요.',
    estimatedMinutes: 15,
    required: ['car_shampoo'],
    optional: ['wash_mitt', 'wash_bucket'],
    tips: ['버킷 2개를 쓰면 세척수 오염을 막아요 (2버킷 세차법)', '직선으로 닦고, 원형 동작은 스월마크의 원인'],
    intensity: ['light', 'deep'],
  },
  {
    id: 'l_rinse',
    order: 4,
    title: '헹굼',
    description: '위에서 아래로 충분히 헹궈냅니다. 샴푸 잔여물이 남으면 물자국이 생겨요.',
    estimatedMinutes: 5,
    required: [],
    optional: [],
    tips: ['직사광선 아래 작업 시 빠르게 헹궈내야 합니다'],
    intensity: ['light', 'deep'],
  },
  {
    id: 'l_dry',
    order: 5,
    title: '드라잉 (건조)',
    description: '드라잉타월이나 에어건으로 물기를 제거합니다. 자연건조는 수분 자국의 원인이에요.',
    estimatedMinutes: 10,
    required: ['drying_towel'],
    optional: ['air_dryer'],
    tips: ['그릴·엠블럼·미러 틈새는 에어건으로 먼저 날리면 좋아요', '타월은 토스해서 물기를 닦고, 문지르지 말고 살짝 눌러서'],
    skipSuggestion: '드라잉타월 없이는 수분 자국이 생길 수 있어요. 즉시 구매를 추천합니다.',
    intensity: ['light', 'deep'],
  },
  {
    id: 'l_finish',
    order: 6,
    title: '마무리 (물왁스)',
    description: '물왁스나 퀵디테일러로 발수력을 보강하고 광택을 냅니다.',
    estimatedMinutes: 5,
    required: ['quick_wax'],
    optional: [],
    tips: ['세라믹코팅 차량은 물왁스 대신 코팅 전용 유지관리 제품을 사용하세요'],
    skipSuggestion: '오늘은 그냥 마무리해도 괜찮아요. 다음에 물왁스 구매를 추천드려요.',
    intensity: ['light'],
  },
];

const DEEP_EXTRA_STEPS: WashStepTemplate[] = [
  {
    id: 'd_iron',
    order: 25,
    title: '철분 & 타르 제거',
    description: '철분제거제와 타르제거제로 도장면에 박힌 오염물을 화학적으로 제거합니다. 딥세차의 핵심 단계예요.',
    estimatedMinutes: 15,
    required: ['iron_remover'],
    optional: ['tar_remover'],
    tips: ['철분제거제는 보라색으로 반응하면 정상입니다', '5~10분 두었다가 물로 헹궈내세요'],
    phNote: '철분제거제는 산성이에요. 충분히 헹궈내지 않으면 도장에 영향을 줄 수 있어요.',
    skipSuggestion: '없으면 이 단계는 넘어가도 되지만, 정기적인 철분 제거를 권장해요.',
    intensity: ['deep'],
  },
  {
    id: 'd_clay',
    order: 35,
    title: '클레이바 (디컨)',
    description: '클레이바로 도장면의 깊은 오염과 물리적 오염물을 제거합니다. 표면이 유리처럼 매끄러워져요.',
    estimatedMinutes: 20,
    required: ['clay_bar'],
    optional: [],
    tips: ['윤활제(카샴푸 희석 또는 전용 클레이 루브)를 충분히 뿌리고 작업하세요', '클레이가 떨어지면 버리세요. 절대 다시 쓰지 말 것'],
    skipSuggestion: '매달 할 필요는 없어요. 도장이 까끌까끌하면 사용을 권장해요.',
    intensity: ['deep'],
  },
  {
    id: 'd_protection',
    order: 65,
    title: '보호막 시공 (왁스/코팅)',
    description: '카나우바왁스, 실런트, 또는 세라믹코팅제로 도장 보호막을 시공합니다.',
    estimatedMinutes: 30,
    required: ['carnauba_wax', 'sealant', 'ceramic_coating'],
    optional: ['quick_wax'],
    tips: ['세라믹코팅은 2~4시간 이상 작업 시간이 필요해요', '왁스는 3~6개월마다, 실런트는 6개월~1년마다 재시공 권장'],
    intensity: ['deep'],
  },
  {
    id: 'd_glass',
    order: 70,
    title: '유리 세척 (선택)',
    description: '유리세정제로 유막과 오염을 제거합니다.',
    estimatedMinutes: 10,
    required: [],
    optional: ['glass_cleaner'],
    tips: ['차량용 유리 세정제를 사용하세요. 일반 유리클리너는 틴팅을 손상시킬 수 있어요'],
    skipSuggestion: '유리세정제가 없으면 카샴푸로 닦아도 어느 정도 효과가 있어요.',
    intensity: ['deep'],
  },
  {
    id: 'd_interior',
    order: 75,
    title: '실내 세척 (선택)',
    description: '실내클리너로 대시보드, 시트, 카펫을 닦습니다.',
    estimatedMinutes: 20,
    required: [],
    optional: ['interior_cleaner'],
    tips: ['가죽시트는 가죽 전용 클리너와 컨디셔너를 쓰세요'],
    skipSuggestion: '오늘은 외부만 해도 됩니다.',
    intensity: ['deep'],
  },
];

function buildDeepSteps(): WashStepTemplate[] {
  const base = LIGHT_STEPS.filter((s) => s.id !== 'l_finish');
  const extras = DEEP_EXTRA_STEPS;

  const all = [...base, ...extras];
  all.sort((a, b) => {
    const orderMap: Record<string, number> = {
      l_wheel: 10,
      l_prewash: 20,
      d_iron: 25,
      l_wash: 30,
      d_clay: 35,
      l_rinse: 40,
      l_dry: 50,
      d_protection: 65,
      d_glass: 70,
      d_interior: 75,
    };
    return (orderMap[a.id] ?? 99) - (orderMap[b.id] ?? 99);
  });

  return all.map((s, i) => ({ ...s, order: i + 1 }));
}

const DEEP_STEPS = buildDeepSteps();

export function generatePlan(supplies: MySupply[], intensity: WashIntensity): WashPlan {
  const templates = intensity === 'light' ? LIGHT_STEPS : DEEP_STEPS;

  const planned: PlannedStep[] = templates.map((step) => {
    const available = supplies.filter((s) => {
      const inRequired = step.required.includes(s.category);
      const inOptional = step.optional.includes(s.category);
      return inRequired || inOptional;
    });

    const hasRequired =
      step.required.length === 0 ||
      step.required.some((cat) => supplies.some((s) => s.category === cat));

    return {
      ...step,
      availableSupplies: available,
      isMissing: !hasRequired,
      skipSuggestion: !hasRequired ? step.skipSuggestion : undefined,
    };
  });

  const missingCategories = Array.from(
    new Set(
      planned
        .filter((s) => s.isMissing)
        .flatMap((s) => s.required)
        .filter((cat) => !supplies.some((s) => s.category === cat))
    )
  );

  const warnings: string[] = [];
  const hasCeramic = supplies.some((s) => s.category === 'ceramic_coating');
  const hasAlkalinePrewash = supplies.some(
    (s) => s.category === 'pre_wash_foam' && s.ph === 'alkaline'
  );
  if (hasCeramic && hasAlkalinePrewash) {
    warnings.push('세라믹코팅 차량에 알칼리 프리워시 사용 시 코팅이 조기 소모될 수 있어요. 중성 프리워시를 권장합니다.');
  }

  const requiredSteps = planned.filter((s) => s.required.length > 0);
  const coveredSteps = requiredSteps.filter((s) => !s.isMissing);
  const readyRatio = requiredSteps.length === 0 ? 1 : coveredSteps.length / requiredSteps.length;

  const mins = planned.reduce((sum, s) => sum + s.estimatedMinutes, 0);

  return {
    intensity,
    steps: planned,
    totalMinutes: { min: Math.round(mins * 0.8), max: Math.round(mins * 1.3) },
    missingCategories,
    warnings,
    readyRatio,
  };
}
