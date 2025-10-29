import { Box, Card, Toolbar } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import React from 'react';
import CustomNoRowsOverlay from '../no-row-overlay';

interface ICustomDataGrid extends DataGridProps {
  action?: React.ReactNode;
  loading?: boolean;
}

export default function CustomDataGrid({
  action,
  loading,
  sx,
  ...props
}: ICustomDataGrid) {
  return (
    <Card>
      <Toolbar>
        <Box sx={{ width: 1, display: 'flex' }}>
          <Box sx={{ flex: 1 }} />
          <Box>{action}</Box>
        </Box>
      </Toolbar>
      <DataGrid
        {...props}
        checkboxSelection
        disableRowSelectionOnClick
        showColumnVerticalBorder
        showCellVerticalBorder
        loading={loading}
        slotProps={{
          loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' },
        }}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        sx={{
          // Remove default focus outline
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
          // Subtle indicator for keyboard navigation
          '& .MuiDataGrid-cell:focus-visible': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)', // subtle blue
            borderRadius: 1,
          },
          '& .MuiDataGrid-columnHeader:focus-visible': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
            borderRadius: 1,
          },
          ...sx,
        }}
      />
    </Card>
  );
}
