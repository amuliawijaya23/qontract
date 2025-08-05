import { create } from 'zustand';

interface IThemeSettings {
  mode: 'dark' | 'light';
  direction: 'rtl' | 'ltr';
  setMode: (mode: 'dark' | 'light') => void;
  setDirection: (direction: 'rtl' | 'ltr') => void;
  reset: () => void;
}

const useThemeStore = create<IThemeSettings>((set) => ({
  mode: 'dark',
  direction: 'ltr',
  setMode: (mode) => set({ mode }),
  setDirection: (direction) => set({ direction }),
  reset: () => set({ mode: 'dark', direction: 'ltr' }),
}));

export default useThemeStore;
