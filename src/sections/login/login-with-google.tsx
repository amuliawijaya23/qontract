import React, { useCallback } from 'react';

import { Button } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';

export default function LoginWithGoogle() {
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const handleSignInWithGoogle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      signInWithGoogle();
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
