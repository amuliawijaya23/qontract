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
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { LoadingSpinner } from '@/components/loading';

import QueryProvider from '@/components/query-provider/query-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeMode = useThemeStore((state) => state.mode);

  const [_user, loading] = useAuthState(auth);

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
