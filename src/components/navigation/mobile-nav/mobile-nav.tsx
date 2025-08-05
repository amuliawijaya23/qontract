import React, { ReactNode } from 'react';

import {
  Box,
  AppBar,
  SwipeableDrawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import AppToolbar from '../app-toolbar';
import { INavItem } from '..';

interface IMobileNav {
  children: ReactNode;
  open: boolean;
  onOpenSettings: VoidFunction;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  onToggle: VoidFunction;
  data: {
    items: INavItem[];
  }[];
}

export default function MobileNav({
  children,
  open,
  onOpenSettings,
  onOpen,
  onClose,
  onToggle,
  data,
}: IMobileNav) {
  return (
    <Box>
      <AppBar position="static">
        <AppToolbar
          open={open}
          onToggle={onToggle}
          onOpenSettings={onOpenSettings}
        />
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onOpen={onOpen}
        onClose={onClose}
      >
        <Box sx={{ width: 240 }} role="presentation">
          <List>
            {data.map((list, index) => (
              <React.Fragment key={`nav-drawer-list-${index}`}>
                {list.items.map((item, i) => (
                  <ListItem
                    key={`nav-drawer-list-${index}-item-${i}`}
                    disablePadding
                  >
                    <ListItemButton>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>
      {children}
    </Box>
  );
}
