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
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';

import { createRegisterFormSchema } from '@/validator/forms/register-form-schema';
import { useFormik } from 'formik';
import { FormProvider, FormTextField } from '@/components/formik';

import { auth } from '@/firebase/config';
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignOut,
  useUpdateProfile,
} from 'react-firebase-hooks/auth';

export default function RegisterView() {
  const [createUserWithEmailAndPassword, _user, _loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [signInWithEmailAndPassword, _signInUser, _signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);

  const [signOut] = useSignOut(auth);

  const [updateProfile] = useUpdateProfile(auth);
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

  const form = useFormik({
    initialValues: defaultValues,
    validationSchema: validation,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        const res = await createUserWithEmailAndPassword(
          values.email,
          values.password
        );

        if (res?.user) {
          await updateProfile({
            ...res.user,
            displayName: `${values.firstName}${
              ` ${values.lastName}` ? values.lastName : ''
            }`,
          });
        }

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

    if (signInError) {
      enqueueSnackbar({
        variant: 'error',
        message: signInError.message,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
    }

    return () => {
      resetForm();
    };
  }, [error, resetForm]);

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
              name="firstName"
              type="text"
              label="First Name"
              sx={{ flex: 1 }}
            />
            <FormTextField
              name="lastName"
              type="text"
              label="Last Name"
              sx={{ flex: 1 }}
            />
          </Box>
          <FormTextField required name="email" type="email" label="Email" />
          <FormTextField
            required
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
              loading={isSubmitting}
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
