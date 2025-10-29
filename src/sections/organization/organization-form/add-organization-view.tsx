'use client';
import React, { useCallback, useMemo } from 'react';

import CustomModal from '@/components/modal/custom-modal';
import useForms from '@/hooks/use-forms';
import {
  createAddOrganizationFormSchema,
  IAddOrganizationSchema,
} from '@/validator/forms/add-organization-form-schema';
import { Button, Divider, Stack, Typography } from '@mui/material';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFFormProvider, RHFTextField } from '@/components/react-hook-form';

import useAddOrganization from '@/hooks/service/organization/use-add-organization';

import { enqueueSnackbar } from 'notistack';

export default function AddOrganizationView() {
  const { openAddOrganizationForm, openOrganizationForm } = useForms();
  const validationSchema = useMemo(() => createAddOrganizationFormSchema(), []);

  const defaultValues = useMemo(() => ({ code: '' }), []);

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { reset, handleSubmit } = methods;

  const { mutate: addOrganization, isPending } = useAddOrganization({
    onSuccess: () => {
      reset();
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

  const handleAddOrganization = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleSubmit(async (data: IAddOrganizationSchema) => {
        await addOrganization(data);
      })();
    },
    [handleSubmit, addOrganization]
  );

  const handleCreate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      reset();
      openAddOrganizationForm.onFalse();
      openOrganizationForm.onTrue();
    },
    [reset, openOrganizationForm, openAddOrganizationForm]
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      reset();
      openAddOrganizationForm.onFalse();
    },
    [openAddOrganizationForm, reset]
  );

  return (
    <RHFFormProvider methods={methods}>
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
          <RHFTextField
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
    </RHFFormProvider>
  );
}
