import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
  runTransaction,
  doc,
} from 'firebase/firestore';
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
        const unitsCollection = collection(db, 'units');

        const priceDocRef = doc(priceListCollection);

        await runTransaction(db, async (transaction) => {
          const unitsQuery = query(
            unitsCollection,
            where('organizationId', '==', organizationId)
          );
          const snapshot = await getDocs(unitsQuery);
          const existingUnits = snapshot.docs.map((snap) => snap.data().unit);

          transaction.set(priceDocRef, {
            name: data.name,
            brand: data.brand,
            model: data.model,
            description: data.description,
            price: data.price,
            unit: data.unit,
            category: data.category,
            createdBy: user.uid,
            updatedBy: user.uid,
            organizationId: organizationId,
            active: true,
            isDeleted: false,
            createdAt: now,
            updatedAt: now,
          });

          if (!existingUnits.includes(data.unit)) {
            const unitDocRef = doc(unitsCollection);
            transaction.set(unitDocRef, {
              unit: data.unit,
              organizationId,
              active: true,
              isDeleted: false,
              createdBy: user.uid,
              updatedBy: user.uid,
              createdAt: now,
              updatedAt: now,
            });
          }
        });

        const document = await getDoc(priceDocRef);

        return {
          id: document.id,
          ...document.data(),
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
