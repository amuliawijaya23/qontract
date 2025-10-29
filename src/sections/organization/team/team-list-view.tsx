import React, { useMemo } from 'react';

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Tooltip } from '@mui/material';

import moment from 'moment';

import AddIcon from '@mui/icons-material/Add';
import CustomDataGrid from '@/components/data-grid/custom-data-grid';
import ActionMenu from '@/components/action-menu';
import useOrganizationStore, {
  IUser,
} from '@/hooks/store/use-organization-store';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/hooks/store';
import useForm from '@/hooks/use-forms';
import useGetOrganizationMembers from '@/hooks/service/member';
import { Timestamp } from 'firebase/firestore';

const getColumns = ({
  role,
}: {
  role: string | null | undefined;
}): GridColDef<IUser>[] => [
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
    valueFormatter: (value: Timestamp | string) =>
      value === 'Online'
        ? value
        : moment(value).format('ddd DD/MM/YYYY hh:mm A'),
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
  const { openInviteForm } = useForm();

  const user = useAuthStore((state) => state.user);
  const organizations = useAuthStore((state) => state.organizations);

  const { organizationId } = useParams();

  const organization = useMemo(
    () => organizations.find((org) => org.id === organizationId),
    [organizationId, organizations]
  );

  const userIds = useMemo(
    () => (organization?.members ? Object.keys(organization.members) : []),
    [organization?.members]
  );

  const userRole = useMemo(() => {
    if (!user?.uid) return null;
    return organization?.members[user.uid];
  }, [organization?.members, user?.uid]);

  const members = useOrganizationStore((state) => state.members);

  const { isLoading } = useGetOrganizationMembers({ userIds });

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

  const columns = useMemo(() => getColumns({ role: userRole }), [userRole]);

  return (
    <CustomDataGrid
      columns={columns}
      rows={rows}
      action={
        <Tooltip title="Invite Member">
          <IconButton onClick={openInviteForm.onTrue}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      }
      loading={isLoading}
    />
  );
}
