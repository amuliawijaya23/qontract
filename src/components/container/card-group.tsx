'use client';

import React, { ReactNode } from 'react';

import { Card, CardHeader, CardContent, Box, CardProps } from '@mui/material';
import useThemeStore from '@/hooks/store/use-theme-store';

interface CardGroupProps extends CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function CardGroup({
  children,
  title,
  subtitle,
  action,
}: CardGroupProps) {
  const themeMode = useThemeStore((state) => state.mode);

  return (
    <Card sx={{ backgroundColor: (theme) => theme.palette.background.default }}>
      <CardHeader
        title={title}
        subheader={subtitle}
        slotProps={{
          title: {
            variant: 'h4',
            color: themeMode === 'dark' ? 'secondary' : 'primary',
          },
          subheader: {
            variant: 'subtitle1',
          },
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            {action}
          </Box>
        }
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
