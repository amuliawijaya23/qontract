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
  isDeleted: boolean;
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
  members: IUser[];
  priceList: IPriceListItem[];
  clients: IClient[];
  isLoadingMembers: boolean;
  isLoadingPriceList: boolean;
  isLoadingClients: boolean;
  setMembers: (users: IUser[]) => void;
  setPriceList: (priceList: IPriceListItem[]) => void;
  setClients: (clients: IClient[]) => void;
  setIsLoadingMembers: (value: boolean) => void;
  setIsLoadingPriceList: (value: boolean) => void;
  setIsLoadingClients: (value: boolean) => void;
  reset: VoidFunction;
}

const useOrganizationStore = create<IOrganizationStore>((set) => ({
  members: [],
  priceList: [],
  clients: [],
  isLoadingMembers: false,
  isLoadingPriceList: false,
  isLoadingClients: false,
  setMembers: (members) => set({ members }),
  setPriceList: (priceList) => set({ priceList }),
  setClients: (clients) => set({ clients }),
  setIsLoadingMembers: (isLoadingMembers) => set({ isLoadingMembers }),
  setIsLoadingPriceList: (isLoadingPriceList) => set({ isLoadingPriceList }),
  setIsLoadingClients: (isLoadingClients) => set({ isLoadingClients }),
  reset: () => set({ members: [], priceList: [], clients: [] }),
}));

export default useOrganizationStore;
