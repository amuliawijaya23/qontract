'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { enqueueSnackbar } from 'notistack';

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import {
  createLoginFormSchema,
  ILoginSchema,
} from '@/validator/forms/login-form-schema';

import Link from 'next/link';
import LoginWithGoogle from './login-with-google';

import { useSignIn } from '@/hooks/service/auth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFFormProvider, RHFTextField } from '@/components/react-hook-form';

export default function LoginView() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validation = useMemo(() => createLoginFormSchema(), []);

  const defaultValues = useMemo(
    () => ({
      email: '',
      password: '',
    }),
    []
  );

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validation),
  });

  const { reset, handleSubmit } = methods;

  const { mutate: signIn, isPending } = useSignIn({
    onSuccess: () => {
      reset();
    },
    onError: (e) => {
      enqueueSnackbar({
        variant: 'error',
        message: e.message,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
    },
  });

  const onSubmit = useCallback(() => {
    handleSubmit(async (data: ILoginSchema) => {
      await signIn(data);
    })();
  }, [signIn, handleSubmit]);

  const handleShowPassword = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowPassword((show) => !show);
    },
    []
  );

  return (
    <Stack gap={2}>
      <Typography component="h2" variant="h2" sx={{ mb: 1 }}>
        Sign In
      </Typography>
      <RHFFormProvider methods={methods}>
        <Stack gap={2}>
          <RHFTextField
            required
            name="email"
            type="email"
            label="Email"
            disabled={isPending}
          />
          <RHFTextField
            required
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            disabled={isPending}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? 'hide-password-button'
                          : 'show-password-button'
                      }
                      onClick={handleShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }} gap={0.5}>
            <Button variant="contained" color="error" sx={{ flex: 1 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ flex: 1 }}
              loading={isPending}
              loadingPosition="start"
              onClick={onSubmit}
            >
              Login
            </Button>
          </Box>
        </Stack>
      </RHFFormProvider>
      <Stack gap={1}>
        <LoginWithGoogle />
        <Typography variant="subtitle1" align="center">
          {'Not a member? '}
          <Link color="inherit" href="/register">
            <b>Sign Up</b>
          </Link>
        </Typography>
      </Stack>
    </Stack>
  );
}
