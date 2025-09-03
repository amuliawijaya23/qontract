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
import { useFormik } from 'formik';
import { FormProvider, FormTextField } from '@/components/formik';

import { useSignUp } from '@/hooks/service/auth';

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

  const { mutate: signUp, isPending } = useSignUp({
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
    onSubmit: async (values: IRegisterSchema) => {
      await signUp(values);
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
    <Stack>
      <Typography component="h2" variant="h2" sx={{ mb: 1 }}>
        Sign Up
      </Typography>
      <FormProvider value={form}>
        <Stack gap={2}>
          <Box sx={{ display: 'flex' }} gap={1}>
            <FormTextField
              required
              disabled={isPending}
              name="firstName"
              type="text"
              label="First Name"
              sx={{ flex: 1 }}
            />
            <FormTextField
              disabled={isPending}
              name="lastName"
              type="text"
              label="Last Name"
              sx={{ flex: 1 }}
            />
          </Box>
          <FormTextField required name="email" type="email" label="Email" />
          <FormTextField
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
          <FormTextField
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
      </FormProvider>
    </Stack>
  );
}
