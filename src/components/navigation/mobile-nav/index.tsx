import React, { ReactNode } from 'react';

import { Box } from '@mui/material';
import MobileAppBar from './mobile-app-bar';
import MobileDrawer from './mobile-drawer';

interface IMobileNav {
  children: ReactNode;
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  onToggle: VoidFunction;
}

export default function MobileNav({
  children,
  open,
  onOpen,
  onClose,
  onToggle,
}: IMobileNav) {
  return (
    <Box>
      <MobileAppBar onToggle={onToggle} />
      <MobileDrawer open={open} onOpen={onOpen} onClose={onClose} />
      {children}
    </Box>
  );
}
