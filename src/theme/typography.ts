import { primaryFont, secondaryFont } from '@/app/fonts';

// ----------------------------------------------------------------------

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({
  sm,
  md,
  lg,
}: {
  sm: number;
  md: number;
  lg: number;
}) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontSecondaryFamily: React.CSSProperties['fontFamily'];
    fontWeightSemiBold: React.CSSProperties['fontWeight'];
  }
}

// ----------------------------------------------------------------------

export const typography = {
  fontFamily: primaryFont.style.fontFamily,
  fontSecondaryFamily: secondaryFont.style.fontFamily,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    lineHeight: '64px',
    fontSize: pxToRem(40),
    fontFamily: secondaryFont.style.fontFamily,
    ...responsiveFontSizes({ sm: 40, md: 40, lg: 40 }),
  },
  h2: {
    fontWeight: 700,
    lineHeight: '48px',
    fontSize: pxToRem(32),
    fontFamily: secondaryFont.style.fontFamily,
    ...responsiveFontSizes({ sm: 32, md: 32, lg: 32 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: '32px',
    fontSize: pxToRem(20),
    fontFamily: secondaryFont.style.fontFamily,
    ...responsiveFontSizes({ sm: 20, md: 20, lg: 20 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: '24px',
    fontSize: pxToRem(16),
    fontFamily: secondaryFont.style.fontFamily,
    ...responsiveFontSizes({ sm: 16, md: 16, lg: 16 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: '20px',
    fontSize: pxToRem(12),
    fontFamily: secondaryFont.style.fontFamily,
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 12 }),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 28 / 18,
    fontSize: pxToRem(8),
    fontFamily: secondaryFont.style.fontFamily,
    ...responsiveFontSizes({ sm: 8, md: 8, lg: 8 }),
  },
  subtitle1: {
    fontWeight: 400,
    lineHeight: '16px',
    fontFamily: primaryFont.style.fontFamily,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 12 }),
  },
  subtitle2: {
    fontWeight: 700,
    lineHeight: '16px',
    fontFamily: primaryFont.style.fontFamily,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 12 }),
  },
  body1: {
    fontWeight: 400,
    lineHeight: '24px',
    fontFamily: primaryFont.style.fontFamily,
    fontSize: pxToRem(15),
    ...responsiveFontSizes({ sm: 15, md: 15, lg: 15 }),
  },
  body2: {
    fontWeight: 400,
    lineHeight: '20px',
    fontFamily: primaryFont.style.fontFamily,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ sm: 14, md: 14, lg: 14 }),
  },
  caption: {
    lineHeight: 1.5,
    fontFamily: primaryFont.style.fontFamily,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 12 }),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontFamily: primaryFont.style.fontFamily,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 12 }),
    textTransform: 'uppercase',
  },
} as const;
