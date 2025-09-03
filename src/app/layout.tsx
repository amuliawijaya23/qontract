'use client';

import ThemeProvider from '@/theme';
import FormControl from '@/components/form-control';
import useThemeStore from '@/hooks/store/use-theme-store';
import SettingsDrawer from '@/components/navigation/settings-drawer';
import {
  AddOrganizationView,
  OrganizationFormView,
} from '@/sections/organization/organization-form';
import NotificationProvider from '@/components/notification';
import { LoadingSpinner } from '@/components/loading';

import QueryProvider from '@/components/query-provider/query-provider';
import useAuthStore from '@/hooks/store/use-auth-store';
import { initAuthListener } from '@/hooks/store/use-auth-store';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/navigation';
import { ProjectTemplateFormView } from '@/sections/organization/projects/project-template-form';
import PriceFormView from '@/sections/organization/price-list/price-list-form';
import { setupPresence } from '@/subscribers/auth';
import ClientFormView from '@/sections/organization/clients/client-form';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const themeMode = useThemeStore((state) => state.mode);

  const userId = useAuthStore((state) => state.user?.uid);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    initAuthListener();

    if (!userId) return;

    let clearPresence: (() => Promise<void>) | undefined;

    setupPresence(userId || '').then((fn) => {
      clearPresence = fn;
    });

    return () => {
      clearPresence?.().catch(console.error);
    };
  }, [userId]);

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
                {!loading &&
                  (pathname.startsWith('/app') ? (
                    <Navigation>{children}</Navigation>
                  ) : (
                    children
                  ))}
                <SettingsDrawer />
                <AddOrganizationView />
                <OrganizationFormView />
                <ProjectTemplateFormView />
                <PriceFormView />
                <ClientFormView />
              </FormControl>
            </NotificationProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
