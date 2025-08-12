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

import { createLoginFormSchema } from '@/validator/forms/login-form-schema';

import { useFormik } from 'formik';
import { FormTextField, FormProvider } from '@/components/formik';

import Link from 'next/link';
import LoginWithGoogle from './login-with-google';

import { useSignIn } from '@/hooks/service/auth';

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

  const { mutate: signIn, isPending } = useSignIn({
    onSuccess: () => {
      resetForm();
    },
    onError: (e) => {
      enqueueSnackbar({
        variant: 'error',
        message: e.message,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
    },
  });

  const form = useFormik({
    initialValues: defaultValues,
    validationSchema: validation,
    onSubmit: async (values) => {
      await signIn({ email: values.email, password: values.password });
    },
  });

  const { resetForm } = form;

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
      <FormProvider value={form}>
        <Stack gap={2}>
          <FormTextField
            required
            name="email"
            type="email"
            label="Email"
            disabled={isPending}
          />
          <FormTextField
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
            >
              Login
            </Button>
          </Box>
        </Stack>
      </FormProvider>
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
