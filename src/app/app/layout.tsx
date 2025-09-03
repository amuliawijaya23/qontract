'use client';
import React, { ReactNode } from 'react';

import { redirect } from 'next/navigation';
import { useAuthStore } from '@/hooks/store';
import useAppData from '@/hooks/use-app-data';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthStore();

  useAppData();

  return <>{!user && !loading ? redirect('/login') : !loading && children}</>;
}
