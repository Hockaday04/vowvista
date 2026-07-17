import { create } from 'zustand';

interface FavouriteItem {
  id: string;
  businessName: string;
  category: string;
  location: string;
  imageUrl?: string;
}

interface FavouriteState {
  favourites: FavouriteItem[];
  loading: boolean;
  addFavourite: (item: FavouriteItem) => void;
  removeFavourite: (id: string) => void;
  isFavourited: (id: string) => boolean;
  setFavourites: (items: FavouriteItem[]) => void;
  clearFavourites: () => void;
}

export const useFavouriteStore = create<FavouriteState>((set, get) => ({
  favourites: [],
  loading: false,

  addFavourite: (item) =>
    set((state) => ({
      favourites: [...state.favourites, item],
    })),

  removeFavourite: (id) =>
    set((state) => ({
      favourites: state.favourites.filter((f) => f.id !== id),
    })),

  isFavourited: (id) => {
    const { favourites } = get();
    return favourites.some((f) => f.id === id);
  },

  setFavourites: (items) => set({ favourites: items }),

  clearFavourites: () => set({ favourites: [] }),
}));
