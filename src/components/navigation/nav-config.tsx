import { useMemo } from 'react';

import DashboardIcon from '@mui/icons-material/Dashboard';

export function useNavigationData() {
  const data = useMemo(
    () => [
      {
        items: [
          {
            title: 'Dashboard',
            path: '/app/dashboard',
            icon: <DashboardIcon />,
          },
          // TO Do: Add this when we have doctor dashboard
          // {
          //   title: 'Doctors',
          //   path: '/app/doctor',
          //   icon: <Iconify icon="fa6-solid:user-doctor" />,
          // },
        ],
      },
    ],
    []
  );

  return data;
}
