import React from 'react';

import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface RHFCheckboxProps extends Omit<FormControlLabelProps, 'control'> {
  name: string;
  label: string;
}

export default function RHFCheckbox({
  name,
  label,
  ...formControlLabelProps
}: RHFCheckboxProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControlLabel
          control={<Checkbox checked={field.value} {...field} />}
          label={label}
          {...formControlLabelProps}
        />
      )}
    />
  );
}
