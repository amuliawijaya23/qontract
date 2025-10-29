import React, { useCallback } from 'react';

import {
  Autocomplete,
  TextField,
  TextFieldProps,
  FormControl,
  FormControlProps,
  FormLabel,
} from '@mui/material';

import { Controller, useFormContext } from 'react-hook-form';

type Option = {
  name: string;
  value: string;
};

type RHFAutocompleteProps = FormControlProps & {
  name: string;
  options: Option[];
  label?: string;
  freeSolo?: boolean;
  labelMode?: 'inline' | 'static';
  placeholder?: string;
  helperText?: React.ReactNode;
  textFieldProps?: TextFieldProps;
  disabled?: boolean;
  required?: boolean;
};

export default function RHFAutocomplete({
  name,
  options,
  label,
  labelMode = 'static',
  placeholder,
  freeSolo = false,
  helperText,
  textFieldProps,
  disabled,
  required,
  ...formControlProps
}: RHFAutocompleteProps) {
  const { control, setValue } = useFormContext();

  const handleChange = useCallback(
    (v: string) => setValue(name, v),
    [name, setValue]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValue = (() => {
          if (!field.value) return null;
          if (freeSolo && typeof field.value === 'string') return field.value;
          return options.find((opt) => opt.value === field.value) || null;
        })();

        return (
          <FormControl error={Boolean(error)} {...formControlProps}>
            {label && labelMode === 'static' && (
              <FormLabel required={required} sx={{ mb: 1 }}>
                {label}
              </FormLabel>
            )}
            <Autocomplete<Option, false, false, typeof freeSolo>
              options={options}
              freeSolo={freeSolo}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.name
              }
              value={selectedValue}
              onChange={(_, value) => {
                if (!value) {
                  handleChange('');
                  return;
                }

                if (typeof value === 'string') {
                  handleChange(value);
                } else {
                  handleChange(value.value);
                }
              }}
              disabled={disabled}
              isOptionEqualToValue={(option, value) =>
                typeof value === 'string'
                  ? option.name === value
                  : option.value === value.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  {...textFieldProps}
                  label={labelMode === 'inline' ? label : undefined}
                  placeholder={placeholder}
                  error={Boolean(error)}
                  helperText={error ? error.message : helperText}
                  required={required}
                />
              )}
            />
          </FormControl>
        );
      }}
    />
  );
}
