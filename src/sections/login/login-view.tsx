'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

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

import { auth } from '@/firebase/config';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import LoginWithGoogle from './login-with-google';

export default function LoginView() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [signIn, _user, _loading, error] = useSignInWithEmailAndPassword(auth);

  const validation = useMemo(() => createLoginFormSchema(), []);

  const defaultValues = useMemo(
    () => ({
      email: '',
      password: '',
    }),
    []
  );

  const form = useFormik({
    initialValues: defaultValues,
    validationSchema: validation,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        await signIn(values.email, values.password);
        resetForm();
        setSubmitting(false);
      } catch (err) {
        console.error(err);
        setSubmitting(false);
      }
    },
  });

  const { isSubmitting, resetForm } = form;

  const handleShowPassword = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowPassword((show) => !show);
    },
    []
  );

  useEffect(() => {
    if (error) {
      enqueueSnackbar({
        variant: 'error',
        message: error.message,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
    }

    return () => {
      resetForm();
    };
  }, [error, resetForm]);

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
            disabled={isSubmitting}
          />
          <FormTextField
            required
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            disabled={isSubmitting}
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
              loading={isSubmitting}
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
