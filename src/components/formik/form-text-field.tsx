'use client';

import React from 'react';

import {
  TextField,
  TextFieldProps,
  FormControl,
  FormControlProps,
  FormLabel,
} from '@mui/material';

import { useField } from 'formik';

interface IFormikTextField extends FormControlProps {
  name: string;
  type?: TextFieldProps['type'];
  label?: string;
  labelMode?: 'inline' | 'static';
  placeholder?: string;
  helperText?: React.ReactNode;
  slotProps?: TextFieldProps['slotProps'];
  multiline?: boolean;
  minRows?: number;
  showErrorText?: boolean;
}

export default function FormTextField({
  name,
  label,
  labelMode = 'inline',
  type,
  helperText,
  size,
  required,
  placeholder,
  slotProps,
  disabled = false,
  multiline = false,
  showErrorText,
  minRows,
  ...formControlProps
}: IFormikTextField) {
  const [field, meta] = useField(name);

  return (
    <FormControl error={Boolean(meta.error)} {...formControlProps}>
      {label && labelMode === 'static' && (
        <FormLabel required={required} sx={{ mb: 1 }}>
          {label}
        </FormLabel>
      )}
      <TextField
        {...field}
        required={required}
        disabled={disabled}
        size={size}
        type={type}
        label={labelMode === 'inline' ? label : undefined}
        placeholder={placeholder}
        slotProps={slotProps}
        helperText={showErrorText && meta.error ? meta.error : helperText}
        error={Boolean(meta.error)}
        color="secondary"
        multiline={multiline}
        minRows={minRows}
      />
    </FormControl>
  );
}
