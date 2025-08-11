import React, { ReactNode } from 'react';

import AppNav from './app-nav';

export default function Navigation({ children }: { children: ReactNode }) {
  return <AppNav>{children}</AppNav>;
}
