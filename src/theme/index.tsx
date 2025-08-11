import React from 'react';

import { useMemo } from 'react';

import { Box, CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';

import useThemeStore from '@/hooks/store/use-theme-store';

import { palette } from './palette';
import { typography } from './typography';
import { NextAppDirEmotionCacheProvider } from './emotion-cache';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useThemeStore((state) => state.mode);
  const themeDirection = useThemeStore((state) => state.direction);

  const memoizedValue = useMemo(
    () => ({
      palette: {
        ...palette(themeMode),
      },
      direction: themeDirection,
      typography,
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1920,
          xxl: 2560,
        },
      },
    }),
    [themeMode, themeDirection]
  );

  const theme = createTheme(memoizedValue as ThemeOptions);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}

export default ThemeProvider;
