'use client';
import React, { useCallback, useMemo } from 'react';

import { FormProvider, FormTextField } from '@/components/formik';
import CustomModal from '@/components/modal/custom-modal';
import useForm from '@/hooks/use-forms';
import { createAddOrganizationFormSchema } from '@/validator/forms/add-organization-form-schema';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';

export default function AddOrganizationView() {
  const { openAddOrganizationForm, openOrganizationForm } = useForm();
  const validationSchema = useMemo(() => createAddOrganizationFormSchema(), []);

  const initialValues = useMemo(() => ({ code: '' }), []);

  const form = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values, { setSubmitting }) => {},
  });

  const { resetForm } = form;

  const handleCreate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      resetForm();
      openAddOrganizationForm.onFalse();
      openOrganizationForm.onTrue();
    },
    [resetForm, openOrganizationForm, openAddOrganizationForm]
  );

  return (
    <CustomModal
      title="ADD ORGANIZATION"
      subtitle="Create or join and existing Organization"
      action={
        <>
          <Button color="error">Cancel</Button>
          <Button>Confirm</Button>
        </>
      }
      open={openAddOrganizationForm.value}
      onClose={openAddOrganizationForm.onFalse}
      size="sm"
    >
      <Stack gap={2}>
        <Typography variant="body2" textAlign="center" color="text.secondary">
          Enter an invitation code below to join an existing organization.
        </Typography>
        <FormProvider value={form}>
          <FormTextField
            fullWidth
            required
            name="code"
            type="text"
            label="Code"
          />
        </FormProvider>
        <Divider>Or</Divider>
        <Button variant="contained" onClick={handleCreate}>
          Create My Own
        </Button>
      </Stack>
    </CustomModal>
  );
}
