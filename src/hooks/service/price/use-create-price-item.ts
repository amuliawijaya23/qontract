import { addDoc, collection, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useMutation } from '@tanstack/react-query';

import { IPriceSchema } from '@/validator/forms/price-form-schema';
import { useAuthStore } from '@/hooks/store';

import { useParams } from 'next/navigation';

interface IUseCreatePriceItem {
  onSuccess?: VoidFunction;
  onError?: (e: Error) => void;
}

export default function useCreatePriceItem(props?: IUseCreatePriceItem) {
  const { user, organizations } = useAuthStore();

  const { organizationId } = useParams();

  return useMutation({
    mutationFn: async (data: IPriceSchema) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      if (organizations.findIndex((org) => org.id === organizationId) === -1) {
        throw new Error('Invalid/Unauthorized Organization Id');
      }

      const now = Timestamp.now();

      try {
        const priceListCollection = collection(db, 'price-list');

        const priceDocRef = await addDoc(priceListCollection, {
          name: data.name,
          brand: data.brand,
          model: data.model,
          description: data.description,
          price: data.price,
          unit: data.unit,
          createdBy: user.uid,
          updatedBy: user.uid,
          organizationId: organizationId,
          active: true,
          createdAt: now,
          updatedAt: now,
        });

        const doc = await getDoc(priceDocRef);

        return {
          id: doc.id,
          ...doc.data(),
        };
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(message);
      }
    },
    ...props,
    retry: false,
  });
}
