import React, { ReactNode } from 'react';

import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import { useBoolean } from '@/hooks/use-boolean';
import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';

function Navigation({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const isOpen = useBoolean();

  return (
    <>
      {isLgUp ? (
        <DesktopNav
          open={isOpen.value}
          onOpen={isOpen.onTrue}
          onClose={isOpen.onFalse}
        >
          {children}
        </DesktopNav>
      ) : (
        <MobileNav
          open={isOpen.value}
          onOpen={isOpen.onTrue}
          onClose={isOpen.onFalse}
          onToggle={isOpen.onToggle}
        >
          {children}
        </MobileNav>
      )}
    </>
  );
}

export default Navigation;
