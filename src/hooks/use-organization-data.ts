import { useCallback, useEffect, useMemo } from 'react';

import { useParams } from 'next/navigation';
import { useAuthStore } from './store';

import subscribePriceList from '@/subscribers/price-list';
import subscribeTeamMembers from '@/subscribers/members';
import subscribeClients from '@/subscribers/clients';
import { useQueryClient } from '@tanstack/react-query';

export default function useOrganizationData() {
  const queryClient = useQueryClient();

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

  const refetchMembers = useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: ['members'] });
  }, [queryClient]);

  const refetchPriceList = useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: ['price-list'] });
  }, [queryClient]);

  const refetchClients = useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: ['clients'] });
  }, [queryClient]);

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
