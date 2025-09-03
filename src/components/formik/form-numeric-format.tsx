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
}

export default function FormNumericFormat({
  name,
  helperText,
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
      helperText={meta.touched && meta.error ? meta.error : helperText}
      error={meta.touched && Boolean(meta.error)}
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
