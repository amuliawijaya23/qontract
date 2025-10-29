'use client';

import React, { useCallback, useMemo } from 'react';
import { Button, Stack } from '@mui/material';

import CardGroup from '@/components/container/card-group';
import FullModal from '@/components/modal/full-modal';
import { MainContainer } from '@/components/container';

import useCreateOrganization from '@/hooks/service/organization/use-create-organization';
import useForms from '@/hooks/use-forms';

import {
  RHFAddress,
  RHFAvatarUpload,
  RHFFormProvider,
  RHFPatternFormat,
  RHFTextField,
} from '@/components/react-hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { createOrganizationFormSchema } from '@/validator/forms/organization-form-schema';
import { enqueueSnackbar } from 'notistack';

export default function OrganizationFormView() {
  const { openOrganizationForm } = useForms();
  const validationSchema = useMemo(() => createOrganizationFormSchema(), []);

  const defaultValues = useMemo(
    () => ({
      logo: undefined,
      name: '',
      email: '',
      phoneNumber: '',
      whatsappNumber: '',
      websiteUrl: '',
      instagram: '',
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

  const { mutate: createOrganization, isPending } = useCreateOrganization({
    onSuccess: () => {
      reset();
      enqueueSnackbar({
        variant: 'success',
        message: 'Organization successfuly created',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      openOrganizationForm.onFalse();
    },
    onError: (e) => {
      enqueueSnackbar({
        variant: 'error',
        message: e.message,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
    },
  });

  const handleCreate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleSubmit(async (data) => {
        await createOrganization(data);
      })();
    },
    [handleSubmit, createOrganization]
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      reset();
      openOrganizationForm.onFalse();
    },
    [reset, openOrganizationForm]
  );

  return (
    <FullModal
      title="CREATE ORGANIZATION"
      subtitle="Create a new board and start tracking your projects"
      open={openOrganizationForm.value}
      onClose={openOrganizationForm.onFalse}
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
            <CardGroup title="LOGO">
              <RHFAvatarUpload name="logo" />
            </CardGroup>
            <CardGroup title="GENERAL">
              <Stack gap={2}>
                <RHFTextField
                  disabled={isPending}
                  name="name"
                  type="text"
                  label="Name"
                />
                <RHFTextField
                  disabled={isPending}
                  name="email"
                  type="email"
                  label="Email"
                />
                <RHFPatternFormat
                  disabled={isPending}
                  name="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  displayType="input"
                  format="+62 ### #### ####"
                  allowEmptyFormatting
                />
                <RHFPatternFormat
                  disabled={isPending}
                  name="whatsappNumber"
                  label="WhatsApp Number"
                  type="tel"
                  displayType="input"
                  format="+62 ### #### ####"
                  allowEmptyFormatting
                />
                <RHFTextField
                  disabled={isPending}
                  name="websiteUrl"
                  type="url"
                  label="Website"
                />
                <RHFTextField
                  disabled={isPending}
                  name="instagram"
                  type="text"
                  label="Instagram"
                />
              </Stack>
            </CardGroup>
            <CardGroup title="ADDRESS">
              <RHFAddress name="address" disabled={isPending} />
            </CardGroup>
          </Stack>
        </MainContainer>
      </RHFFormProvider>
    </FullModal>
  );
}
