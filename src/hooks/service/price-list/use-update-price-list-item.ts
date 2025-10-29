import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useMutation } from '@tanstack/react-query';
import { IPriceSchema } from '@/validator/forms/price-form-schema';
import { useAuthStore } from '@/hooks/store';
import { useParams } from 'next/navigation';

interface UseUpdatePriceItemProps {
  onSuccess?: VoidFunction;
  onError?: (e: Error) => void;
}

interface IData extends Partial<IPriceSchema> {
  active?: boolean;
  isDeleted?: boolean;
}

export default function useUpdatePriceListItem(props: UseUpdatePriceItemProps) {
  const { user, organizations } = useAuthStore();
  const { organizationId } = useParams();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IData }) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      if (organizations.findIndex((org) => org.id === organizationId) === -1) {
        throw new Error('Invalid/Unauthorized Organization Id');
      }

      const now = Timestamp.now();

      try {
        const priceDocRef = doc(db, 'price-list', id);
        const unitsCollection = collection(db, 'units');

        await runTransaction(db, async (transaction) => {
          const unitsQuery = query(
            unitsCollection,
            where('organizationId', '==', organizationId)
          );

          transaction.update(priceDocRef, {
            ...data,
            updatedBy: user.uid,
            updatedAt: now,
          });

          if (data.unit) {
            const snapshot = await getDocs(unitsQuery);
            const existingUnits = snapshot.docs.map((doc) => doc.data().unit);
            if (!existingUnits.includes(data.unit)) {
              const unitDocRef = doc(unitsCollection);
              transaction.set(unitDocRef, {
                unit: data.unit,
                organizationId,
                active: true,
                createdBy: user.uid,
                updatedBy: user.uid,
                createdAt: now,
                updatedAt: now,
              });
            }
          }
        });

        const updatedDoc = await getDoc(priceDocRef);
        return {
          id: updatedDoc.id,
          ...updatedDoc.data(),
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
