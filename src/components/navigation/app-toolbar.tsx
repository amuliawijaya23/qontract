'use client';

import React, { useMemo, useState, useCallback } from 'react';

import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import useForm from '@/hooks/use-forms';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

import { useAuthStore } from '@/hooks/store';

export default function AppToolbar() {
  const { user, logout } = useAuthStore();
  const { openSettings } = useForm();
  const router = useRouter();

  const { organizationId } = useParams();

  const organization = useAuthStore((state) =>
    state.organizations.find((org) => org.id === organizationId)
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setAnchorEl(event.currentTarget),
    []
  );

  const handleClose = useCallback(() => setAnchorEl(null), []);

  const handleLogin = useCallback(() => router.push('/login'), [router]);
  const handleRegister = useCallback(() => router.push('/register'), [router]);

  const handleLogout = useCallback(() => logout(), [logout]);

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
        {organization?.imageURL && (
          <img src={organization.imageURL} width="50px" />
        )}
        <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1 }}>
          {organization?.name ? organization.name.toUpperCase() : 'QONTRACT'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }} gap={2}>
        <IconButton
          size="medium"
          color="inherit"
          edge="end"
          onClick={openSettings.onTrue}
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
          {user &&
            (user.photoURL ? (
              <Avatar>
                <Image
                  src={user.photoURL}
                  alt={user?.displayName || 'Profile-Picture'}
                  fill
                />
              </Avatar>
            ) : (
              <Avatar>
                {user.displayName && user.displayName[0].toUpperCase()}
              </Avatar>
            ))}
          {!user && <Avatar />}
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
          {!user && (
            <Stack>
              <MenuItem onClick={handleLogin}>Login</MenuItem>
              <MenuItem onClick={handleRegister}>Register</MenuItem>
            </Stack>
          )}
          {user && (
            <Stack>
              <MenuItem>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Stack>
          )}
        </Menu>
      </Box>
    </Toolbar>
  );
}
