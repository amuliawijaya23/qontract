import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
  QueryDocumentSnapshot,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useMutation } from '@tanstack/react-query';
import { IAddOrganizationSchema } from '@/validator/forms/add-organization-form-schema';
import { useAuthStore } from '@/hooks/store';

interface IUseAddOrganization {
  onSuccess?: VoidFunction;
  onError?: (e: Error) => void;
}

interface IInvitationDoc {
  id: string;
  organizationId: string;
  code: string;
  role?: string;
  expiresAt: Timestamp;
}

export interface IUserOrganization {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  joinedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export default function useAddOrganization(props?: IUseAddOrganization) {
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({ code }: IAddOrganizationSchema) => {
      if (!user) {
        throw new Error('Not Authenticated');
      }

      const now = Timestamp.now();

      try {
        const inviteSnap = await getDocs(
          query(collection(db, 'invitation'), where('code', '==', code))
        );

        if (inviteSnap.empty) throw new Error('Invitation code not found');

        const inviteDoc = inviteSnap
          .docs[0] as QueryDocumentSnapshot<IInvitationDoc>;

        const {
          organizationId,
          role = 'member',
          expiresAt,
        } = inviteDoc.data() as IInvitationDoc;

        if (!organizationId)
          throw new Error('Invalid invitation: Missing organization id');

        if (expiresAt?.toMillis() < now.toMillis()) {
          throw new Error('Invitation code has expired');
        }

        const orgRef = doc(db, 'organization', organizationId);

        const orgSnap = await getDoc(orgRef);

        const orgData = orgSnap.exists() ? orgSnap.data() : null;

        if (!orgData)
          throw new Error('Invalid invitation: Organization does not exist');

        const members: Record<string, string> = orgData.members || {};

        if (members[user.uid])
          throw new Error('You have already joined this organization');

        members[user.uid] = role;

        await updateDoc(orgRef, {
          members,
          updatedAt: now,
        });

        return {
          id: orgRef.id,
          ...orgSnap.data(),
          members,
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
