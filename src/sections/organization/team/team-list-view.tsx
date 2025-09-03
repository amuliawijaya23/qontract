import React, { useMemo } from 'react';

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Tooltip } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import CustomDataGrid from '@/components/data-grid/custom-data-grid';
import ActionMenu from '@/components/action-menu';
import useOrganizationStore, {
  IUser,
} from '@/hooks/store/use-organization-store';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/hooks/store';

const columns: GridColDef<IUser>[] = [
  {
    field: 'displayName',
    headerName: 'User',
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 300,
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 150,
  },
  {
    field: 'lastActive',
    headerName: 'Last Active',
    width: 200,
  },
  {
    field: 'id',
    headerName: 'Action',
    width: 75,
    renderCell: (params: GridRenderCellParams) => (
      <ActionMenu id={params.value} disabled={false} />
    ),
  },
];

export default function TeamListView() {
  const organizations = useAuthStore((state) => state.organizations);

  const { organizationId } = useParams();

  const organization = useMemo(
    () => organizations.find((org) => org.id === organizationId),
    [organizationId, organizations]
  );

  const loading = useOrganizationStore((state) => state.loading);
  const members = useOrganizationStore((state) => state.members);

  const rows = useMemo(
    () =>
      members.map((member) => {
        const role = organization
          ? `${organization.members[
              member.id
            ][0].toUpperCase()}${organization.members[member.id].substring(1)}`
          : '';
        return {
          ...member,
          role,
          lastActive: member.isOnline ? 'Online' : member.lastActive.toDate(),
        };
      }),
    [organization, members]
  );

  return (
    <CustomDataGrid
      columns={columns}
      rows={rows}
      action={
        <Tooltip title="Invite Member">
          <IconButton>
            <AddIcon />
          </IconButton>
        </Tooltip>
      }
      loading={loading}
    />
  );
}
