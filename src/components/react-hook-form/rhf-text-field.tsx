import React from 'react';

import {
  TextField,
  TextFieldProps,
  FormControl,
  FormControlProps,
  FormLabel,
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

type RHFTextFieldProps = FormControlProps & {
  name: string;
  type?: TextFieldProps['type'];
  label?: string;
  labelMode?: 'inline' | 'static';
  placeholder?: string;
  helperText?: React.ReactNode;
  slotProps?: TextFieldProps['slotProps'];
  multiline?: boolean;
  minRows?: number;
  disabled?: boolean;
};

export default function RHFTextField({
  name,
  label,
  labelMode = 'static',
  type,
  helperText,
  size = 'small',
  required,
  placeholder,
  slotProps,
  disabled = false,
  multiline = false,
  minRows,
  ...formControlProps
}: RHFTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} {...formControlProps}>
          {label && labelMode === 'static' && (
            <FormLabel required={required} sx={{ mb: 1 }}>
              {label}
            </FormLabel>
          )}
          <TextField
            disabled={disabled}
            label={labelMode === 'inline' ? label : undefined}
            {...field}
            size={size}
            type={type}
            placeholder={placeholder}
            value={field.value || ''}
            onChange={(event) => {
              field.onChange(event.target.value || '');
            }}
            slotProps={{
              ...slotProps,
            }}
            multiline={multiline}
            minRows={minRows}
            required={required}
            error={!!error}
            helperText={error ? error?.message : helperText}
          />
        </FormControl>
      )}
    />
  );
}
