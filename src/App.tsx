import { AppRouting } from '@/routing/app-routing';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './auth/providers/auth-provider';
import { BreadcrumbProvider } from './layouts/main-layout/components/breadcrumb';
import { I18nProvider } from './providers/i18n-provider';
import { QueryProvider } from './providers/query-provider';
import { SettingsProvider } from './providers/settings-provider';
import { ThemeProvider } from './providers/theme-provider';
import { TooltipsProvider } from './providers/tooltips-provider';

const { BASE_URL } = import.meta.env;

export function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <ThemeProvider>
            <I18nProvider>
              <HelmetProvider>
                <TooltipsProvider>
                  <QueryProvider>
                    <LoadingBarContainer>
                      <BrowserRouter basename={BASE_URL}>
                        <Toaster />
                          <BreadcrumbProvider>
                            <AppRouting />
                          </BreadcrumbProvider>
                      </BrowserRouter>
                    </LoadingBarContainer>
                  </QueryProvider>
                </TooltipsProvider>
              </HelmetProvider>
            </I18nProvider>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
