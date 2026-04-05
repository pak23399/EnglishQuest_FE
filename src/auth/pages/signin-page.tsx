import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useAuth } from '@/auth/context/auth-context';
import { toAbsoluteUrl } from '@/lib/helpers';
import { ProcessingOverlay } from '@/components/ui/processing-overlay';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getSigninSchema, SigninSchemaType } from '../forms/signin-schema';
import { ROUTE_PATHS } from '@/routing/paths';
import { UserRole } from '@/models/user.model';
import * as authHelper from '@/auth/lib/helpers';
export function SignInPage() {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Key used to remember username (do NOT store password for security)
  const REMEMBER_KEY = 'eps_signin_remember';
  let savedRemember: { username?: string; rememberMe?: boolean } | null = null;
  try {
    const raw = localStorage.getItem(REMEMBER_KEY);
    savedRemember = raw ? JSON.parse(raw) : null;
  } catch {
    savedRemember = null;
  }

  // Check for success message from password reset or error messages
  useEffect(() => {
    const pwdReset = searchParams.get('pwd_reset');
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (pwdReset === 'success') {
      setSuccessMessage(
        intl.formatMessage({ id: 'AUTH.SIGNIN.PASSWORD_RESET_SUCCESS' }),
      );
    }

    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_failed':
          setError(
            errorDescription || intl.formatMessage({ id: 'AUTH.SIGNIN.ERROR_AUTH_CALLBACK_FAILED' }),
          );
          break;
        case 'auth_callback_error':
          setError(
            errorDescription ||
            intl.formatMessage({ id: 'AUTH.SIGNIN.ERROR_AUTH_CALLBACK_ERROR' }),
          );
          break;
        case 'auth_token_error':
          setError(
            errorDescription ||
            intl.formatMessage({ id: 'AUTH.SIGNIN.ERROR_AUTH_TOKEN_ERROR' }),
          );
          break;
        default:
          setError(
            errorDescription || intl.formatMessage({ id: 'AUTH.SIGNIN.ERROR_AUTH_GENERIC' }),
          );
          break;
      }
    }
  }, [searchParams, intl]);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      username: savedRemember?.username ?? '',
      password: '',
      rememberMe: !!savedRemember?.rememberMe,
    },
  });

  async function onSubmit(values: SigninSchemaType) {
    // Simple validation (avoid setting processing state if missing fields)
    if (!values.username.trim() || !values.password) {
      setError(intl.formatMessage({ id: 'AUTH.SIGNIN.ERROR_EMPTY_FIELDS' }));
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Sign in using the auth context
      await login(values.username, values.password);

      // Persist or remove remembered username depending on checkbox
      try {
        if (values.rememberMe) {
          localStorage.setItem(
            REMEMBER_KEY,
            JSON.stringify({ username: values.username, rememberMe: true }),
          );
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }
      } catch {
        // ignore storage errors
      }

      // Get the 'next' parameter from URL if it exists
      const nextPath = searchParams.get('next');
      const loggedInUser = authHelper.getUser();
      const defaultPath =
        loggedInUser?.role === UserRole.Admin
          ? ROUTE_PATHS.ADMIN_SECTIONS
          : ROUTE_PATHS.HOME;
      // Use navigate for navigation with replace to avoid going back to login
      navigate( nextPath || defaultPath, { replace: true });
    } catch (error: unknown) {
      console.log('ERROR', error);
      const status = (error as { status?: number })?.status;
      const message =
        status === 403
          ? intl.formatMessage({ id: 'AUTH.SIGNIN.ERROR_INVALID_CREDENTIALS' })
          : intl.formatMessage({ id: 'AUTH.SIGNIN.ERROR_SERVER' });
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isProcessing) {
      const next = searchParams.get('next');
      const u = authHelper.getUser();

      const defaultPath =
        u?.role === UserRole.Admin
          ? ROUTE_PATHS.ADMIN_SECTIONS
          : ROUTE_PATHS.HOME;

      navigate(next || defaultPath, { replace: true });
    }
  }, [isAuthenticated, isProcessing, navigate, searchParams]);

  return (
    <>
      {isProcessing && <ProcessingOverlay />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="block w-full space-y-5"
        >
          <div className="text-center space-y-1 pb-3">
            <div className="flex justify-center mb-4">
              <img
                src={toAbsoluteUrl('/media/logos/english_quest_stuff.png')}
                alt="EnglishQuest Logo"
                className="h-40 w-auto"
              />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {intl.formatMessage({ id: 'AUTH.SIGNIN.TITLE' })}
            </h1>
          </div>

          <div className="relative py-1.5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>

          {error && (
            <Alert
              variant="destructive"
              appearance="light"
              onClose={() => setError(null)}
            >
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          {successMessage && (
            <Alert appearance="light" onClose={() => setSuccessMessage(null)}>
              <AlertIcon>
                <Check />
              </AlertIcon>
              <AlertTitle>{successMessage}</AlertTitle>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: 'AUTH.SIGNIN.USERNAME_LABEL' })}</FormLabel>
                <FormControl>
                  <Input placeholder={intl.formatMessage({ id: 'AUTH.SIGNIN.USERNAME_PLACEHOLDER' })} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center gap-2.5">
                  <FormLabel>{intl.formatMessage({ id: 'AUTH.SIGNIN.PASSWORD_LABEL' })}</FormLabel>
                </div>
                <div className="relative">
                  <Input
                    placeholder={intl.formatMessage({ id: 'AUTH.SIGNIN.PASSWORD_PLACEHOLDER' })}
                    type={passwordVisible ? 'text' : 'password'} // Toggle input type
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    mode="icon"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {passwordVisible ? (
                      <EyeOff className="text-muted-foreground" />
                    ) : (
                      <Eye className="text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {intl.formatMessage({ id: 'AUTH.SIGNIN.REMEMBER_ME' })}
                    </FormLabel>
                  </div>
                  <Link
                    to="/auth/reset-password"
                    className="text-sm font-semibold text-foreground hover:text-primary"
                  >
                    {intl.formatMessage({ id: 'AUTH.SIGNIN.FORGOT_PASSWORD' })}
                  </Link>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing
              ? intl.formatMessage({ id: 'AUTH.SIGNIN.SUBMITTING' })
              : intl.formatMessage({ id: 'AUTH.SIGNIN.SUBMIT' })}
          </Button>

          <div className="text-center text-sm">
            {intl.formatMessage({ id: 'AUTH.SIGNIN.NO_ACCOUNT' })}{' '}
            <Link to="/auth/signup" className="font-semibold text-primary hover:underline">
              {intl.formatMessage({ id: 'AUTH.SIGNIN.SIGNUP_LINK' })}
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
}
