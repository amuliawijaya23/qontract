import { useMemo } from 'react';
import { db } from '@/firebase/config';
import { useAuthStore } from '@/hooks/store';
import useOrganizationStore, {
  IPriceListItem,
} from '@/hooks/store/use-organization-store';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'next/navigation';

export default function useGetOrganizationPriceList() {
  const userId = useAuthStore((state) => state.user?.uid);
  const organizations = useAuthStore((state) => state.organizations);

  const setPriceList = useOrganizationStore((state) => state.setPriceList);

  const { organizationId } = useParams();

  const validOrgId = useMemo(
    () =>
      organizations.findIndex((org) => org.id === organizationId) !== -1
        ? organizationId
        : null,
    [organizationId, organizations]
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['price-list', validOrgId],
    queryFn: async () => {
      const priceListCollection = collection(db, 'price-list');
      const orgPriceListQuery = query(
        priceListCollection,
        where('organizationId', '==', validOrgId)
      );

      const snapshot = await getDocs(orgPriceListQuery);

      const priceList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IPriceListItem[];

      setPriceList(priceList);
      return priceList;
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
