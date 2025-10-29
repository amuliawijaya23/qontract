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
  multiple?: boolean;
  showErrorText?: boolean;
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
  showErrorText,
  multiple = false,
  ...formControlProps
}: IFormSelect) {
  const [field, meta] = useField(name);

  return (
    <FormControl error={Boolean(meta.error)} {...formControlProps}>
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
        error={Boolean(meta.error)}
        color="secondary"
        renderValue={(selected) => {
          if (multiple) {
            return (selected as string[])
              .map((val) => options.find((o) => o.value === val)?.name || val)
              .join(', ');
          }
          return options.find((o) => o.value === selected)?.name || selected;
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
        {showErrorText && meta.error ? meta.error : helperText}
      </FormHelperText>
    </FormControl>
  );
}
