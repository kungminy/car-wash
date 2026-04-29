import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CarWashProduct, StepTag } from '@/types';
import { mockProducts } from '@/lib/mockProducts';

const STEP_TAGS: StepTag[] = [
  '1_휠/타이어',
  '2_프리워시',
  '3_본세차',
  '4_드라잉',
  '5_코팅/마무리',
];

interface DeckStore {
  allProducts: CarWashProduct[];
  myDeck: string[];
  activeStep: StepTag | 'all';
  filteredProducts: () => CarWashProduct[];
  toggleMyDeck: (id: string) => void;
  setActiveStep: (step: StepTag | 'all') => void;
  isInMyDeck: (id: string) => boolean;
  myDeckProducts: () => CarWashProduct[];
  myDeckByStep: () => Partial<Record<StepTag, CarWashProduct[]>>;
  clearMyDeck: () => void;
}

export const useDeckStore = create<DeckStore>()(
  persist(
    (set, get) => ({
      allProducts: mockProducts,
      myDeck: [],
      activeStep: 'all',

      filteredProducts: () => {
        const { allProducts, activeStep } = get();
        if (activeStep === 'all') return allProducts;
        return allProducts.filter((p) => p.stepTag === activeStep);
      },

      toggleMyDeck: (id) => {
        const { myDeck } = get();
        const updated = myDeck.includes(id)
          ? myDeck.filter((i) => i !== id)
          : [...myDeck, id];
        set({ myDeck: updated });
      },

      setActiveStep: (step) => set({ activeStep: step }),

      isInMyDeck: (id) => get().myDeck.includes(id),

      myDeckProducts: () => {
        const { allProducts, myDeck } = get();
        return allProducts.filter((p) => myDeck.includes(p.id));
      },

      myDeckByStep: () => {
        const products = get().myDeckProducts();
        return STEP_TAGS.reduce((acc, step) => {
          const items = products.filter((p) => p.stepTag === step);
          if (items.length > 0) acc[step] = items;
          return acc;
        }, {} as Partial<Record<StepTag, CarWashProduct[]>>);
      },

      clearMyDeck: () => set({ myDeck: [] }),
    }),
    {
      name: 'car-wash-deck',
      partialize: (state) => ({ myDeck: state.myDeck }),
    }
  )
);
