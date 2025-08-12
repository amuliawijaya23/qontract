'use client';
import React from 'react';

import { Grid, Paper, Box, Typography, Avatar, Link } from '@mui/material';

import { redirect } from 'next/navigation';
import { useAuthStore } from '@/hooks/store';

const Copyright = () => {
  return (
    <Typography variant="body2" align="center" sx={{ mt: 5 }}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        Qontract
      </Link>
      {` ${new Date().getFullYear()}`}
      {'.'}
    </Typography>
  );
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthStore();

  return (
    <>
      {!loading && user ? (
        redirect('/app')
      ) : (
        <Grid container component={Paper} sx={{ height: '100vh' }}>
          <Grid size={{ xs: false, sm: 4, md: 7 }} />
          <Grid
            component={Paper}
            size={{ xs: 12, sm: 8, md: 5 }}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Avatar
                src=""
                alt="logo"
                sx={{ width: 100, height: 100, mb: 1 }}
              />
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  width: { xs: '100%', md: '80%', xl: '50%' },
                }}
              >
                {!loading && children}
              </Box>
              <Copyright />
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
}
