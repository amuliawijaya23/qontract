import { addDoc, collection, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase/config';
import { useMutation } from '@tanstack/react-query';
import { IOrganizationSchema } from '@/validator/forms/organization-form-schema';
import { useAuthStore } from '@/hooks/store';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface IUseCreateOrganization {
  onSuccess?: VoidFunction;
  onError?: (e: Error) => void;
}

export default function useCreateOrganization(props?: IUseCreateOrganization) {
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (data: IOrganizationSchema) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const now = Timestamp.now();

      try {
        const organizationCollection = collection(db, 'organization');

        let imageURL: string | null = null;

        const orgDocRef = await addDoc(organizationCollection, {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          whatsappNumber: data.whatsappNumber,
          websiteUrl: data.websiteUrl,
          instagram: data.instagram,
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
          createdAt: now,
          updatedAt: now,
          members: {
            [user.uid]: 'owner',
          },
        });

        if (data.logo) {
          const storageRef = ref(
            storage,
            `organization-images/logo/${orgDocRef.id}/${data.logo.name}`
          );
          await uploadBytes(storageRef, data.logo);
          imageURL = await getDownloadURL(storageRef);
          await updateDoc(orgDocRef, { imageURL });
        }

        return {
          id: orgDocRef.id,
          imageURL: imageURL,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          whatsappNumber: data.whatsappNumber,
          websiteUrl: data.websiteUrl,
          instagram: data.instagram,
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
          createdAt: now,
          updatedAt: now,
          members: {
            [user.uid]: 'owner',
          },
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
