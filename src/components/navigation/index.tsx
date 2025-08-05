import React, { ReactNode } from 'react';

import { useBoolean } from '@/hooks/use-boolean';
import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';
import { useResponsive } from '@/hooks/use-responsive';

function Navigation({ children }: { children: ReactNode }) {
  const isLgUp = useResponsive('up', 'lg');

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
