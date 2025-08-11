'use client';

import React from 'react';

import {
  TextField,
  TextFieldProps,
  FormControl,
  FormControlProps,
} from '@mui/material';

import { useField } from 'formik';

interface IFormikTextField extends FormControlProps {
  name: string;
  type?: TextFieldProps['type'];
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  slotProps?: TextFieldProps['slotProps'];
}

export default function FormTextField({
  name,
  label,
  type,
  helperText,
  size,
  required,
  placeholder,
  slotProps,
  disabled = false,
  ...formControlProps
}: IFormikTextField) {
  const [field, meta] = useField(name);

  return (
    <FormControl
      error={meta.touched && Boolean(meta.error)}
      {...formControlProps}
    >
      <TextField
        {...field}
        required={required}
        disabled={disabled}
        size={size}
        type={type}
        label={label}
        placeholder={placeholder}
        slotProps={slotProps}
        helperText={meta.touched && meta.error ? meta.error : helperText}
        error={meta.touched && Boolean(meta.error)}
        color="secondary"
      />
    </FormControl>
  );
}
