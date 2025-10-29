import React, { useCallback, useEffect, useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Button, Stack } from '@mui/material';

import {
  RHFFormProvider,
  RHFTextField,
  RHFAutocomplete,
  RHFNumericFormat,
  RHFSelect,
} from '@/components/react-hook-form';

import FullModal from '@/components/modal/full-modal';
import { CardGroup, MainContainer } from '@/components/container';

import { useForm } from 'react-hook-form';
import { createPriceFormSchema } from '@/validator/forms/price-form-schema';

import useForms from '@/hooks/use-forms';
import {
  useCreatePriceListItem,
  useUpdatePriceListItem,
} from '@/hooks/service/price-list';
import { enqueueSnackbar } from 'notistack';
import useGetOrganizationUnits from '@/hooks/service/units';
import { useOrganizationStore } from '@/hooks/store';
import PriceListCategory from '@/validator/enums/price-list-category';

export default function PriceFormView() {
  const { priceId, openPriceForm, handlePriceId } = useForms();
  const { priceList } = useOrganizationStore();

  const selectedPrice = useMemo(() => {
    if (!priceId) return null;

    return priceList.find((p) => priceId === p.id);
  }, [priceId, priceList]);

  const validationSchema = useMemo(() => createPriceFormSchema(), []);

  const initialValues = useMemo(
    () =>
      selectedPrice
        ? {
            name: selectedPrice.name,
            brand: selectedPrice.brand,
            model: selectedPrice.model,
            description: selectedPrice.description,
            category: selectedPrice.category,
            price: selectedPrice.price,
            unit: selectedPrice.unit,
          }
        : {
            name: '',
            brand: '',
            model: '',
            description: '',
            category: PriceListCategory.MATERIAL,
            price: 0,
            unit: '',
          },
    [selectedPrice]
  );

  const { data: units } = useGetOrganizationUnits();

  const unitOptions = useMemo(
    () => units?.map((u) => ({ name: u.unit, value: u.unit })) || [],
    [units]
  );

  const categoryOptions = useMemo(
    () => [
      { name: 'Material', value: PriceListCategory.MATERIAL },
      { name: 'Service', value: PriceListCategory.SERVICE },
      { name: 'Operation', value: PriceListCategory.OPERATION },
      { name: 'Other', value: PriceListCategory.OTHER },
    ],
    []
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const { handleSubmit, reset } = methods;

  const { mutate: createPriceItem, isPending: isPendingCreate } =
    useCreatePriceListItem({
      onSuccess: () => {
        reset();
        enqueueSnackbar({
          variant: 'success',
          message: 'Price item successfuly created',
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

  const { mutate: updatePriceItem, isPending: isPendingUpdate } =
    useUpdatePriceListItem({
      onSuccess: () => {
        reset();
        enqueueSnackbar({
          variant: 'success',
          message: 'Price item successfuly updated',
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

  const isPending = useMemo(
    () => isPendingCreate || isPendingUpdate,
    [isPendingCreate, isPendingUpdate]
  );

  const handleCancel = useCallback(() => {
    handlePriceId('');
    reset();
    openPriceForm.onFalse();
  }, [openPriceForm, handlePriceId, reset]);

  const handleCreate = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await handleSubmit(async (data) => {
        if (priceId) {
          await updatePriceItem({ id: priceId, data });
        } else {
          await createPriceItem(data);
        }
      })();
    },
    [priceId, handleSubmit, createPriceItem, updatePriceItem]
  );

  useEffect(() => {
    reset(initialValues);

    return () => {
      reset();
    };
  }, [priceId, initialValues, reset]);

  return (
    <FullModal
      title="Add Pricing"
      subtitle=""
      open={openPriceForm.value}
      onClose={handleCancel}
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
            <CardGroup title="General Information">
              <Stack gap={2}>
                <RHFTextField
                  required
                  name="name"
                  label="Name"
                  disabled={isPending}
                />
                <RHFTextField name="brand" label="Brand" disabled={isPending} />
                <RHFTextField name="model" label="Model" disabled={isPending} />
                <RHFTextField
                  name="description"
                  label="Description"
                  multiline
                  minRows={3}
                  disabled={isPending}
                />
                <RHFSelect
                  required
                  name="category"
                  label="Category"
                  disabled={isPending}
                  options={categoryOptions}
                />
              </Stack>
            </CardGroup>
            <CardGroup title="Price">
              <Box gap={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <RHFNumericFormat
                  required
                  name="price"
                  label="Price"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="Rp "
                  suffix=",00"
                  sx={{ flex: 1 }}
                  disabled={isPending}
                />
                <RHFAutocomplete
                  required
                  freeSolo
                  name="unit"
                  label="Unit"
                  disabled={isPending}
                  options={unitOptions}
                  sx={{ flex: 0.5 }}
                />
              </Box>
            </CardGroup>
          </Stack>
        </MainContainer>
      </RHFFormProvider>
    </FullModal>
  );
}
