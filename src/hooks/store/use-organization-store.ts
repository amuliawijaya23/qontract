import { create } from 'zustand';

import { IPriceSchema } from '@/validator/forms/price-form-schema';
import { Timestamp } from 'firebase/firestore';
import { IClientSchema } from '@/validator/forms/client-form-schema';

export interface IUser {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isOnline: boolean;
  lastActive: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IPriceListItem extends IPriceSchema {
  id: string;
  organizationId: string;
  active: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}

export interface IClient extends Omit<IClientSchema, 'logo'> {
  id: string;
  imageURL: string | null;
  organizationId: string;
  active: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;
}

interface IOrganizationStore {
  loading: boolean;
  members: IUser[];
  priceList: IPriceListItem[];
  clients: IClient[];
  setLoading: (loading: boolean) => void;
  setMembers: (users: IUser[]) => void;
  setPriceList: (priceList: IPriceListItem[]) => void;
  setClients: (clients: IClient[]) => void;
  reset: VoidFunction;
}

const useOrganizationStore = create<IOrganizationStore>((set) => ({
  loading: false,
  members: [],
  priceList: [],
  clients: [],
  setLoading: (loading) => set({ loading }),
  setMembers: (members) => set({ members }),
  setPriceList: (priceList) => set({ priceList }),
  setClients: (clients) => set({ clients }),
  reset: () => set({ loading: false, members: [], priceList: [], clients: [] }),
}));

export default useOrganizationStore;
