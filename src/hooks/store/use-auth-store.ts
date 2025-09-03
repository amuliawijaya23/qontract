import { create } from 'zustand';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { IOrganizationSchema } from '@/validator/forms/organization-form-schema';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { enqueueSnackbar } from 'notistack';

export interface IOrganization extends Omit<IOrganizationSchema, 'logo'> {
  id: string;
  imageURL: string | null;
  members: Record<string, string>;
}

interface IAuthStore {
  user: User | null;
  loading: boolean;
  organizations: IOrganization[];
  setUser: (user: User | null) => void;
  setOrganizations: (organizations: IOrganization[]) => void;
  addOrganization: (organization: IOrganization) => void;
  removeOrganization: (organizationId: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  loading: true,
  organizations: [],
  setUser: (user) => set({ user }),
  setOrganizations: (organizations) => set({ organizations }),
  addOrganization: (organization) =>
    set((state) => ({
      organizations: [...state.organizations, organization],
    })),
  removeOrganization: (organizationId) =>
    set((state) => ({
      organizations: state.organizations.filter(
        (org) => org.id !== organizationId
      ),
    })),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    const state = useAuthStore.getState();
    const user = state.user;

    if (user) {
      const now = Timestamp.now();
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          isOnline: false,
          lastActive: now,
        });
      } catch (_error) {
        enqueueSnackbar({
          variant: 'error',
          message: 'Failed to update presence on logout',
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        });
      }
    }
    await signOut(auth);
    set({ user: null, organizations: [] });
  },
}));

export const initAuthListener = () => {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setLoading(false);
  });
};

export default useAuthStore;
