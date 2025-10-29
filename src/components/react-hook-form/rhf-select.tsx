import React from 'react';

import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type Option = {
  name: string;
  value: string;
};

interface RHFSelectProps extends FormControlProps {
  name: string;
  options: Option[];
  label?: string;
  labelMode?: 'inline' | 'static';
  placeholder?: string;
  helperText?: React.ReactNode;
  slotProps?: SelectProps['slotProps'];
  multiple?: boolean;
  showErrorText?: boolean;
}

export default function RHFSelect({
  name,
  label,
  labelMode = 'static',
  required,
  disabled,
  size = 'small',
  helperText,
  slotProps,
  options,
  multiple = false,
  ...formControlProps
}: RHFSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)} {...formControlProps}>
          {label && labelMode === 'static' && (
            <FormLabel required={required} sx={{ mb: 1 }}>
              {label}
            </FormLabel>
          )}
          {label && labelMode === 'inline' && (
            <InputLabel required={required}>{label}</InputLabel>
          )}
          <Select
            {...field}
            multiple={multiple}
            required={required}
            disabled={disabled}
            size={size}
            label={labelMode === 'inline' ? label : undefined}
            slotProps={slotProps}
            error={Boolean(error)}
            color="secondary"
            renderValue={(selected) => {
              if (multiple) {
                return (selected as string[])
                  .map(
                    (val) => options.find((o) => o.value === val)?.name || val
                  )
                  .join(', ');
              }
              return (
                options.find((o) => o.value === selected)?.name || selected
              );
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={`${field.name}-select-${option.name}`}
                value={option.value}
              >
                {option.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {Boolean(error) ? error?.message : helperText}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
