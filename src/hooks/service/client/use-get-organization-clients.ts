import { useMemo } from 'react';
import { db } from '@/firebase/config';
import { useAuthStore } from '@/hooks/store';
import useOrganizationStore, {
  IClient,
} from '@/hooks/store/use-organization-store';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'next/navigation';

export default function useGetOrganizationClients() {
  const userId = useAuthStore((state) => state.user?.uid);
  const organizations = useAuthStore((state) => state.organizations);

  const setClients = useOrganizationStore((state) => state.setClients);

  const { organizationId } = useParams();

  const validOrgId = useMemo(
    () =>
      organizations.findIndex((org) => org.id === organizationId) !== -1
        ? organizationId
        : null,
    [organizationId, organizations]
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['client', validOrgId],
    queryFn: async () => {
      const clientCollection = collection(db, 'client');
      const clientQuery = query(
        clientCollection,
        where('organizationId', '==', validOrgId)
      );

      const snapshot = await getDocs(clientQuery);

      const clients = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IClient)
      );

      setClients(clients);
      return clients;
    },
    retry: false,
    enabled: Boolean(userId) && Boolean(validOrgId),
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
