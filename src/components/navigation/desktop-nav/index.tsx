import React, { ReactNode } from 'react';

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

import DesktopAppBar from './desktop-app-bar';
import DesktopDrawer from './desktop-drawer';

export const drawerWidth = 240;

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface IDesktopNav {
  children: ReactNode;
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
}

export default function DesktopNav({
  children,
  open,
  onOpen,
  onClose,
}: IDesktopNav) {
  return (
    <Box sx={{ display: 'flex' }}>
      <DesktopAppBar open={open} onOpen={onOpen} />
      <DesktopDrawer open={open} onClose={onClose} />
      <Box>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
