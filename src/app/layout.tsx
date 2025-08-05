'use client';

import Navigation from '@/components/navigation';
import ThemeProvider from '@/theme';
import { Box, Paper } from '@mui/material';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navigation>
            <Box
              component={Paper}
              sx={{
                minHeight: '100vh',
                minWidth: '100vw',
                backgroundColor: (theme) => theme.palette.background.default,
                backgroundImage: 'none',
                boxShadow: 'none',
                overflowY: 'none',
                border: 'none',
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                py: 2,
                px: 2,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                '&-ms-overflow-style:': {
                  display: 'none',
                },
              }}
            >
              {children}
            </Box>
          </Navigation>
        </ThemeProvider>
      </body>
    </html>
  );
}
