import VisualMode from '@/validator/enums/visual-modes';
import { create } from 'zustand';

interface IVisualStore {
  mode: VisualMode;
  transition: (mode: VisualMode) => void;
}

const useVisualStore = create<IVisualStore>((set) => ({
  mode: VisualMode.DASHBOARD,
  transition: (mode: VisualMode) => set({ mode }),
}));

export default useVisualStore;
