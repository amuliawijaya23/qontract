'use client';

import React, { ReactNode, useCallback } from 'react';

import { styled, Theme, CSSObject } from '@mui/material/styles';
import { Box, List, Divider, Paper } from '@mui/material';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';

import AddIcon from '@mui/icons-material/Add';

import AppToolbar from '../app-toolbar';
import AppNavItem from './app-nav-item';

import useForm from '@/hooks/use-forms';
import { usePathname } from 'next/navigation';
import { useNavigationData } from '../nav-config';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/hooks/store';

export const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface IAppNav {
  children: ReactNode;
}

export default function AppNav({ children }: IAppNav) {
  const { openAddOrganizationForm } = useForm();
  const settings = useThemeStore();

  const router = useRouter();
  const pathname = usePathname();

  const { data } = useNavigationData();

  const handleNavOnClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, path: string) => {
      e.preventDefault();
      router.push(path);
    },
    [router]
  );

  return (
    <Box
      component={Paper}
      sx={{
        background: (theme) => theme.palette.background.default,
        display: 'flex',
        minWidth: '100vw',
        minHeight: '100vh',
      }}
    >
      <AppBar position="fixed" open={false}>
        <AppToolbar />
      </AppBar>
      {pathname.startsWith('/app') && (
        <Drawer
          variant="permanent"
          anchor={settings.direction === 'ltr' ? 'left' : 'right'}
          open={false}
        >
          <DrawerHeader />
          <Divider />
          <List>
            <>
              {data.map((d, index) => (
                <AppNavItem
                  key={`nav-organization-${d.title}-${index}`}
                  open={false}
                  title={d.title}
                  icon={d.logo}
                  onClick={(e) => handleNavOnClick(e, d.path)}
                />
              ))}
              <AppNavItem
                open={false}
                title="Add Board"
                icon={<AddIcon />}
                onClick={openAddOrganizationForm.onTrue}
              />
            </>
          </List>
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 2,
          py: 3,
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
