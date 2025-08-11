'use client';

import { MainContainer } from '@/components/container';
import CardGroup from '@/components/container/card-group';
import {
  FormAvatarUpload,
  FormPatternFormat,
  FormProvider,
  FormTextField,
} from '@/components/formik';
import FullModal from '@/components/modal/full-modal';
import useForm from '@/hooks/use-forms';
import { createOrganizationFormSchema } from '@/validator/forms/organization-form-schema';
import { Box, Button, Stack } from '@mui/material';
import { useFormik } from 'formik';

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
        village: '',
        district: '',
        city: '',
        province: '',
        country: 'Indonesia',
        postalCode: '',
      },
    }),
    []
  );

  const form = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values, { setSubmitting }) => {},
  });

  const { resetForm } = form;

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
          <Button color="error" onClick={handleCancel}>
            Cancel
          </Button>
          <Button>Save</Button>
        </>
      }
    >
      <MainContainer maxWidth="sm">
        <FormProvider value={form}>
          <Stack gap={3}>
            <CardGroup title="LOGO">
              <FormAvatarUpload name="logo" />
            </CardGroup>
            <CardGroup title="GENERAL">
              <Stack gap={2}>
                <FormTextField name="name" type="text" label="Name" />
                <FormTextField name="email" type="email" label="Email" />
                <FormPatternFormat
                  name="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  displayType="input"
                  format="+62 ### #### ####"
                  allowEmptyFormatting
                />
                <FormPatternFormat
                  name="whatsappNumber"
                  label="WhatsApp Number"
                  type="tel"
                  displayType="input"
                  format="+62 ### #### ####"
                  allowEmptyFormatting
                />
                <FormTextField name="websiteUrl" type="url" label="Website" />
                <FormTextField name="instagram" type="text" label="Instagram" />
              </Stack>
            </CardGroup>
            <CardGroup title="ADDRESS">
              <Stack gap={2}>
                <FormTextField
                  name="address.country"
                  type="text"
                  label="Country"
                />
                <FormTextField
                  name="address.fullAddress"
                  type="text"
                  label="Full Address"
                />
                <Box sx={{ display: 'flex' }} gap={1}>
                  <FormTextField name="address.rt" type="number" label="RT" />
                  <FormTextField name="address.rw" type="number" label="RW" />
                </Box>
                <FormTextField
                  name="address.province"
                  type="text"
                  label="Province"
                />
                <FormTextField name="city" type="text" label="City" />
                <Box sx={{ display: 'flex' }} gap={1}>
                  <FormTextField
                    name="address.district"
                    type="text"
                    label="District"
                    sx={{ flex: 1 }}
                  />
                  <FormTextField
                    name="address.village"
                    type="text"
                    label="Village"
                    sx={{ flex: 1 }}
                  />
                </Box>
                <FormTextField
                  name="address.postalCode"
                  type="text"
                  label="Postal code"
                />
              </Stack>
            </CardGroup>
          </Stack>
        </FormProvider>
      </MainContainer>
    </FullModal>
  );
}
