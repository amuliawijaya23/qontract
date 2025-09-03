import React from 'react';

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Tooltip } from '@mui/material';

import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import AddIcon from '@mui/icons-material/Add';

import useForm from '@/hooks/use-forms';
import CustomDataGrid from '@/components/data-grid/custom-data-grid';
import ActionMenu from '@/components/action-menu';

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'reference',
    headerName: 'Reference',
    width: 150,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 300,
    flex: 1,
  },
  {
    field: 'client',
    headerName: 'Client',
    width: 250,
  },
  {
    field: 'startsAt',
    headerName: 'Start Date',
    width: 150,
  },
  {
    field: 'endsAt',
    headerName: 'End Date',
    width: 150,
  },
  {
    field: 'status',
    headerName: 'Status',
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

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function ProjectListView() {
  const { openProjectTemplateForm } = useForm();

  return (
    <CustomDataGrid
      columns={columns}
      rows={rows}
      action={
        <>
          <Tooltip title="Add Project">
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Project Template">
            <IconButton onClick={openProjectTemplateForm.onTrue}>
              <DashboardCustomizeIcon />
            </IconButton>
          </Tooltip>
        </>
      }
    />
  );
}
