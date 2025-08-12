'use client';

import React, { useCallback } from 'react';

import { Button } from '@mui/material';
import { Google } from '@mui/icons-material';
import useSignInWithGoogle from '@/hooks/service/auth/use-sign-in-with-google';

export default function LoginWithGoogle() {
  const { mutate: signInWithGoogle } = useSignInWithGoogle();

  const handleSignInWithGoogle = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await signInWithGoogle();
    },
    [signInWithGoogle]
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
