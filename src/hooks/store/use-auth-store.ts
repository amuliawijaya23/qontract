import { create } from 'zustand';
import { auth } from '@/firebase/config';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

interface IAuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

export const initAuthListener = () => {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setLoading(false);
  });
};

export default useAuthStore;
