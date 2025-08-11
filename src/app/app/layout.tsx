'use client';
import React, { ReactNode } from 'react';

import Navigation from '@/components/navigation';

import { auth } from '@/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

import { redirect } from 'next/navigation';

export default function AppLayout({ children }: { children: ReactNode }) {
  const [user, loading] = useAuthState(auth);

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
