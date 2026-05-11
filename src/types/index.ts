export type SupplyCategory =
  | 'pre_wash_foam'    // 스노우폼 / 프리워시폼
  | 'iron_remover'     // 철분제거제
  | 'tar_remover'      // 타르제거제
  | 'wheel_cleaner'    // 휠클리너
  | 'tire_dressing'    // 타이어드레싱
  | 'car_shampoo'      // 카샴푸
  | 'wash_mitt'        // 세차미트
  | 'wash_bucket'      // 세차버킷
  | 'clay_bar'         // 클레이바
  | 'drying_towel'     // 드라잉타월
  | 'air_dryer'        // 에어건 / 송풍기
  | 'quick_wax'        // 물왁스 / 퀵디테일러
  | 'carnauba_wax'     // 카나우바왁스
  | 'sealant'          // 실런트
  | 'ceramic_coating'  // 세라믹코팅제
  | 'glass_cleaner'    // 유리세정제
  | 'interior_cleaner'; // 실내클리너

export type PHProperty = 'acidic' | 'neutral' | 'alkaline';

export type WashIntensity = 'light' | 'deep';

export interface MySupply {
  id: string;
  category: SupplyCategory;
  name?: string;
  brand?: string;
  ph?: PHProperty;
  addedAt: string;
}

export interface WashStepTemplate {
  id: string;
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  required: SupplyCategory[];
  optional: SupplyCategory[];
  tips: string[];
  phNote?: string;
  skipSuggestion?: string;
  intensity: WashIntensity[];
}

export interface PlannedStep extends WashStepTemplate {
  availableSupplies: MySupply[];
  isMissing: boolean;
  skipSuggestion?: string;
}

export interface WashPlan {
  intensity: WashIntensity;
  steps: PlannedStep[];
  totalMinutes: { min: number; max: number };
  missingCategories: SupplyCategory[];
  warnings: string[];
  readyRatio: number;
}

export type WeatherCondition = 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy';

export interface WeatherDay {
  date: string;
  dayLabel: string;
  condition: WeatherCondition;
  rainProbability: number;
  temperature: number;
  humidity: number;
}

export interface OptimalDayResult {
  day: WeatherDay;
  score: number;
  daysFromNow: number;
}

// 추천 페이지용 — Naver API 연동에서 재활용
export interface RecommendProduct {
  id: string;
  name: string;
  brand: string;
  category: SupplyCategory;
  description: string;
  imageUrl?: string;
  link?: string;
  price?: number;
  mallName?: string;
  source: 'naver' | 'fallback';
}
