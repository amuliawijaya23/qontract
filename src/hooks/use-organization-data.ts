import { useEffect, useMemo } from 'react';

import { useParams } from 'next/navigation';
import { useAuthStore, useOrganizationStore } from './store';

import { useGetOrganizationPriceList } from './service/price';
import useGetOrganizationMembers from './service/member';

import subscribePriceList from '@/subscribers/price-list';
import subscribeTeamMembers from '@/subscribers/members';
import { useGetOrganizationClients } from './service/client';
import subscribeClients from '@/subscribers/clients';

export default function useOrganizationData() {
  const { organizationId } = useParams();
  const organizations = useAuthStore((state) => state.organizations);

  const setLoading = useOrganizationStore((state) => state.setLoading);

  const validOrgId = useMemo(
    () =>
      organizationId &&
      typeof organizationId === 'string' &&
      organizations.findIndex((org) => org.id === organizationId) !== -1
        ? organizationId
        : null,
    [organizationId, organizations]
  );

  const organization = useMemo(
    () => organizations.find((org) => org.id === validOrgId),
    [organizations, validOrgId]
  );

  const userIds = useMemo(
    () => (organization?.members ? Object.keys(organization.members) : []),
    [organization?.members]
  );

  const { isLoading: loading1, refetch: refetchPriceList } =
    useGetOrganizationPriceList();

  const { isLoading: loading2, refetch: refetchMembers } =
    useGetOrganizationMembers({ userIds });

  const { isLoading: loading3, refetch: refetchClients } =
    useGetOrganizationClients();

  useEffect(() => {
    if (!validOrgId) return;

    if (loading1 || loading2 || loading3) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    const membersUnsubscribe = subscribeTeamMembers({
      userIds,
      setMembers: refetchMembers,
    });

    const priceListUnsubscribe = subscribePriceList({
      organizationId: validOrgId,
      setPriceList: refetchPriceList,
    });

    const clientsUnsubscribe = subscribeClients({
      organizationId: validOrgId,
      setClients: refetchClients,
    });

    return () => {
      setLoading(false);
      membersUnsubscribe();
      priceListUnsubscribe();
      clientsUnsubscribe();
    };
  }, [
    validOrgId,
    userIds,
    loading1,
    loading2,
    loading3,
    setLoading,
    refetchMembers,
    refetchPriceList,
    refetchClients,
  ]);
}
