import React from 'react';

import {
  FormControl,
  FormControlProps,
  FormLabel,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { Controller, useFormContext } from 'react-hook-form';

type RHFNumericFormatProps = FormControlProps &
  Omit<NumericFormatProps, 'size' | 'color'> &
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
  > & {
    name: string;
    labelMode?: 'static' | 'inline';
  };

export default function RHFNumericFormat({
  name,
  helperText,
  required,
  size = 'small',
  label,
  labelMode = 'static',
  ...props
}: RHFNumericFormatProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} sx={props.sx} fullWidth={props.fullWidth}>
          {label && labelMode === 'static' && (
            <FormLabel required={required} sx={{ mb: 1 }}>
              {label}
            </FormLabel>
          )}
          <NumericFormat
            {...field}
            size={size}
            name={name}
            helperText={Boolean(error) ? error?.message : helperText}
            error={Boolean(error)}
            {...props}
            customInput={TextField}
            value={field.value}
            label={labelMode === 'inline' ? label : undefined}
            onChange={() => {}}
            onValueChange={(values) =>
              values.floatValue
                ? field.onChange(values.floatValue)
                : field.onChange(0)
            }
            color="secondary"
          />
        </FormControl>
      )}
    />
  );
}
