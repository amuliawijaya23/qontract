import React, { ReactNode } from 'react';

import { Box, Breakpoint, Container, Stack, Typography } from '@mui/material';

interface IMainContainer {
  children: ReactNode;
  header?: string;
  subHeader?: string;
  maxWidth: false | Breakpoint | undefined;
  action?: ReactNode;
}

export default function MainContainer({
  children,
  header,
  subHeader,
  maxWidth,
  action,
}: IMainContainer) {
  return (
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
            {action && (
              <Box sx={{ flexShrink: 0 }} gap={1}>
                {action}
              </Box>
            )}
          </Stack>
        )}
        <Container maxWidth={maxWidth}>{children}</Container>
      </Stack>
    </Box>
  );
}
