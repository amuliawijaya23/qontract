'use client';
import React, { ReactNode } from 'react';

import Navigation from '@/components/navigation';

import { redirect } from 'next/navigation';
import { useAuthStore } from '@/hooks/store';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthStore();

  return (
    <>
      {!user && !loading ? (
        redirect('/login')
      ) : (
        <Navigation>{!loading && children}</Navigation>
      )}
    </>
  );
}
