'use client';

import { MainContainer } from '@/components/container';
import CardGroup from '@/components/container/card-group';
import {
  FormAvatarUpload,
  FormPatternFormat,
  FormProvider,
  FormTextField,
} from '@/components/formik';
import FormAddress from '@/components/formik/form-address';
import FullModal from '@/components/modal/full-modal';
import useCreateOrganization from '@/hooks/service/organization/use-create-organization';
import useForm from '@/hooks/use-forms';
import { createOrganizationFormSchema } from '@/validator/forms/organization-form-schema';
import { Button, Stack } from '@mui/material';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';

import React, { useCallback, useMemo } from 'react';

export default function OrganizationFormView() {
  const { openOrganizationForm } = useForm();
  const validationSchema = useMemo(() => createOrganizationFormSchema(), []);

  const initialValues = useMemo(
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

  const { mutate: createOrganization, isPending } = useCreateOrganization({
    onSuccess: () => {
      resetForm();
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

  const form = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      await createOrganization(values);
    },
  });

  const { resetForm, submitForm } = form;

  const handleCreate = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await submitForm();
    },
    [submitForm]
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      resetForm();
      openOrganizationForm.onFalse();
    },
    [resetForm, openOrganizationForm]
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
      <FormProvider value={form}>
        <MainContainer maxWidth="sm">
          <Stack gap={3}>
            <CardGroup title="LOGO">
              <FormAvatarUpload name="logo" />
            </CardGroup>
            <CardGroup title="GENERAL">
              <Stack gap={2}>
                <FormTextField
                  disabled={isPending}
                  name="name"
                  type="text"
                  label="Name"
                />
                <FormTextField
                  disabled={isPending}
                  name="email"
                  type="email"
                  label="Email"
                />
                <FormPatternFormat
                  disabled={isPending}
                  name="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  displayType="input"
                  format="+62 ### #### ####"
                  allowEmptyFormatting
                />
                <FormPatternFormat
                  disabled={isPending}
                  name="whatsappNumber"
                  label="WhatsApp Number"
                  type="tel"
                  displayType="input"
                  format="+62 ### #### ####"
                  allowEmptyFormatting
                />
                <FormTextField
                  disabled={isPending}
                  name="websiteUrl"
                  type="url"
                  label="Website"
                />
                <FormTextField
                  disabled={isPending}
                  name="instagram"
                  type="text"
                  label="Instagram"
                />
              </Stack>
            </CardGroup>
            <CardGroup title="ADDRESS">
              <FormAddress name="address" disabled={isPending} />
            </CardGroup>
          </Stack>
        </MainContainer>
      </FormProvider>
    </FullModal>
  );
}
