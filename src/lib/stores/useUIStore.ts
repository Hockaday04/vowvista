import { create } from 'zustand';

interface UIState {
  mobileMenuOpen: boolean;
  searchModalOpen: boolean;
  cookieConsent: boolean | null;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setCookieConsent: (consent: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  searchModalOpen: false,
  cookieConsent: null,

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  setCookieConsent: (consent) => {
    set({ cookieConsent: consent });
    localStorage.setItem('cookieConsent', String(consent));
  },
}));
