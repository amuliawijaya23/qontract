import React, { useMemo } from 'react';

import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

import { NumericFormat } from 'react-number-format';

import ActionMenu from '@/components/action-menu';
import CustomDataGrid from '@/components/data-grid/custom-data-grid';
import useForm from '@/hooks/use-forms';
import useOrganizationStore, {
  IPriceListItem,
} from '@/hooks/store/use-organization-store';

const columns: GridColDef<Partial<IPriceListItem>>[] = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'brand', headerName: 'Brand', width: 100 },
  { field: 'model', headerName: 'Model', width: 100 },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.4,
          }}
        >
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'price',
    headerName: 'Price',
    renderCell: (params: GridRenderCellParams) => (
      <NumericFormat
        type="text"
        value={params.value}
        prefix="Rp "
        suffix=",00"
        thousandSeparator="."
        decimalSeparator=","
        displayType="text"
      />
    ),
    width: 150,
  },
  {
    field: 'unit',
    headerName: 'Unit',
    width: 75,
  },
  {
    field: 'createdBy',
    headerName: 'Created By',
    width: 150,
  },
  {
    field: 'id',
    headerName: 'Actions',
    width: 75,
    renderCell: (params: GridRenderCellParams) => (
      <ActionMenu id={params.value} disabled={false} />
    ),
  },
];

export default function PriceListView() {
  const { openPriceForm } = useForm();

  const loading = useOrganizationStore((state) => state.loading);
  const members = useOrganizationStore((state) => state.members);
  const priceList = useOrganizationStore((state) => state.priceList);

  const rows = useMemo(
    () =>
      priceList.map((item) => {
        const createdBy = members.find(
          (m) => m.id === item.createdBy
        )?.displayName;
        return {
          ...item,
          createdBy,
        };
      }),
    [priceList, members]
  );

  return (
    <CustomDataGrid
      columns={columns}
      rows={rows}
      action={
        <Tooltip title="Add Item">
          <IconButton onClick={openPriceForm.onTrue}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      }
      loading={loading}
    />
  );
}
