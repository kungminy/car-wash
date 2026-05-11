import { PHProperty, SupplyCategory } from '@/types';

export interface SupplyMeta {
  label: string;
  description: string;
  emoji: string;
  defaultPh?: PHProperty;
  group: '프리워시' | '본세차' | '디컨' | '드라잉' | '보호/마무리' | '선택';
}

export const SUPPLY_META: Record<SupplyCategory, SupplyMeta> = {
  pre_wash_foam: {
    label: '스노우폼 / 프리워시',
    description: '본세차 전 오염을 불려 제거하는 포말 세정제',
    emoji: '🫧',
    defaultPh: 'alkaline',
    group: '프리워시',
  },
  iron_remover: {
    label: '철분제거제',
    description: '브레이크 분진 등 철분 오염 화학적 제거',
    emoji: '🔴',
    defaultPh: 'acidic',
    group: '프리워시',
  },
  tar_remover: {
    label: '타르제거제',
    description: '도로 타르·수지 등 끈적한 오염 제거',
    emoji: '🖤',
    defaultPh: 'neutral',
    group: '프리워시',
  },
  wheel_cleaner: {
    label: '휠클리너',
    description: '휠에 붙은 브레이크 분진·오염 제거',
    emoji: '⚙️',
    defaultPh: 'alkaline',
    group: '프리워시',
  },
  tire_dressing: {
    label: '타이어드레싱',
    description: '타이어 광택·보호 마무리 제품',
    emoji: '🖤',
    group: '선택',
  },
  car_shampoo: {
    label: '카샴푸',
    description: '차체 오염을 안전하게 씻어내는 중성 세정제',
    emoji: '🧴',
    defaultPh: 'neutral',
    group: '본세차',
  },
  wash_mitt: {
    label: '세차미트',
    description: '스월마크 방지를 위한 극세사 세차용 장갑',
    emoji: '🧤',
    group: '본세차',
  },
  wash_bucket: {
    label: '세차버킷',
    description: '2버킷 세차법에 필요한 양동이 (그릿가드 권장)',
    emoji: '🪣',
    group: '본세차',
  },
  clay_bar: {
    label: '클레이바',
    description: '도장면에 박힌 오염물을 물리적으로 제거',
    emoji: '🪨',
    defaultPh: 'neutral',
    group: '디컨',
  },
  drying_towel: {
    label: '드라잉타월',
    description: '물기 흡수용 대형 극세사 타월',
    emoji: '🧻',
    group: '드라잉',
  },
  air_dryer: {
    label: '에어건 / 송풍기',
    description: '틈새 물기를 날리는 차량용 송풍 도구',
    emoji: '💨',
    group: '드라잉',
  },
  quick_wax: {
    label: '물왁스 / 퀵디테일러',
    description: '세차 후 간편하게 뿌리는 발수·광택 제품',
    emoji: '✨',
    defaultPh: 'neutral',
    group: '보호/마무리',
  },
  carnauba_wax: {
    label: '카나우바 왁스',
    description: '천연 카나우바 성분의 워시·페이스트 왁스',
    emoji: '🌿',
    defaultPh: 'neutral',
    group: '보호/마무리',
  },
  sealant: {
    label: '실런트',
    description: '합성 폴리머 기반 도장 보호막',
    emoji: '🛡️',
    defaultPh: 'neutral',
    group: '보호/마무리',
  },
  ceramic_coating: {
    label: '세라믹코팅제',
    description: '6개월~수년 지속되는 쿼츠 기반 코팅',
    emoji: '💎',
    defaultPh: 'neutral',
    group: '보호/마무리',
  },
  glass_cleaner: {
    label: '유리세정제',
    description: '차량 유리 유막·오염 제거',
    emoji: '🪟',
    defaultPh: 'acidic',
    group: '선택',
  },
  interior_cleaner: {
    label: '실내클리너',
    description: '대시보드·시트·카펫 등 실내 전용 세정제',
    emoji: '🚗',
    defaultPh: 'neutral',
    group: '선택',
  },
};

export const GROUP_ORDER: SupplyMeta['group'][] = [
  '프리워시',
  '본세차',
  '디컨',
  '드라잉',
  '보호/마무리',
  '선택',
];

export const ALL_CATEGORIES = Object.keys(SUPPLY_META) as SupplyCategory[];

export const PH_LABELS: Record<PHProperty, string> = {
  acidic: '산성',
  neutral: '중성',
  alkaline: '알칼리성',
};
