import React, { ReactNode } from 'react';

import { Box, Container, Stack, Typography } from '@mui/material';

interface IMainContainer {
  children: ReactNode;
  header?: string;
  subHeader?: string;
}

export default function MainContainer({
  children,
  header,
  subHeader,
}: IMainContainer) {
  return (
    <Container maxWidth="xl">
      <Box>
        <Stack gap={3}>
          {(header || subHeader) && (
            <Stack direction="row">
              <Box sx={{ flexGrow: 1 }}>
                {header && (
                  <Typography variant="h2" color="textPrimary">
                    {header}
                  </Typography>
                )}
                {subHeader && (
                  <Typography variant="body1" color="textSecondary">
                    {subHeader}
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
          {children}
        </Stack>
      </Box>
    </Container>
  );
}
