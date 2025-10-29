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
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';

import {
  createRegisterFormSchema,
  IRegisterSchema,
} from '@/validator/forms/register-form-schema';

import { useSignUp } from '@/hooks/service/auth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFFormProvider, RHFTextField } from '@/components/react-hook-form';

export default function RegisterView() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validation = useMemo(() => createRegisterFormSchema(), []);

  const defaultValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }),
    []
  );

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validation),
  });

  const { reset, handleSubmit } = methods;

  const { mutate: signUp, isPending } = useSignUp({
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
    handleSubmit(async (data: IRegisterSchema) => {
      await signUp(data);
    })();
  }, [handleSubmit, signUp]);

  const handleShowPassword = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowPassword((show) => !show);
    },
    []
  );

  return (
    <Stack>
      <Typography component="h2" variant="h2" sx={{ mb: 1 }}>
        Sign Up
      </Typography>
      <RHFFormProvider methods={methods}>
        <Stack gap={2}>
          <Box sx={{ display: 'flex' }} gap={1}>
            <RHFTextField
              required
              disabled={isPending}
              name="firstName"
              type="text"
              label="First Name"
              sx={{ flex: 1 }}
            />
            <RHFTextField
              disabled={isPending}
              name="lastName"
              type="text"
              label="Last Name"
              sx={{ flex: 1 }}
            />
          </Box>
          <RHFTextField required name="email" type="email" label="Email" />
          <RHFTextField
            required
            disabled={isPending}
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
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
          <RHFTextField
            required
            disabled={isPending}
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            label="Password"
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
              loadingPosition="start"
              loading={isPending}
              onClick={onSubmit}
            >
              Register
            </Button>
          </Box>
          <Typography variant="subtitle1" align="center">
            {'Already have an Account? '}
            <Link color="inherit" href="/login">
              <b>Sign In</b>
            </Link>
          </Typography>
        </Stack>
      </RHFFormProvider>
    </Stack>
  );
}
