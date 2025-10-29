'use client';

import React, { useCallback } from 'react';

import { TextField, TextFieldProps } from '@mui/material';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { useField } from 'formik';

interface IFormNumericFormat
  extends Omit<NumericFormatProps, 'size' | 'color'>,
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

export default function FormNumericFormat({
  name,
  helperText,
  showErrorText,
  ...props
}: IFormNumericFormat) {
  const [field, meta, { setValue }] = useField(name);

  const handleChange = useCallback(
    (value: number) => setValue(value),
    [setValue]
  );

  return (
    <NumericFormat
      {...field}
      name={name}
      helperText={showErrorText && meta.error ? meta.error : helperText}
      error={Boolean(meta.error)}
      {...props}
      customInput={TextField}
      value={field.value}
      onChange={() => {}}
      onValueChange={(values) =>
        values.floatValue ? handleChange(values.floatValue) : handleChange(0)
      }
      color="secondary"
    />
  );
}
