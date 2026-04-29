import { WeatherDay, OptimalDayResult } from '@/types';

export function calculateScore(day: WeatherDay): number {
  if (day.rainProbability > 40) return 0;
  const rainScore = (100 - day.rainProbability) * 0.6;
  const humidityScore = (100 - day.humidity) * 0.25;
  const conditionBonus =
    day.condition === 'sunny' ? 15 : day.condition === 'partly_cloudy' ? 5 : 0;
  return Math.round(rainScore + humidityScore + conditionBonus);
}

export function findOptimalDay(forecast: WeatherDay[]): OptimalDayResult | null {
  if (forecast.length === 0) return null;

  let bestIndex = 0;
  let bestScore = calculateScore(forecast[0]);

  for (let i = 1; i < forecast.length; i++) {
    const score = calculateScore(forecast[i]);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  if (bestScore === 0) return null;

  return {
    day: forecast[bestIndex],
    score: bestScore,
    daysFromNow: bestIndex,
  };
}

export function getScoreMessage(score: number): string {
  if (score >= 85) return '세차하기 딱 좋은 날이에요! ✨';
  if (score >= 60) return '세차하기 괜찮은 날이에요.';
  return '조금 아쉽지만 나쁘지 않아요.';
}

export function getDaysFromNowLabel(daysFromNow: number): string {
  if (daysFromNow === 0) return '오늘이 최적일!';
  if (daysFromNow === 1) return '내일이 최적일!';
  return `${daysFromNow}일 후가 최적일!`;
}
