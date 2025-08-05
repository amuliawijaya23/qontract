import { memo, forwardRef } from 'react';

import { Props } from 'simplebar-react';

import { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';

import { StyledScrollbar, StyledRootScrollbar } from './styles';

// ----------------------------------------------------------------------

export interface ScrollbarProps extends Props {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ children, sx, ...other }, ref) => {
    const userAgent =
      typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

    const mobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );

    if (mobile) {
      return (
        <Box ref={ref} sx={{ overflow: 'auto', ...sx }} {...other}>
          {children}
        </Box>
      );
    }

    return (
      <StyledRootScrollbar>
        <StyledScrollbar
          scrollableNodeProps={{
            ref,
          }}
          clickOnTrack={false}
          sx={sx}
          {...other}
        >
          {children}
        </StyledScrollbar>
      </StyledRootScrollbar>
    );
  }
);

Scrollbar.displayName = 'Scrollbar';

export default memo(Scrollbar);
