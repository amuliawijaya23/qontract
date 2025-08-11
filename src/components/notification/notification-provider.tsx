import { useRef } from 'react';
import {
  SnackbarKey,
  closeSnackbar,
  SnackbarProvider as NotistackProvider,
} from 'notistack';

import { IconButton } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { Help, Error, Close, Warning, CheckCircle } from '@mui/icons-material';

import { StyledIcon, StyledNotistack } from './styles';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

function CloseSnackbarButton({ id }: { id: SnackbarKey }) {
  return (
    <IconButton size="small" onClick={() => closeSnackbar(id)} sx={{ p: 0.5 }}>
      <Close sx={{ width: 16 }} />
    </IconButton>
  );
}

export default function NotificationProvider({ children }: Props) {
  const notistackRef = useRef(null);

  const closeSnackbarButton = (key: SnackbarKey) => (
    <CloseSnackbarButton id={key} />
  );

  return (
    <NotistackProvider
      ref={notistackRef}
      maxSnack={5}
      preventDuplicate
      autoHideDuration={3000}
      TransitionComponent={Collapse}
      variant="success" // Set default variant
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      iconVariant={{
        info: (
          <StyledIcon color="info">
            <Help sx={{ width: 24 }} />
          </StyledIcon>
        ),
        success: (
          <StyledIcon color="success">
            <CheckCircle sx={{ width: 24 }} />
          </StyledIcon>
        ),
        warning: (
          <StyledIcon color="warning">
            <Warning sx={{ width: 24 }} />
          </StyledIcon>
        ),
        error: (
          <StyledIcon color="error">
            <Error sx={{ width: 24 }} />
          </StyledIcon>
        ),
      }}
      Components={{
        default: StyledNotistack,
        info: StyledNotistack,
        success: StyledNotistack,
        warning: StyledNotistack,
        error: StyledNotistack,
      }}
      action={(id) => closeSnackbarButton(id)}
    >
      {children}
    </NotistackProvider>
  );
}
