import React from 'react';
import { Box, Stack } from '@mui/material';
import RHFTextField from './rhf-text-field';

type RHFAddressProps = {
  name: string;
  disabled: boolean;
};

export default function RHFAddress({ name, disabled }: RHFAddressProps) {
  return (
    <Stack gap={2}>
      <RHFTextField
        disabled={disabled}
        name={`${name}.country`}
        type="text"
        label="Country"
      />
      <RHFTextField
        disabled={disabled}
        name={`${name}.fullAddress`}
        type="text"
        label="Full Address"
      />
      <Box sx={{ display: 'flex' }} gap={1}>
        <RHFTextField
          disabled={disabled}
          name={`${name}.rt`}
          type="number"
          label="RT"
        />
        <RHFTextField
          disabled={disabled}
          name={`${name}.rw`}
          type="number"
          label="RW"
        />
      </Box>
      <RHFTextField
        disabled={disabled}
        name={`${name}.province`}
        type="text"
        label="Province"
      />
      <RHFTextField
        disabled={disabled}
        name={`${name}.city`}
        type="text"
        label="City"
      />
      <Box sx={{ display: 'flex' }} gap={1}>
        <RHFTextField
          disabled={disabled}
          name={`${name}.district`}
          type="text"
          label="District"
          sx={{ flex: 1 }}
        />
        <RHFTextField
          disabled={disabled}
          name={`${name}.village`}
          type="text"
          label="Village"
          sx={{ flex: 1 }}
        />
      </Box>
      <RHFTextField
        disabled={disabled}
        name={`${name}.postalCode`}
        type="text"
        label="Postal code"
      />
    </Stack>
  );
}
