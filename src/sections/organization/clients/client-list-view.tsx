import React, { useMemo } from 'react';

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import CustomDataGrid from '@/components/data-grid/custom-data-grid';
import ActionMenu from '@/components/action-menu';
import useForm from '@/hooks/use-forms';
import { useOrganizationStore } from '@/hooks/store';
import { IClient } from '@/hooks/store/use-organization-store';
import { useGetOrganizationClients } from '@/hooks/service/client';

const getColumns = (): GridColDef<IClient>[] => [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'address',
    headerName: 'Address',
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.4,
          }}
        >{`${params.value.fullAddress}, RT${params.value.rt}/RW${params.value.rw}, ${params.value.district}, Kecamatan ${params.value.village}, ${params.value.city} ${params.value.postalCode}`}</Typography>
      </Box>
    ),
  },
  {
    field: 'personInCharge',
    headerName: 'Person In Charge',
    width: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone Number',
    width: 150,
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

export default function ClientListView() {
  const { openClientsForm } = useForm();

  const clients = useOrganizationStore((state) => state.clients);

  const { isLoading } = useGetOrganizationClients();

  const rows = useMemo(() => clients, [clients]);

  const columns = useMemo(() => getColumns(), []);

  return (
    <CustomDataGrid
      columns={columns}
      rows={rows}
      action={
        <Tooltip title="Add Client">
          <IconButton onClick={openClientsForm.onTrue}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      }
      density="comfortable"
      loading={isLoading}
    />
  );
}
