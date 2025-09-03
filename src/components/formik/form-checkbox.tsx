import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material';
import { useField } from 'formik';
import React from 'react';

interface IFormCheckbox extends Omit<FormControlLabelProps, 'control'> {
  name: string;
  label: string;
}

export default function FormCheckbox({
  name,
  label,
  ...formControlLabelProps
}: IFormCheckbox) {
  const [field] = useField(name);

  return (
    <FormControlLabel
      control={<Checkbox {...field} />}
      label={label}
      {...formControlLabelProps}
    />
  );
}
