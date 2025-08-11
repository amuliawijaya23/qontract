'use client';

import React, { ReactNode } from 'react';

import { Card, CardHeader, CardContent } from '@mui/material';
import useThemeStore from '@/hooks/store/use-theme-store';

interface ICardGroup {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}

export default function CardGroup({ children, title, action }: ICardGroup) {
  const themeMode = useThemeStore((state) => state.mode);

  return (
    <Card>
      <CardHeader
        title={title}
        slotProps={{
          title: {
            variant: 'h4',
            color: themeMode === 'dark' ? 'secondary' : 'primary',
          },
        }}
        action={action}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
