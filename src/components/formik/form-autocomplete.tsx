import React, { useMemo } from 'react';

import {
  Autocomplete,
  TextField,
  TextFieldProps,
  FormControl,
  FormControlProps,
  FormLabel,
} from '@mui/material';
import { useField, useFormikContext } from 'formik';

interface IOption {
  name: string;
  value: string;
}

interface IFormAutocomplete extends FormControlProps {
  name: string;
  options: IOption[];
  label?: string;
  freeSolo?: boolean;
  labelMode?: 'inline' | 'static';
  placeholder?: string;
  helperText?: React.ReactNode;
  textFieldProps?: TextFieldProps;
  disabled?: boolean;
  required?: boolean;
  showErrorText?: boolean;
}

export default function FormAutocomplete({
  name,
  options,
  label,
  labelMode = 'inline',
  placeholder,
  freeSolo = false,
  helperText,
  textFieldProps,
  disabled,
  required,
  showErrorText,
  ...formControlProps
}: IFormAutocomplete) {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const selectedValue = useMemo(() => {
    if (!field.value) return null;
    if (freeSolo && typeof field.value === 'string') return field.value;
    return options.find((opt) => opt.value === field.value) || null;
  }, [freeSolo, field.value, options]);

  return (
    <FormControl error={Boolean(meta.error)} {...formControlProps}>
      {label && labelMode === 'static' && (
        <FormLabel required={required} sx={{ mb: 1 }}>
          {label}
        </FormLabel>
      )}
      <Autocomplete<IOption, false, false, typeof freeSolo>
        options={options}
        freeSolo={freeSolo}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.name
        }
        value={selectedValue}
        onChange={(_, value) => {
          if (!value) {
            setFieldValue(name, '');
            return;
          }

          if (typeof value === 'string') {
            setFieldValue(name, value);
          } else {
            setFieldValue(name, value.value);
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
            {...textFieldProps}
            label={labelMode === 'inline' ? label : undefined}
            placeholder={placeholder}
            error={Boolean(meta.error)}
            helperText={showErrorText && meta.error ? meta.error : helperText}
            required={required}
          />
        )}
      />
    </FormControl>
  );
}
