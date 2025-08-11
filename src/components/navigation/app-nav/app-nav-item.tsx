import React, { ReactElement } from 'react';

import {
  Avatar,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';

interface IAppNavItem {
  open: boolean;
  title: string;
  icon: ReactElement;
  onClick: VoidFunction;
}

export default function AppNavItem({
  open,
  title,
  icon,
  onClick,
}: IAppNavItem) {
  return (
    <Tooltip title={title}>
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          onClick={onClick}
          sx={[
            { minHeight: 48, px: 2.5 },
            open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
          ]}
        >
          <ListItemIcon
            sx={[
              { minWidth: 0, justifyContent: 'center' },
              open ? { mr: 3 } : { mr: 'auto' },
            ]}
          >
            <Avatar variant="square">{icon}</Avatar>
          </ListItemIcon>
          <ListItemText
            primary={title}
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
    </Tooltip>
  );
}
