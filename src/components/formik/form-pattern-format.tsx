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
}

export default function FormPatternFormat({
  name,
  helperText,
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
      helperText={meta.touched && meta.error ? meta.error : helperText}
      error={meta.touched && Boolean(meta.error)}
      {...props}
      customInput={TextField}
      value={field.value}
      onValueChange={(values) => handleChange(values.formattedValue)}
      color="secondary"
    />
  );
}
