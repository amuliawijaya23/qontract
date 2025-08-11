'use client';

import React from 'react';

import { TransitionProps } from '@mui/material/transitions';
import { Slide } from '@mui/material';

export const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

Transition.displayName = 'Transition';
