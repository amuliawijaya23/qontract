import { Box, Stack } from '@mui/material';
import React from 'react';
import FormTextField from './form-text-field';

interface IFormAddress {
  name: string;
  disabled: boolean;
}

export default function FormAddress({ name, disabled }: IFormAddress) {
  return (
    <Stack gap={2}>
      <FormTextField
        disabled={disabled}
        name={`${name}.country`}
        type="text"
        label="Country"
      />
      <FormTextField
        disabled={disabled}
        name={`${name}.fullAddress`}
        type="text"
        label="Full Address"
      />
      <Box sx={{ display: 'flex' }} gap={1}>
        <FormTextField
          disabled={disabled}
          name={`${name}.rt`}
          type="number"
          label="RT"
        />
        <FormTextField
          disabled={disabled}
          name={`${name}.rw`}
          type="number"
          label="RW"
        />
      </Box>
      <FormTextField
        disabled={disabled}
        name={`${name}.province`}
        type="text"
        label="Province"
      />
      <FormTextField
        disabled={disabled}
        name={`${name}.city`}
        type="text"
        label="City"
      />
      <Box sx={{ display: 'flex' }} gap={1}>
        <FormTextField
          disabled={disabled}
          name={`${name}.district`}
          type="text"
          label="District"
          sx={{ flex: 1 }}
        />
        <FormTextField
          disabled={disabled}
          name={`${name}.village`}
          type="text"
          label="Village"
          sx={{ flex: 1 }}
        />
      </Box>
      <FormTextField
        disabled={disabled}
        name={`${name}.postalCode`}
        type="text"
        label="Postal code"
      />
    </Stack>
  );
}
