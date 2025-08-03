import { DM_Sans, Noto_Sans } from 'next/font/google';

export const primaryFont = Noto_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  subsets: ['latin'],
});

export const secondaryFont = DM_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  subsets: ['latin'],
});
