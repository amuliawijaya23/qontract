'use client';
import React from 'react';

import ProjectListView from './projects';

import useVisualStore from '@/hooks/store/use-visual-store';
import VisualMode from '@/validator/enums/visual-modes';
import TeamListView from './team';
import PriceListView from './price-list';
import ClientListView from './clients';
import { useOrganizationData } from '@/hooks';

export default function OrganizationView() {
  const mode = useVisualStore((state) => state.mode);

  useOrganizationData();

  return (
    <>
      {mode === VisualMode.DASHBOARD && <>DASHBOARD</>}
      {mode === VisualMode.PROJECTS && <ProjectListView />}
      {mode === VisualMode.TEAM && <TeamListView />}
      {mode === VisualMode.CLIENTS && <ClientListView />}
      {mode === VisualMode.PRICE_LIST && <PriceListView />}
    </>
  );
}
