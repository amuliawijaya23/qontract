import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export default function LoadingSpinner({ height }: { height?: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height ? height : '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
