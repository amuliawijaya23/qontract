import { useEffect, useMemo } from 'react';

import { useParams } from 'next/navigation';
import { useAuthStore } from './store';

import subscribePriceList from '@/subscribers/price-list';
import subscribeTeamMembers from '@/subscribers/members';
import subscribeClients from '@/subscribers/clients';
import { useGetOrganizationPriceList } from './service/price-list';
import useGetOrganizationMembers from './service/member';
import { useGetOrganizationClients } from './service/client';

export default function useOrganizationData() {
  const { organizationId } = useParams();
  const organizations = useAuthStore((state) => state.organizations);

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

  const { refetch: refetchMembers } = useGetOrganizationMembers({ userIds });
  const { refetch: refetchPriceList } = useGetOrganizationPriceList();
  const { refetch: refetchClients } = useGetOrganizationClients();

  useEffect(() => {
    if (!validOrgId) return;

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
      membersUnsubscribe();
      priceListUnsubscribe();
      clientsUnsubscribe();
    };
  }, [validOrgId, userIds, refetchMembers, refetchPriceList, refetchClients]);
}
