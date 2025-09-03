import { useMemo } from 'react';

import { useAuthStore } from '@/hooks/store';
import { Avatar } from '@mui/material';

export function useNavigationData() {
  const organizations = useAuthStore((state) => state.organizations);

  const data = useMemo(
    () =>
      organizations.length > 0
        ? organizations.map((org) => ({
            title: org.name,
            path: `/app/${org.id}`,
            logo: org.imageURL ? (
              <Avatar src={org.imageURL} sx={{ p: 0.5 }} />
            ) : (
              <Avatar>{org.name[0]?.toUpperCase() ?? 'A'}</Avatar>
            ),
          }))
        : [],
    [organizations]
  );

  return { data };
}
