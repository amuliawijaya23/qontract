import React, { useCallback, useMemo } from 'react';

import { Box, Button, Stack, Typography } from '@mui/material';
import FullModal from '@/components/modal/full-modal';
import { CardGroup, MainContainer } from '@/components/container';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createClientFormSchema,
  IClientSchema,
} from '@/validator/forms/client-form-schema';

import { useThemeStore } from '@/hooks/store';
import useForms from '@/hooks/use-forms';
import { useCreateClient } from '@/hooks/service/client';
import { enqueueSnackbar } from 'notistack';
import {
  RHFAddress,
  RHFAvatarUpload,
  RHFFormProvider,
  RHFPatternFormat,
  RHFTextField,
} from '@/components/react-hook-form';

export default function ClientFormView() {
  const themeMode = useThemeStore((state) => state.mode);

  const { openClientsForm } = useForms();

  const validationSchema = useMemo(() => createClientFormSchema(), []);

  const defaultValues = useMemo(
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

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { reset, handleSubmit } = methods;

  const { mutate: createClient, isPending } = useCreateClient({
    onSuccess: () => {
      reset();
      enqueueSnackbar({
        variant: 'success',
        message: 'Client successfuly added',
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

  const handleCancel = useCallback(() => {
    reset();
    openClientsForm.onFalse();
  }, [openClientsForm, reset]);

  const handleCreate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleSubmit(async (data: IClientSchema) => {
        await createClient(data);
      })();
    },
    [handleSubmit, createClient]
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
      <RHFFormProvider methods={methods}>
        <MainContainer maxWidth="sm">
          <Stack gap={3}>
            <CardGroup title="Client Logo">
              <RHFAvatarUpload name="logo" />
            </CardGroup>
            <CardGroup title="Client Information">
              <Stack gap={4}>
                <RHFTextField
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
                  <RHFTextField
                    required
                    name="personInCharge"
                    label="Name"
                    disabled={isPending}
                  />
                  <Box sx={{ display: 'flex' }} gap={2}>
                    <RHFTextField
                      name="email"
                      label="Email"
                      disabled={isPending}
                      type="email"
                      sx={{ flex: 1 }}
                    />
                    <RHFPatternFormat
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
              <RHFAddress name="address" disabled={isPending} />
            </CardGroup>
          </Stack>
        </MainContainer>
      </RHFFormProvider>
    </FullModal>
  );
}
