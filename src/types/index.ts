export type StepTag =
  | '1_휠/타이어'
  | '2_프리워시'
  | '3_본세차'
  | '4_드라잉'
  | '5_코팅/마무리';

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

export interface CarWashProduct {
  id: string;
  name: string;
  brand: string;
  stepTag: StepTag;
  description: string;
  capacity?: string;
  recommended: boolean;
}
