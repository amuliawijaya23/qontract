import React, { ReactNode } from 'react';

import { useBoolean } from '@/hooks/use-boolean';
import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';
import { useResponsive } from '@/hooks/use-responsive';
import { useNavigationData } from './nav-config';
import SettingsDrawer from './settings-drawer';

export interface INavItem {
  title: string;
  path?: string;
  icon: React.ReactElement;
}

export default function Navigation({ children }: { children: ReactNode }) {
  const isLgUp = useResponsive('up', 'lg');

  const isMenuOpen = useBoolean();
  const isSettingsOpen = useBoolean();

  const navData = useNavigationData();

  return (
    <>
      {isLgUp ? (
        <DesktopNav
          open={isMenuOpen.value}
          onOpenSettings={isSettingsOpen.onTrue}
          onOpen={isMenuOpen.onTrue}
          onClose={isMenuOpen.onFalse}
          data={navData}
        >
          {children}
        </DesktopNav>
      ) : (
        <MobileNav
          open={isMenuOpen.value}
          onOpenSettings={isSettingsOpen.onTrue}
          onOpen={isMenuOpen.onTrue}
          onClose={isMenuOpen.onFalse}
          onToggle={isMenuOpen.onToggle}
          data={navData}
        >
          {children}
        </MobileNav>
      )}
      <SettingsDrawer
        open={isSettingsOpen.value}
        onClose={isSettingsOpen.onFalse}
      />
    </>
  );
}
