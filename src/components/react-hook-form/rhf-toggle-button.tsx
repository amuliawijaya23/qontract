import React, { ReactNode, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';

import { useField, useFormikContext } from 'formik';
import { Controller, useFormContext } from 'react-hook-form';

import {
  ToggleButton,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButtonProps,
  ToggleButtonGroupProps,
} from '@mui/material';

type Option = {
  value: string;
  name: ReactNode;
};

type RHFToggleButtonProps = {
  name: string;
  options: Option[];
  helperText?: string;
  label?: string;
  required?: boolean;
  size?: ToggleButtonGroupProps['size'];
  toggleButtonProps?: ToggleButtonProps;
  toggleButtonGroupProps?: ToggleButtonGroupProps;
  buttonWidth?: number;
  multiple?: boolean;
};

export default function RHFToggleButton({
  name,
  options,
  toggleButtonGroupProps,
  toggleButtonProps,
  size,
  buttonWidth,
  multiple = false,
}: RHFToggleButtonProps) {
  const { control } = useFormContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const orientation =
    isMobile && options.length > 3 ? 'vertical' : 'horizontal';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <ToggleButtonGroup
          exclusive={!multiple}
          {...toggleButtonGroupProps}
          size={size}
          orientation={orientation}
          value={field.value}
          onChange={(
            _event: React.MouseEvent<HTMLElement>,
            value: string | string[]
          ) => {
            field.onChange(value);
          }}
        >
          {options.map((option) => (
            <ToggleButton
              {...toggleButtonProps}
              key={option.value}
              value={option.value}
              sx={{ width: buttonWidth, ...toggleButtonProps?.sx }}
            >
              {option.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
}
