'use client';

import { StepTag } from '@/types';

export const STEP_TAGS: StepTag[] = [
  '1_휠/타이어',
  '2_프리워시',
  '3_본세차',
  '4_드라잉',
  '5_코팅/마무리',
];

export const STEP_SHORT_LABELS: Record<StepTag, string> = {
  '1_휠/타이어': '휠/타이어',
  '2_프리워시': '프리워시',
  '3_본세차': '본세차',
  '4_드라잉': '드라잉',
  '5_코팅/마무리': '코팅',
};

export const STEP_COLORS: Record<StepTag, string> = {
  '1_휠/타이어': 'bg-orange-400',
  '2_프리워시': 'bg-purple-400',
  '3_본세차': 'bg-blue-400',
  '4_드라잉': 'bg-green-400',
  '5_코팅/마무리': 'bg-pink-400',
};

export const STEP_TAG_STYLES: Record<StepTag, string> = {
  '1_휠/타이어': 'bg-orange-50 text-orange-700 border-orange-200',
  '2_프리워시': 'bg-purple-50 text-purple-700 border-purple-200',
  '3_본세차': 'bg-blue-50 text-blue-700 border-blue-200',
  '4_드라잉': 'bg-green-50 text-green-700 border-green-200',
  '5_코팅/마무리': 'bg-pink-50 text-pink-700 border-pink-200',
};

interface Props {
  activeStep: StepTag | 'all';
  onSelect: (step: StepTag | 'all') => void;
}

export default function StepTabBar({ activeStep, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onSelect('all')}
        className={[
          'flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
          activeStep === 'all'
            ? 'bg-slate-800 text-white border-slate-800'
            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300',
        ].join(' ')}
      >
        전체
      </button>
      {STEP_TAGS.map((step) => (
        <button
          key={step}
          onClick={() => onSelect(step)}
          className={[
            'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
            activeStep === step
              ? 'bg-slate-800 text-white border-slate-800'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300',
          ].join(' ')}
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STEP_COLORS[step]}`} />
          {STEP_SHORT_LABELS[step]}
        </button>
      ))}
    </div>
  );
}
