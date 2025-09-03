import { useQuery } from '@tanstack/react-query';

import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import { useParams } from 'next/navigation';
import { useAuthStore, useOrganizationStore } from '@/hooks/store';
import { useMemo } from 'react';
import { IUser } from '@/hooks/store/use-organization-store';

interface IUseGetOrganizationMembers {
  userIds: string[];
}

export default function useGetOrganizationMembers({
  userIds,
}: IUseGetOrganizationMembers) {
  const userId = useAuthStore((state) => state.user?.uid);
  const organizations = useAuthStore((state) => state.organizations);
  const setMembers = useOrganizationStore((state) => state.setMembers);

  const { organizationId } = useParams();

  const validOrgId = useMemo(
    () =>
      organizations.findIndex((org) => org.id === organizationId) !== -1
        ? organizationId
        : null,
    [organizationId, organizations]
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['members', organizationId],
    queryFn: async () => {
      const userCollection = collection(db, 'users');
      const userQuery = query(
        userCollection,
        where(documentId(), 'in', userIds)
      );

      const usersSnap = await getDocs(userQuery);
      const users = usersSnap.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IUser)
      );

      setMembers(users);
      return users;
    },
    retry: false,
    enabled: Boolean(userId) && Boolean(validOrgId) && userIds.length > 0,
  });

  return { data, isLoading, error, refetch };
}
