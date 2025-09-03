import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material';
import { useField } from 'formik';
import React from 'react';

interface IOption {
  name: string;
  value: string;
}

interface IFormSelect extends FormControlProps {
  name: string;
  options: IOption[];
  label?: string;
  labelMode?: 'inline' | 'static';
  placeholder?: string;
  helperText?: React.ReactNode;
  slotProps?: SelectProps['slotProps'];
}

export default function FormSelect({
  name,
  label,
  labelMode = 'inline',
  required,
  disabled,
  size,
  placeholder,
  helperText,
  slotProps,
  options,
  ...formControlProps
}: IFormSelect) {
  const [field, meta] = useField(name);

  return (
    <FormControl
      error={meta.touched && Boolean(meta.error)}
      {...formControlProps}
    >
      {label && labelMode === 'static' && (
        <FormLabel required={required} sx={{ mb: 1 }}>
          {label}
        </FormLabel>
      )}
      <Select
        {...field}
        required={required}
        disabled={disabled}
        size={size}
        label={labelMode === 'inline' ? label : undefined}
        slotProps={slotProps}
        error={meta.touched && Boolean(meta.error)}
        color="secondary"
      >
        <MenuItem value={''} disabled>
          {placeholder}
        </MenuItem>
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
        {meta.touched && meta.error ? meta.error : helperText}
      </FormHelperText>
    </FormControl>
  );
}
