import { alpha } from '@mui/material/styles';

export const grey = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334144',
  800: '#1E293B',
  900: '#0F172A',
  950: '#020617',
};

export const royalBlue = {
  50: '#F0F5FE',
  100: '#DCE8FD',
  200: '#C1D8FC',
  300: '#96C0FA',
  400: '#659FF5',
  500: '#3573EF',
  600: '#2B5CE5',
  700: '#2349D2',
  800: '#233CAA',
  900: '#213787',
  950: '#192352',
};

export const white = {
  100: '#FFFFFF',
  92: 'rgba(255,255,255,.92)',
  56: 'rgba(255,255,255,.56)',
  12: 'rgba(255,255,255,.12)',
};

export const black = {
  100: '#000000',
  87: 'rgba(0, 0, 0,.87)',
  56: 'rgba(0, 0, 0,.56)',
  32: 'rgba(0, 0, 0,.32)',
  20: 'rgba(0, 0, 0,.20)',
  12: 'rgba(0, 0, 0,.12)',
};

export const jade = {
  50: '#EFFEF7',
  100: '#DAFEEF',
  200: '#B8FADD',
  300: '#81F4C3',
  400: '#43E5A0',
  500: '#1ACD81',
  600: '#0FA968',
  700: '#108554',
  800: '#126945',
  900: '#11563A',
  950: '#03301F',
};

export const supernova = {
  50: '#FFFFEA',
  55: '#FCF7E9',
  100: '#FFFDC5',
  200: '#FFFB85',
  300: '#FFF346',
  400: '#FFE51B',
  500: '#FDC500',
  600: '#E29A00',
  700: '#BB6E02',
  800: '#985508',
  900: '#7C450B',
  950: '#482400',
};

export const wildWatermelon = {
  50: '#FEF2F3',
  100: '#FDE6E6',
  200: '#FDB0D4',
  300: '#F8A9B1',
  400: '#F16172',
  500: '#EA4961',
  600: '#D62849',
  700: '#B41C3D',
  800: '#971A3A',
  900: '#811A37',
  950: '#480919',
};

export const primary = {
  lighter: royalBlue[400],
  light: royalBlue[500],
  main: royalBlue[600],
  dark: royalBlue[700],
  darker: royalBlue[800],
  contrastText: white[92],
};

export const secondary = {
  lighter: supernova[200],
  light: supernova[400],
  main: supernova[500],
  dark: supernova[600],
  darker: supernova[700],
  contrastText: white[92],
};

export const info = {
  lighter: royalBlue[200],
  light: royalBlue[400],
  main: royalBlue[500],
  dark: royalBlue[600],
  darker: royalBlue[700],
  contrastText: white[92],
};

export const success = {
  lighter: jade[300],
  light: jade[400],
  main: jade[500],
  dark: jade[600],
  darker: jade[700],
  contrastText: white[92],
};

export const warning = {
  lighter: supernova[200],
  light: supernova[400],
  main: supernova[600],
  dark: supernova[700],
  darker: supernova[800],
  contrastText: white[92],
};

export const error = {
  lighter: wildWatermelon[200],
  light: wildWatermelon[300],
  main: wildWatermelon[400],
  dark: wildWatermelon[500],
  darker: wildWatermelon[600],
  contrastText: white[92],
};

export const common = {
  black: black[100],
  white: white[100],
};

export const action = {
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const main = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  black,
  white,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

export function palette(mode: 'light' | 'dark') {
  const light = {
    ...main,
    type: 'light',
    mode: 'light',
    text: {
      black: black[87],
      primary: black[87],
      secondary: black[56],
      disabled: grey[700],
    },
    background: {
      paper: supernova[55],
      default: white[100],
      menu: black[100],
    },
    action: {
      ...main.action,
      hover: grey[200],
      selected: grey[200],
      active: grey[600],
      disabledBackground: black[12],
    },
  };

  const dark = {
    type: 'dark',
    mode: 'dark',
    ...main,
    text: {
      black: black[87],
      primary: white[92],
      secondary: white[56],
      disabled: grey[100],
    },
    background: {
      paper: grey[900],
      default: grey[950],
      menu: black[100],
    },
    action: {
      ...main.action,
      hover: grey[900],
      selected: grey[900],
      active: grey[500],
      disabledBackground: grey[800],
    },
  };

  return mode === 'light' ? light : dark;
}
