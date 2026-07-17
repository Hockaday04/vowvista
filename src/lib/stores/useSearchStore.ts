import { create } from 'zustand';

interface SearchState {
  query: string;
  category: string | null;
  location: string | null;
  priceRange: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  page: number;
  setQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  setLocation: (location: string | null) => void;
  setPriceRange: (priceRange: string | null) => void;
  setDateFrom: (date: string | null) => void;
  setDateTo: (date: string | null) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  getFilters: () => Record<string, string | null>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  category: null,
  location: null,
  priceRange: null,
  dateFrom: null,
  dateTo: null,
  page: 1,

  setQuery: (query) => set({ query, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setLocation: (location) => set({ location, page: 1 }),
  setPriceRange: (priceRange) => set({ priceRange, page: 1 }),
  setDateFrom: (dateFrom) => set({ dateFrom, page: 1 }),
  setDateTo: (dateTo) => set({ dateTo, page: 1 }),
  setPage: (page) => set({ page }),

  resetFilters: () =>
    set({
      query: '',
      category: null,
      location: null,
      priceRange: null,
      dateFrom: null,
      dateTo: null,
      page: 1,
    }),

  getFilters: () => {
    const state = get();
    return {
      query: state.query || null,
      category: state.category,
      location: state.location,
      priceRange: state.priceRange,
      dateFrom: state.dateFrom,
      dateTo: state.dateTo,
    };
  },
}));
