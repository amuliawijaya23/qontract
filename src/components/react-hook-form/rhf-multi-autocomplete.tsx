import React from 'react';
import {
  Autocomplete,
  TextField,
  FormControl,
  FormHelperText,
  FormLabel,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type Option = {
  name: string;
  value: string;
};

type RHFMultiAutocompleteProps = {
  name: string;
  options: Option[];
  label?: string;
  labelMode?: 'inline' | 'static';
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
};

export default function RHFMultiAutocomplete({
  name,
  options,
  label,
  labelMode = 'static',
  required,
  disabled,
  placeholder,
  helperText,
}: RHFMultiAutocompleteProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValues = options.filter((opt) =>
          (field.value || []).includes(opt.value)
        );

        return (
          <FormControl fullWidth error={!!error} disabled={disabled}>
            {label && labelMode === 'static' && (
              <FormLabel required={required} sx={{ mb: 1 }}>
                {label}
              </FormLabel>
            )}

            <Autocomplete
              multiple
              options={options}
              getOptionLabel={(opt) => opt.name}
              value={selectedValues}
              onChange={(_, selected) => {
                const values = selected.map((v) => v.value);
                field.onChange(values);
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={labelMode === 'inline' ? label : undefined}
                  placeholder={placeholder}
                  required={required}
                  error={!!error}
                  helperText={error ? error.message : helperText}
                />
              )}
            />

            <FormHelperText>
              {error ? error.message : helperText}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}
