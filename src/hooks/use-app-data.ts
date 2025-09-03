import { useEffect } from 'react';
import { useAuthStore } from './store';
import { subscribeOrganizations } from '@/subscribers/organizations';
import { useGetOrganizations } from './service/organization';

export default function useAppData() {
  const userId = useAuthStore((state) => state.user?.uid);
  const loading = useAuthStore((state) => state.loading);

  const { refetch } = useGetOrganizations();

  useEffect(() => {
    if (!userId || loading) return;

    const orgUnsubscribe = subscribeOrganizations({
      userId: userId || '',
      setOrganizations: refetch,
    });

    return () => {
      orgUnsubscribe();
    };
  }, [userId, loading, refetch]);
}
