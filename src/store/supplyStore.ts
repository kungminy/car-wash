import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MySupply, SupplyCategory } from '@/types';

interface SupplyStore {
  supplies: MySupply[];
  addSupply: (supply: Omit<MySupply, 'id' | 'addedAt'>) => void;
  removeSupply: (id: string) => void;
  updateSupply: (id: string, patch: Partial<Omit<MySupply, 'id' | 'addedAt'>>) => void;
  clearSupplies: () => void;
  hasCategory: (cat: SupplyCategory) => boolean;
  getByCategory: (cat: SupplyCategory) => MySupply[];
}

export const useSupplyStore = create<SupplyStore>()(
  persist(
    (set, get) => ({
      supplies: [],

      addSupply: (supply) => {
        const newSupply: MySupply = {
          ...supply,
          id: `supply-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          addedAt: new Date().toISOString(),
        };
        set((state) => ({ supplies: [...state.supplies, newSupply] }));
      },

      removeSupply: (id) => {
        set((state) => ({ supplies: state.supplies.filter((s) => s.id !== id) }));
      },

      updateSupply: (id, patch) => {
        set((state) => ({
          supplies: state.supplies.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        }));
      },

      clearSupplies: () => set({ supplies: [] }),

      hasCategory: (cat) => get().supplies.some((s) => s.category === cat),

      getByCategory: (cat) => get().supplies.filter((s) => s.category === cat),
    }),
    {
      name: 'car-wash-supplies',
    }
  )
);
