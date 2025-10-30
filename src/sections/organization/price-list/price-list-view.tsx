import React, { useCallback, useMemo } from 'react';

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
import { useUpdatePriceListItem } from '@/hooks/service/price-list';
import { enqueueSnackbar } from 'notistack';

const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}): GridColDef<Partial<IPriceListItem>>[] => [
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
    width: 50,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 100,
    align: 'center',
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
      <ActionMenu
        status={params.row.active}
        isDeleted={params.row.isDeleted}
        id={params.value}
        disabled={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];

export default function PriceListView() {
  const { handlePriceId, openPriceForm } = useForm();

  const members = useOrganizationStore((state) => state.members);
  const priceList = useOrganizationStore((state) => state.priceList);
  const isLoading = useOrganizationStore((state) => state.isLoadingPriceList);

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

  const { mutate: updatePriceItem, isPending } = useUpdatePriceListItem({
    onSuccess: () => {
      enqueueSnackbar({
        variant: 'success',
        message: 'Price item successfuly updated',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      openPriceForm.onFalse();
    },
    onError: (e) => {
      enqueueSnackbar({
        variant: 'error',
        message: e.message,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
    },
  });

  const handleEdit = useCallback(
    (id: string) => {
      handlePriceId(id);
      openPriceForm.onTrue();
    },
    [openPriceForm, handlePriceId]
  );

  const handleDelete = useCallback(
    (id: string) => {
      updatePriceItem({ id, data: { isDeleted: true } });
    },
    [updatePriceItem]
  );

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete]
  );

  return (
    <CustomDataGrid
      columns={columns}
      rows={rows}
      loading={isLoading || isPending}
      action={
        <Tooltip title="Add Item">
          <IconButton onClick={openPriceForm.onTrue}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      }
    />
  );
}
