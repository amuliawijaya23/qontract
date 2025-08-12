'use client';

import React, { useCallback } from 'react';

import { Button } from '@mui/material';
import { Google } from '@mui/icons-material';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/firebase/config';

export default function LoginWithGoogle() {
  const handleSignInWithGoogle = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await signInWithPopup(auth, provider);
    },
    []
  );

  return (
    <Button
      variant="contained"
      startIcon={<Google />}
      sx={{
        backgroundColor: '#4285F4',
        color: 'white',
        '&:hover': { backgroundColor: '#357ae8' },
      }}
      onClick={handleSignInWithGoogle}
    >
      Sign in with Google
    </Button>
  );
}
