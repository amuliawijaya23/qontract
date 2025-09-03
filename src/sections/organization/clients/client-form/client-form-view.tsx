import React, { useCallback, useMemo } from 'react';

import { Box, Button, Stack, Typography } from '@mui/material';

import { useFormik } from 'formik';

import {
  createClientFormSchema,
  IClientSchema,
} from '@/validator/forms/client-form-schema';

import {
  FormAvatarUpload,
  FormPatternFormat,
  FormProvider,
  FormTextField,
  FormAddress,
} from '@/components/formik';

import FullModal from '@/components/modal/full-modal';
import { CardGroup, MainContainer } from '@/components/container';

import { useThemeStore } from '@/hooks/store';
import useForm from '@/hooks/use-forms';
import { useCreateClient } from '@/hooks/service/client';
import { enqueueSnackbar } from 'notistack';

export default function ClientFormView() {
  const themeMode = useThemeStore((state) => state.mode);

  const { openClientsForm } = useForm();

  const validationSchema = useMemo(() => createClientFormSchema(), []);

  const initialValues: IClientSchema = useMemo(
    () => ({
      logo: undefined,
      name: '',
      personInCharge: '',
      email: '',
      phoneNumber: '',
      address: {
        fullAddress: '',
        rt: 0,
        rw: 0,
        village: '',
        district: '',
        city: '',
        province: '',
        country: 'Indonesia',
        postalCode: 0,
      },
    }),
    []
  );

  const { mutate: createClient, isPending } = useCreateClient({
    onSuccess: () => {
      resetForm();
      enqueueSnackbar({
        variant: 'success',
        message: 'Organization successfuly created',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      openClientsForm.onFalse();
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
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      await createClient(values);
    },
  });

  const { resetForm, submitForm } = form;

  const handleCancel = useCallback(() => {
    resetForm();
    openClientsForm.onFalse();
  }, [openClientsForm, resetForm]);

  const handleCreate = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await submitForm();
    },
    [submitForm]
  );

  return (
    <FullModal
      title="Add CLIENT"
      subtitle=""
      open={openClientsForm.value}
      onClose={openClientsForm.onFalse}
      action={
        <>
          <Button color="error" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button
            loading={isPending}
            loadingPosition="start"
            onClick={handleCreate}
          >
            Save
          </Button>
        </>
      }
    >
      <FormProvider value={form}>
        <MainContainer maxWidth="sm">
          <Stack gap={3}>
            <CardGroup title="Client Logo">
              <FormAvatarUpload name="logo" />
            </CardGroup>
            <CardGroup title="Client Information">
              <Stack gap={4}>
                <FormTextField
                  required
                  name="name"
                  label="Client Name"
                  disabled={isPending}
                />
                <Stack gap={2}>
                  <Typography
                    variant="h4"
                    color={themeMode === 'dark' ? 'secondary' : 'primary'}
                  >
                    Person in Charge
                  </Typography>
                  <FormTextField
                    required
                    name="personInCharge"
                    label="Name"
                    disabled={isPending}
                  />
                  <Box sx={{ display: 'flex' }} gap={2}>
                    <FormTextField
                      name="email"
                      label="Email"
                      disabled={isPending}
                      type="email"
                      sx={{ flex: 1 }}
                    />
                    <FormPatternFormat
                      name="phoneNumber"
                      label="Phone Number"
                      type="tel"
                      displayType="input"
                      format="+62 ### #### ####"
                      allowEmptyFormatting
                      disabled={isPending}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </Stack>
              </Stack>
            </CardGroup>
            <CardGroup title="Client Address">
              <FormAddress name="address" disabled={isPending} />
            </CardGroup>
          </Stack>
        </MainContainer>
      </FormProvider>
    </FullModal>
  );
}
