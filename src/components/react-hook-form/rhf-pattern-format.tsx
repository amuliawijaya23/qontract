import React from 'react';

import {
  FormControl,
  FormControlProps,
  FormLabel,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

import { Controller, useFormContext } from 'react-hook-form';

type RHFPatternFormatProps = FormControlProps &
  Omit<PatternFormatProps, 'size' | 'color'> &
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

export default function RHFPatternFormat({
  name,
  label,
  required,
  labelMode = 'static',
  helperText,
  size = 'small',
  ...props
}: RHFPatternFormatProps) {
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
          <PatternFormat
            {...field}
            name={name}
            size={size}
            label={labelMode === 'inline' ? label : undefined}
            helperText={Boolean(error) ? error?.message : helperText}
            error={Boolean(error)}
            {...props}
            customInput={TextField}
            value={field.value}
            onValueChange={(values) => field.onChange(values.formattedValue)}
            color="secondary"
          />
        </FormControl>
      )}
    />
  );
}
