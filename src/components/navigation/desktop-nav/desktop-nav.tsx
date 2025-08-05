import React, { ReactNode } from 'react';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import AppToolbar from '../app-toolbar';
import { INavItem } from '..';

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

const AppBar = styled(MuiAppBar, {
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

interface IDesktopNav {
  children: ReactNode;
  open: boolean;
  onOpenSettings: VoidFunction;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  data: {
    items: INavItem[];
  }[];
}

export default function DesktopNav({
  children,
  open,
  onOpenSettings,
  onOpen,
  onClose,
  data,
}: IDesktopNav) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <AppToolbar
          open={open}
          onToggle={onOpen}
          onOpenSettings={onOpenSettings}
        />
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={onClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {data.map((list, index) => (
            <React.Fragment key={`nav-drawer-list-${index}`}>
              {list.items.map((item, i) => (
                <ListItem
                  key={`nav-drawer-list-${index}-item-${i}`}
                  disablePadding
                  sx={{ display: 'block' }}
                >
                  <ListItemButton
                    sx={[
                      { minHeight: 48, px: 2.5 },
                      open
                        ? { justifyContent: 'initial' }
                        : { justifyContent: 'center' },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        { minWidth: 0, justifyContent: 'center' },
                        open ? { mr: 3 } : { mr: 'auto' },
                      ]}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      <Box>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
