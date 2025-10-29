import { useMemo } from 'react';
import { db } from '@/firebase/config';
import { useAuthStore } from '@/hooks/store';
import { useQuery } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { useParams } from 'next/navigation';

interface IUnit {
  id: string;
  unit: string;
  organizationId: string;
  active: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export default function useGetOrganizationUnits() {
  const userId = useAuthStore((state) => state.user?.uid);
  const organizations = useAuthStore((state) => state.organizations);

  const { organizationId } = useParams();

  const validOrgId = useMemo(
    () =>
      organizations.findIndex((org) => org.id === organizationId) !== -1
        ? organizationId
        : null,
    [organizationId, organizations]
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['units', validOrgId],
    queryFn: async () => {
      const unitsCollection = collection(db, 'units');
      const unitsQuery = query(
        unitsCollection,
        where('organizationId', '==', validOrgId)
      );

      const snapshot = await getDocs(unitsQuery);

      const units = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IUnit)
      );

      return units;
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
