import { MySupply, SupplyCategory } from '@/types';

const LIGHT_REQUIRED: SupplyCategory[] = ['car_shampoo', 'drying_towel'];
const LIGHT_RECOMMENDED: SupplyCategory[] = ['wheel_cleaner', 'pre_wash_foam', 'wash_mitt', 'quick_wax'];

const DEEP_REQUIRED: SupplyCategory[] = ['car_shampoo', 'drying_towel', 'iron_remover'];
const DEEP_RECOMMENDED: SupplyCategory[] = [
  'wheel_cleaner',
  'pre_wash_foam',
  'wash_mitt',
  'wash_bucket',
  'clay_bar',
  'tar_remover',
  'carnauba_wax',
];

function missing(supplies: MySupply[], cats: SupplyCategory[]): SupplyCategory[] {
  return cats.filter((cat) => !supplies.some((s) => s.category === cat));
}

export function getMissingForLight(supplies: MySupply[]) {
  return {
    required: missing(supplies, LIGHT_REQUIRED),
    recommended: missing(supplies, LIGHT_RECOMMENDED),
  };
}

export function getMissingForDeep(supplies: MySupply[]) {
  return {
    required: missing(supplies, DEEP_REQUIRED),
    recommended: missing(supplies, DEEP_RECOMMENDED),
  };
}

export function getReadinessForLight(supplies: MySupply[]): number {
  const total = LIGHT_REQUIRED.length + LIGHT_RECOMMENDED.length;
  const have =
    LIGHT_REQUIRED.filter((c) => supplies.some((s) => s.category === c)).length +
    LIGHT_RECOMMENDED.filter((c) => supplies.some((s) => s.category === c)).length;
  return total === 0 ? 0 : have / total;
}

export function getReadinessForDeep(supplies: MySupply[]): number {
  const total = DEEP_REQUIRED.length + DEEP_RECOMMENDED.length;
  const have =
    DEEP_REQUIRED.filter((c) => supplies.some((s) => s.category === c)).length +
    DEEP_RECOMMENDED.filter((c) => supplies.some((s) => s.category === c)).length;
  return total === 0 ? 0 : have / total;
}
