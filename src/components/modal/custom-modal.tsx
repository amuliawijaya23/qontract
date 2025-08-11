'use client';

import { useMemo, useEffect, forwardRef } from 'react';

import { useTheme } from '@mui/material/styles';

import {
  Stack,
  alpha,
  Paper,
  Dialog,
  Backdrop,
  IconButton,
  Typography,
  PaperProps,
  StackProps,
  DialogProps,
} from '@mui/material';
import { Close } from '@mui/icons-material';

import { Transition } from './transition';

export type ICustomModalSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export enum CustomModalSizes {
  xs = 320, // Extra small - mobile
  sm = 480, // Small - larger mobile/small tablet
  md = 640, // Medium - tablet
  lg = 960, // Large - small desktop
  xl = 1280, // Extra large - desktop
}

export interface ICustomModal extends DialogProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  defaultOpened?: boolean;
  size?: ICustomModalSizes;
  onDisappear?: VoidFunction;
  onAppear?: VoidFunction;
  onClose: (
    event: object,
    reason: 'backdropClick' | 'escapeKeyDown' | string
  ) => void;
  childrenStackProps?: StackProps;
}

const CustomModal = forwardRef(
  (
    {
      title,
      subtitle,
      children,
      action,
      size = 'md',
      onAppear,
      onDisappear,
      open,
      onClose,
      childrenStackProps,
      ...dialogProps
    }: ICustomModal,
    _ref
  ) => {
    const themeSetting = useTheme();
    useEffect(() => {
      if (open) {
        onAppear?.();
      } else {
        onDisappear?.();
      }
    }, [open, onAppear, onDisappear]);

    const { ...otherChildrenStackProps } = childrenStackProps || {};

    // Memoize the slots to prevent unnecessary re-renders
    const slots = useMemo(
      () => ({
        backdrop: Backdrop,
        transition: Transition,
        paper: (
          props: PaperProps & {
            children: React.ReactElement;
          }
        ) => (
          <Paper
            {...props}
            sx={{
              ...props.sx,
              zIndex: 999,
              width: CustomModalSizes[size],
              border: '1px solid',
              overflow: 'hidden',
              borderColor: themeSetting.palette.background.paper,
              height: { xs: '100%', md: 'auto' },
            }}
          >
            {props.children}
          </Paper>
        ),
      }),
      [size, themeSetting.palette.background.paper]
    );

    // Memoize the slotProps to prevent unnecessary re-renders
    const slotProps = useMemo(
      () => ({
        backdrop: {
          sx: {
            backgroundColor: alpha(themeSetting.palette.common.black, 0.1),
            backdropFilter: 'blur(4px)',
          },
        },
      }),
      [themeSetting.palette.common.black]
    );

    return (
      <Dialog
        {...dialogProps}
        onClose={onClose}
        open={open}
        maxWidth={size}
        slots={slots}
        slotProps={slotProps}
      >
        <Stack bgcolor={themeSetting.palette.background.default} height="100%">
          <Stack
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: themeSetting.zIndex.appBar + 1,
              bgcolor: (theme) => theme.palette.background.default,
            }}
            direction="row"
            paddingY={2}
            paddingX={{ xs: 2, sm: 3 }}
            alignItems="center"
          >
            <Stack flex={1} justifyContent="center">
              {title && (
                <Typography
                  color={themeSetting.palette.text.primary}
                  variant="h4"
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography color="text.secondary" variant="subtitle1">
                  {subtitle}
                </Typography>
              )}
            </Stack>
            <Typography>
              <IconButton onClick={(event) => onClose(event, 'escapeKeyDown')}>
                <Close />
              </IconButton>
            </Typography>
          </Stack>
          <Stack
            {...otherChildrenStackProps}
            flexGrow={1}
            py={2}
            px={3}
            sx={{
              overflowY: 'auto',
              scrollbarWidth: 0.5,
            }}
          >
            {children}
          </Stack>
          {action && (
            <Stack
              direction="row"
              justifyContent="end"
              gap={1}
              py={2}
              px={3}
              bgcolor={themeSetting.palette.background.paper}
            >
              {action}
            </Stack>
          )}
        </Stack>
      </Dialog>
    );
  }
);

CustomModal.displayName = 'CustomModal';

export default CustomModal;
