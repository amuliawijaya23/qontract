'use client';

import ThemeProvider from '@/theme';
import Navigation from '@/components/navigation';
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
                backgroundColor: (theme) => theme.palette.background.default,
                backgroundImage: 'none',
                boxShadow: 'none',
                overflowY: 'auto',
                border: 'none',
                flexGrow: 1,
                minHeight: 1,
                display: 'flex',
                flexDirection: 'column',
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
