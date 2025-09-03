import React, { useCallback, useMemo } from 'react';

import { Box, Button, Stack } from '@mui/material';

import {
  FormNumericFormat,
  FormProvider,
  FormTextField,
} from '@/components/formik';

import FullModal from '@/components/modal/full-modal';
import { CardGroup, MainContainer } from '@/components/container';

import { useFormik } from 'formik';
import {
  createPriceFormSchema,
  IPriceSchema,
} from '@/validator/forms/price-form-schema';

import useForm from '@/hooks/use-forms';
import { useCreatePriceItem } from '@/hooks/service/price';
import { enqueueSnackbar } from 'notistack';

export default function PriceFormView() {
  const { openPriceForm } = useForm();
  const validationSchema = useMemo(() => createPriceFormSchema(), []);

  const initialValues: IPriceSchema = useMemo(
    () => ({
      name: '',
      brand: '',
      model: '',
      description: '',
      price: 0,
      unit: '',
    }),
    []
  );

  const { mutate: createPriceItem, isPending } = useCreatePriceItem({
    onSuccess: () => {
      resetForm();
      enqueueSnackbar({
        variant: 'success',
        message: 'Price successfuly created',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      openPriceForm.onFalse();
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
      await createPriceItem(values);
    },
  });

  const { resetForm, submitForm } = form;

  const handleCancel = useCallback(() => {
    resetForm();
    openPriceForm.onFalse();
  }, [openPriceForm, resetForm]);

  const handleCreate = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await submitForm();
    },
    [submitForm]
  );

  return (
    <FullModal
      title="Add Pricing"
      subtitle=""
      open={openPriceForm.value}
      onClose={openPriceForm.onFalse}
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
            <CardGroup title="General Information">
              <Stack gap={2}>
                <FormTextField
                  required
                  name="name"
                  label="Name"
                  disabled={isPending}
                />
                <FormTextField
                  name="brand"
                  label="Brand"
                  disabled={isPending}
                />
                <FormTextField
                  name="model"
                  label="Model"
                  disabled={isPending}
                />
                <FormTextField
                  name="description"
                  label="Description"
                  multiline
                  minRows={3}
                  disabled={isPending}
                />
              </Stack>
            </CardGroup>
            <CardGroup title="Price">
              <Box gap={2} sx={{ display: 'flex' }}>
                <FormNumericFormat
                  required
                  name="price"
                  label="Price"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="Rp "
                  suffix=",00"
                  sx={{ flex: 0.75 }}
                  disabled={isPending}
                />
                <FormTextField
                  required
                  name="unit"
                  label="Unit"
                  disabled={isPending}
                />
              </Box>
            </CardGroup>
          </Stack>
        </MainContainer>
      </FormProvider>
    </FullModal>
  );
}
