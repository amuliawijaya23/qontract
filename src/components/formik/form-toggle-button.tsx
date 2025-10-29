import React, { ReactNode, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';

import { useField, useFormikContext } from 'formik';

import {
  FormLabel,
  ToggleButton,
  useMediaQuery,
  FormHelperText,
  FormControlProps,
  ToggleButtonGroup,
  ToggleButtonProps,
  ToggleButtonGroupProps,
  FormControl,
} from '@mui/material';

type OptionType = {
  value: string;
  label: ReactNode;
};

type IFormToggleButton = {
  name: string;
  options: OptionType[];
  helperText?: string;
  label?: string;
  required?: boolean;
  size?: ToggleButtonGroupProps['size'];
  toggleButtonProps?: ToggleButtonProps;
  toggleButtonGroupProps?: ToggleButtonGroupProps;
  buttonWidth?: number;
  multiple?: boolean;
};

export default function FormToggleButton({
  name,
  options,
  toggleButtonGroupProps,
  toggleButtonProps,
  size,
  buttonWidth,
  multiple = false,
}: IFormToggleButton) {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const orientation =
    isMobile && options.length > 3 ? 'vertical' : 'horizontal';

  const handleChange = useCallback(
    (value: unknown) => setFieldValue(name, value),
    [name, setFieldValue]
  );

  return (
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
        handleChange(value);
      }}
    >
      {options.map((option) => (
        <ToggleButton
          {...toggleButtonProps}
          key={option.value}
          value={option.value}
          sx={{ width: buttonWidth, ...toggleButtonProps?.sx }}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
