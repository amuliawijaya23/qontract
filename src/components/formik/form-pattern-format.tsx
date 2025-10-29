'use client';

import React, { useCallback } from 'react';

import { TextField, TextFieldProps } from '@mui/material';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

import { useField } from 'formik';

interface IFormPatternFormat
  extends Omit<PatternFormatProps, 'size' | 'color'>,
    Pick<
      TextFieldProps,
      | 'label'
      | 'disabled'
      | 'fullWidth'
      | 'required'
      | 'helperText'
      | 'slotProps'
      | 'sx'
      | 'placeholder'
      | 'error'
      | 'size'
    > {
  name: string;
  showErrorText?: boolean;
}

export default function FormPatternFormat({
  name,
  helperText,
  showErrorText,
  ...props
}: IFormPatternFormat) {
  const [field, meta, { setValue }] = useField(name);

  const handleChange = useCallback(
    (value: string) => setValue(value),
    [setValue]
  );

  return (
    <PatternFormat
      {...field}
      name={name}
      helperText={showErrorText && meta.error ? meta.error : helperText}
      error={Boolean(meta.error)}
      {...props}
      customInput={TextField}
      value={field.value}
      onValueChange={(values) => handleChange(values.formattedValue)}
      color="secondary"
    />
  );
}
