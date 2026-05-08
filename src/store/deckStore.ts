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
  searchQuery: string;
  source: 'naver' | 'fallback';
  isLoading: boolean;
  error: string | null;
  initProducts: () => Promise<void>;
  filteredProducts: () => CarWashProduct[];
  toggleMyDeck: (id: string) => void;
  setActiveStep: (step: StepTag | 'all') => void;
  setSearchQuery: (query: string) => void;
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
      searchQuery: '',
      source: 'fallback',
      isLoading: false,
      error: null,

      initProducts: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/products');

          if (!response.ok) {
            throw new Error('상품 정보를 불러오지 못했습니다.');
          }

          const data = (await response.json()) as {
            products: CarWashProduct[];
            source: 'naver' | 'fallback';
          };

          set({
            allProducts: data.products,
            source: data.source,
            isLoading: false,
          });
        } catch {
          set({
            allProducts: mockProducts,
            source: 'fallback',
            isLoading: false,
            error: '상품 API 연결에 실패해 한국형 임시 데이터를 표시하고 있어요.',
          });
        }
      },

      filteredProducts: () => {
        const { allProducts, activeStep, searchQuery } = get();
        const query = searchQuery.trim().toLowerCase();
        const byStep =
          activeStep === 'all'
            ? allProducts
            : allProducts.filter((product) => product.stepTag === activeStep);

        if (!query) return byStep;

        return byStep.filter((product) =>
          [
            product.name,
            product.brand,
            product.stepTag,
            product.description,
            product.mallName ?? '',
          ]
            .join(' ')
            .toLowerCase()
            .includes(query)
        );
      },

      toggleMyDeck: (id) => {
        const { myDeck } = get();
        const updated = myDeck.includes(id)
          ? myDeck.filter((i) => i !== id)
          : [...myDeck, id];
        set({ myDeck: updated });
      },

      setActiveStep: (step) => set({ activeStep: step }),

      setSearchQuery: (query) => set({ searchQuery: query }),

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
