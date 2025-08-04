import React from 'react';

import { useMemo } from 'react';

import { CssBaseline, GlobalStyles } from '@mui/material';
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';

import useThemeStore from '@/hooks/store/use-theme-store';

import { palette } from './palette';
import { typography } from './typography';
import { NextAppDirEmotionCacheProvider } from './emotion-cache';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useThemeStore((state) => state.mode);
  const themeDirection = useThemeStore((state) => state.direction);

  const memoizedValue = useMemo(
    () => ({
      palette: { ...palette(themeMode) },
      direction: themeDirection,
      typography,
    }),
    [themeMode, themeDirection]
  );

  const theme = createTheme(memoizedValue as ThemeOptions);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              backgroundColor: memoizedValue.palette.background.default,
              minHeight: '100vh',
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}

export default ThemeProvider;
