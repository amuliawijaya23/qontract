'use client';

import React, { ReactNode } from 'react';

import { Card, CardHeader, CardContent } from '@mui/material';
import useThemeStore from '@/hooks/store/use-theme-store';

interface ICardSubgroup {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}

export default function CardSubgroup({
  children,
  title,
  action,
}: ICardSubgroup) {
  const themeMode = useThemeStore((state) => state.mode);

  return (
    <Card sx={{ backgroundColor: (theme) => theme.palette.background.paper }}>
      <CardHeader
        title={title}
        slotProps={{
          title: {
            variant: 'h5',
            color: themeMode === 'dark' ? 'secondary' : 'primary',
          },
        }}
        action={action}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
