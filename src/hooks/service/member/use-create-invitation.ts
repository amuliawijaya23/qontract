import crypto from 'crypto';

import { useAuthStore } from '@/hooks/store';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { addDoc, collection, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { IInvitationSchema } from '@/validator/forms/team-form-schema';
import UserOrganizationRoles from '@/validator/enums/user-organization-roles';

export interface IInvitation {
  id: string;
  code: string;
  emails: string[];
  role: string;
  organizationId: string;
  expiresAt: Timestamp;
}

interface IUseCreateInvitation {
  onSuccess?: (data: IInvitation) => void;
  onError?: (e: Error) => void;
}

export default function useCreateInvitation(props?: IUseCreateInvitation) {
  const user = useAuthStore((state) => state.user);
  const organizations = useAuthStore((state) => state.organizations);
  const { organizationId } = useParams();

  return useMutation({
    mutationFn: async (data: IInvitationSchema) => {
      if (!user) throw new Error('Not Authorized');
      if (!organizationId) throw new Error('Missing Organization Id');

      const organization = organizations.find(
        (org) => org.id === organizationId
      );

      if (!organization) throw new Error('Invalid Organization Id');

      const userRole = organization.members[user.uid] as UserOrganizationRoles;
      if (
        ![UserOrganizationRoles.Admin, UserOrganizationRoles.Owner].includes(
          userRole || ''
        )
      ) {
        throw new Error('Not Authorized');
      }

      const now = Timestamp.now();
      const expiresAt = Timestamp.fromDate(
        new Date(now.toDate().getTime() + 24 * 60 * 60 * 1000)
      );

      try {
        const invitationCollection = collection(db, 'invitation');

        const alphaNumericCode = crypto.randomBytes(8).toString('hex');
        const codePrefix = organization.name
          .split(' ')
          .map((word) => word[0].toUpperCase())
          .join('');

        const code = `${codePrefix}:${alphaNumericCode}`;

        const invitationDocRef = await addDoc(invitationCollection, {
          code,
          emails: data.emails.map((item) => item.email),
          role: data.role,
          organizationId,
          expiresAt,
        } as IInvitation);

        const snapshot = await getDoc(invitationDocRef);

        return {
          id: snapshot.id,
          code,
          emails: data.emails.map((item) => item.email),
          role: data.role,
          organizationId,
          expiresAt,
        } as IInvitation;
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
