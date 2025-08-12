'use client';

import ThemeProvider from '@/theme';
import FormControl from '@/components/form-control';
import useThemeStore from '@/hooks/store/use-theme-store';
import SettingsDrawer from '@/components/navigation/settings-drawer';
import {
  AddOrganizationView,
  OrganizationFormView,
} from '@/sections/organization-form';
import NotificationProvider from '@/components/notification';
import { LoadingSpinner } from '@/components/loading';

import QueryProvider from '@/components/query-provider/query-provider';
import useAuthStore from '@/hooks/store/use-auth-store';
import { initAuthListener } from '@/hooks/store/use-auth-store';

import { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeMode = useThemeStore((state) => state.mode);

  const { loading } = useAuthStore();

  useEffect(() => {
    initAuthListener();
  }, []);

  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: themeMode === 'light' ? '#FFFFEA' : '#020617',
        }}
      >
        <ThemeProvider>
          <QueryProvider>
            <NotificationProvider>
              <FormControl>
                {loading && <LoadingSpinner />}
                {!loading && children}
                <SettingsDrawer />
                <AddOrganizationView />
                <OrganizationFormView />
              </FormControl>
            </NotificationProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
