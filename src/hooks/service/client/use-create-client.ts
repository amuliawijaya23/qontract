import {
  addDoc,
  collection,
  getDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '@/firebase/config';
import { useMutation } from '@tanstack/react-query';

import { IClientSchema } from '@/validator/forms/client-form-schema';
import { useAuthStore } from '@/hooks/store';

import { useParams } from 'next/navigation';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface IUseCreateClient {
  onSuccess?: VoidFunction;
  onError: (e: Error) => void;
}

export default function useCreateClient(props?: IUseCreateClient) {
  const user = useAuthStore((state) => state.user);
  const organizations = useAuthStore((state) => state.organizations);

  const { organizationId } = useParams();

  return useMutation({
    mutationFn: async (data: IClientSchema) => {
      if (!user) throw new Error('Not Authenticated');

      if (organizations.findIndex((org) => org.id === organizationId) === -1) {
        throw new Error('Invalid/Unauthorized Organization Id');
      }

      const now = Timestamp.now();

      try {
        const clientCollection = collection(db, 'client');

        let imageURL: string | null = null;

        const clientDocRef = await addDoc(clientCollection, {
          name: data.name,
          personInCharge: data.personInCharge,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: {
            fullAddress: data.address.fullAddress,
            rt: data.address.rt,
            rw: data.address.rw,
            village: data.address.village,
            district: data.address.district,
            city: data.address.city,
            province: data.address.province,
            country: data.address.country,
            postalCode: data.address.postalCode,
          },
          organizationId: organizationId,
          createdBy: user.uid,
          updatedBy: user.uid,
          active: true,
          createdAt: now,
          updatedAt: now,
        });

        if (data.logo) {
          const storageRef = ref(
            storage,
            `organization-images/logo/${clientDocRef.id}/${data.logo.name}`
          );
          await uploadBytes(storageRef, data.logo);
          imageURL = await getDownloadURL(storageRef);
          await updateDoc(clientDocRef, { imageURL });
        }

        const doc = await getDoc(clientDocRef);

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
