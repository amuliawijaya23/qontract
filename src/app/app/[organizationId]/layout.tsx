'use client';

import React, { ReactNode, useCallback } from 'react';

import { Divider, Stack, Tab, Tabs } from '@mui/material';

import { MainContainer } from '@/components/container';

import useVisualStore from '@/hooks/store/use-visual-store';
import VisualMode from '@/validator/enums/visual-modes';

const header = {
  dashboard: {
    header: VisualMode.DASHBOARD.toUpperCase(),
    subHeader: 'Your organization at a glance, all in one place.',
  },
  projects: {
    header: VisualMode.PROJECTS.toUpperCase(),
    subHeader: 'Track, organize, and monitor all your projects in one place.',
  },
  clients: {
    header: VisualMode.CLIENTS.toUpperCase(),
    subHeader: 'View and manage your client relationships efficiently.',
  },
  price_list: {
    header: VisualMode.PRICE_LIST.toUpperCase(),
    subHeader: 'View and manage your price list with ease.',
  },
  team: {
    header: VisualMode.TEAM.toUpperCase(),
    subHeader: 'Organize your team members and roles seamlessly.',
  },
};

export default function OrganizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { mode, transition } = useVisualStore();

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: VisualMode) => {
      transition(newValue);
    },
    [transition]
  );

  return (
    <MainContainer
      maxWidth="xl"
      header={`${header[mode].header.split('_').join(' ')}`}
      subHeader={header[mode].subHeader}
    >
      <Tabs value={mode} onChange={handleChange}>
        <Tab label={VisualMode.DASHBOARD} value={VisualMode.DASHBOARD} />
        <Tab label={VisualMode.PROJECTS} value={VisualMode.PROJECTS} />
        <Tab label={VisualMode.CLIENTS} value={VisualMode.CLIENTS} />
        <Tab
          label={VisualMode.PRICE_LIST.split('_').join(' ')}
          value={VisualMode.PRICE_LIST}
        />
        <Tab label={VisualMode.TEAM} value={VisualMode.TEAM} />
      </Tabs>
      <Divider />
      <Stack gap={3}>{children}</Stack>
    </MainContainer>
  );
}
