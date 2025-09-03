import { db } from '@/firebase/config';
import { useAuthStore } from '@/hooks/store';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { IOrganization } from '@/hooks/store/use-auth-store';

export default function useGetOrganizations() {
  const userId = useAuthStore((state) => state.user?.uid);
  const setOrganizations = useAuthStore((state) => state.setOrganizations);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['organizations', userId],
    queryFn: async () => {
      if (!userId) return [];

      const orgCollection = collection(db, 'organization');
      const orgQuery = query(
        orgCollection,
        where(`members.${userId}`, '!=', null)
      );

      const snapshot = await getDocs(orgQuery);

      const organizations: IOrganization[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IOrganization[];

      setOrganizations(organizations);
      return organizations;
    },
    retry: false,
    enabled: Boolean(userId),
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
