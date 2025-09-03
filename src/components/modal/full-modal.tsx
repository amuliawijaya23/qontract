import React, { ReactNode, useEffect, forwardRef } from 'react';

import {
  Card,
  Stack,
  Dialog,
  IconButton,
  Typography,
  DialogProps,
  Grid,
} from '@mui/material';
import { Close } from '@mui/icons-material';

import { Transition } from './transition';

export interface IFullModal extends DialogProps {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  action?: ReactNode;
  defaultOpened?: boolean;
  onDisappear?: VoidFunction;
  onAppear?: VoidFunction;
  onClose: (
    event: object,
    reason: 'backdropClick' | 'escapeKeyDown' | string
  ) => void;
}

const FullModal = forwardRef(
  (
    {
      title,
      subtitle,
      children,
      footer,
      onAppear,
      onDisappear,
      open,
      onClose,
      action,
      ...dialogProps
    }: IFullModal,
    _ref
  ) => {
    useEffect(() => {
      if (open) {
        onAppear?.();
      } else {
        onDisappear?.();
      }
    }, [open, onAppear, onDisappear]);

    return (
      <Dialog
        {...dialogProps}
        onClose={onClose}
        fullScreen
        scroll="body"
        open={open}
        slots={{ transition: Transition }}
        slotProps={{
          paper: {
            sx: {
              background: (theme) => theme.palette.background.default,
            },
          },
        }}
      >
        <Stack height="100%" gap={2}>
          <Stack
            sx={{
              paddingX: { xs: 1, md: 3 },
              paddingY: { xs: 1, md: 2 },
              position: 'sticky',
            }}
          >
            <Card variant="outlined">
              <Grid container p={2}>
                <Grid
                  size={{ xs: 12 }}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                  }}
                >
                  <Stack flexGrow={1}>
                    <Stack flex={1} direction="row" alignItems="center" gap={2}>
                      <Typography>
                        <IconButton
                          onClick={(event) => onClose(event, 'escapeKeyDown')}
                        >
                          <Close />
                        </IconButton>
                      </Typography>
                      <Stack flexGrow={1}>
                        {title && (
                          <Typography color="text.header" variant="h4">
                            {title}
                          </Typography>
                        )}
                        {subtitle && (
                          <Typography variant="body1" color="text.secondary">
                            {subtitle}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ display: 'flex', justifyContent: 'end' }}
                  >
                    {action && action}
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Stack>
          <Stack flexGrow={1} sx={{ overflowY: 'auto', p: 2 }}>
            {children}
          </Stack>
          {footer && (
            <Stack
              sx={{
                paddingX: 3,
                paddingY: 2,
                position: 'sticky',
              }}
            >
              {footer}
            </Stack>
          )}
        </Stack>
      </Dialog>
    );
  }
);

FullModal.displayName = 'FullModal';

export default FullModal;
