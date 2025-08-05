import React, { useMemo, useState, useCallback } from 'react';

import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { useResponsive } from '@/hooks/use-responsive';

interface IAppToolbar {
  open: boolean;
  onOpenSettings: VoidFunction;
  onToggle: VoidFunction;
}

export default function AppToolbar({
  open,
  onToggle,
  onOpenSettings,
}: IAppToolbar) {
  const isLgUp = useResponsive('up', 'lg');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setAnchorEl(event.currentTarget),
    []
  );

  const handleClose = useCallback(() => setAnchorEl(null), []);
  return (
    <Toolbar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexGrow: 1,
        }}
        gap={3}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onToggle}
          edge="start"
          sx={[isLgUp && open && { display: 'none' }]}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1 }}>
          QONTRACT
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }} gap={2}>
        <IconButton
          size="medium"
          color="inherit"
          edge="end"
          onClick={onOpenSettings}
        >
          <SettingsIcon />
        </IconButton>
        <IconButton
          size="medium"
          id="profile-menu"
          aria-controls={isOpen ? 'profile-menu' : undefined}
          aria-haspopup={true}
          aria-expanded={isOpen ? 'true' : undefined}
          onClick={handleOpen}
        >
          <Avatar />
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'profile-button',
              disablePadding: true,
            },
          }}
        >
          <MenuItem>Login</MenuItem>
          <MenuItem>Register</MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  );
}
