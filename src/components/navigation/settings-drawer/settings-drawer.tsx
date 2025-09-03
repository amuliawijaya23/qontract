import React from 'react';

import {
  Badge,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloseIcon from '@mui/icons-material/Close';
import BaseOptions from './base-option';
import useThemeStore from '@/hooks/store/use-theme-store';
import Scrollbar from '@/components/scrollbar';

import { DrawerHeader } from '../app-nav/app-nav';
import useResponsive from '@/hooks/use-responsive';
import useForm from '@/hooks/use-forms';

export default function SettingsDrawer() {
  const { openSettings } = useForm();
  const settings = useThemeStore();
  const isLgUp = useResponsive('up', 'lg');

  const labelStyles = {
    mb: 1.5,
    color: 'text.disabled',
    fontWeight: 'fontWeightSemiBold',
  };

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h4" sx={{ flexGrow: 1 }}>
        Settings
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={settings.reset}>
          <Badge color="error" variant="dot">
            <RestartAltIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <IconButton onClick={openSettings.onFalse}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );

  const renderMode = (
    <div>
      <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
        Mode
      </Typography>
      <BaseOptions
        value={settings.mode}
        onChange={(newValue: string) =>
          settings.setMode(newValue as 'light' | 'dark')
        }
        options={['light', 'dark']}
        icons={['sun', 'moon']}
      />
    </div>
  );

  const renderDirection = (
    <div>
      <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
        Direction
      </Typography>
      <BaseOptions
        value={settings.direction}
        onChange={(newValue: string) =>
          settings.setDirection(newValue as 'rtl' | 'ltr')
        }
        options={['ltr', 'rtl']}
        icons={['align_left', 'align_right']}
      />
    </div>
  );

  return (
    <Drawer
      anchor="right"
      open={openSettings.value}
      onClose={openSettings.onFalse}
      slotProps={{
        backdrop: { invisible: true },
      }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          width: 280,
        },
      }}
    >
      {isLgUp && <DrawerHeader />}
      {renderHead}
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {renderMode}
          {renderDirection}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
