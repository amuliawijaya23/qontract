'use client';
import React, { useCallback, useMemo } from 'react';

import { FormProvider, FormTextField } from '@/components/formik';
import CustomModal from '@/components/modal/custom-modal';
import useForm from '@/hooks/use-forms';
import {
  createAddOrganizationFormSchema,
  IAddOrganizationSchema,
} from '@/validator/forms/add-organization-form-schema';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import useAddOrganization from '@/hooks/service/organization/use-add-organization';
import { enqueueSnackbar } from 'notistack';

export default function AddOrganizationView() {
  const { openAddOrganizationForm, openOrganizationForm } = useForm();
  const validationSchema = useMemo(() => createAddOrganizationFormSchema(), []);

  const initialValues = useMemo(() => ({ code: '' }), []);

  const { mutate: addOrganization, isPending } = useAddOrganization({
    onSuccess: () => {
      resetForm();
      enqueueSnackbar({
        variant: 'success',
        message: 'Organization successfuly added',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      openAddOrganizationForm.onFalse();
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
    onSubmit: async (values: IAddOrganizationSchema) => {
      await addOrganization(values);
    },
  });

  const { submitForm, resetForm } = form;

  const handleAddOrganization = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await submitForm();
    },
    [submitForm]
  );

  const handleCreate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      resetForm();
      openAddOrganizationForm.onFalse();
      openOrganizationForm.onTrue();
    },
    [resetForm, openOrganizationForm, openAddOrganizationForm]
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      resetForm();
      openAddOrganizationForm.onFalse();
    },
    [openAddOrganizationForm, resetForm]
  );

  return (
    <FormProvider value={form}>
      <CustomModal
        title="ADD ORGANIZATION"
        subtitle="Create or join and existing Organization"
        action={
          <>
            <Button color="error" disabled={isPending} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              loading={isPending}
              loadingPosition="start"
              onClick={handleAddOrganization}
            >
              Confirm
            </Button>
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
          <FormTextField
            fullWidth
            required
            disabled={isPending}
            name="code"
            type="text"
            label="Code"
          />
          <Divider>Or</Divider>
          <Button variant="contained" onClick={handleCreate}>
            Create My Own
          </Button>
        </Stack>
      </CustomModal>
    </FormProvider>
  );
}
