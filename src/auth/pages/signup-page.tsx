import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useAuth } from '@/auth/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useMemo } from 'react';
import { LoaderCircleIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';

export function SignUpPage() {
  const intl = useIntl();
  const { signUp } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signupSchema = useMemo(() => z
    .object({
      username: z.string().min(3, intl.formatMessage({ id: 'AUTH.SIGNUP.ERROR_USERNAME_MIN' })),
      email: z.string().email(intl.formatMessage({ id: 'AUTH.SIGNUP.ERROR_EMAIL_INVALID' })),
      password: z.string().min(6, intl.formatMessage({ id: 'AUTH.SIGNUP.ERROR_PASSWORD_MIN' })),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: intl.formatMessage({ id: 'AUTH.SIGNUP.ERROR_PASSWORDS_MISMATCH' }),
      path: ['confirmPassword'],
    }), [intl]);

  type SignupSchemaType = z.infer<typeof signupSchema>;

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: SignupSchemaType) {
    setIsProcessing(true);
    setError(null);
    try {
      await signUp({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      // Redirect is handled by AuthProvider or we can force it if needed
      // AuthProvider calls login() then we might need to navigate
      // But verify() or the protected route wrapper will handle redirect if we are logged in?
      // AuthProvider: await login(). Login sets user. 
      // Login page redirects if isAuthenticated. SignUp page doesn't have that check yet.
      // Let's add redirect here just in case or rely on a listener.
      // For now, simple redirect to dashboard as login is successful
      window.location.href = '/dashboard';

    } catch (err: unknown) {
      // Axios error handling
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorResponse = (err as any)?.response?.data;
      const errorMsg = errorResponse?.message || (err instanceof Error ? err.message : intl.formatMessage({ id: 'AUTH.SIGNUP.ERROR_REGISTRATION_FAILED' }));
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="w-full space-y-5">
      <div className="text-center space-y-1 pb-3">
        <div className="flex justify-center mb-4">
          <img
            src={toAbsoluteUrl('/media/logos/english_quest_stuff.png')}
            alt="EnglishQuest Logo"
            className="h-40 w-auto"
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {intl.formatMessage({ id: 'AUTH.SIGNUP.TITLE' })}
        </h1>
        <p className="text-sm text-muted-foreground">
          {intl.formatMessage({ id: 'AUTH.SIGNUP.SUBTITLE' })}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive" appearance="light">
              <AlertIcon><AlertCircle /></AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: 'AUTH.SIGNUP.USERNAME_LABEL' })}</FormLabel>
                <FormControl>
                  <Input placeholder={intl.formatMessage({ id: 'AUTH.SIGNUP.USERNAME_PLACEHOLDER' })} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: 'AUTH.SIGNUP.EMAIL_LABEL' })}</FormLabel>
                <FormControl>
                  <Input placeholder={intl.formatMessage({ id: 'AUTH.SIGNUP.EMAIL_PLACEHOLDER' })} {...field} />
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
                <FormLabel>{intl.formatMessage({ id: 'AUTH.SIGNUP.PASSWORD_LABEL' })}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={intl.formatMessage({ id: 'AUTH.SIGNUP.PASSWORD_PLACEHOLDER' })} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: 'AUTH.SIGNUP.CONFIRM_PASSWORD_LABEL' })}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={intl.formatMessage({ id: 'AUTH.SIGNUP.CONFIRM_PASSWORD_PLACEHOLDER' })} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <LoaderCircleIcon className="animate-spin h-4 w-4" />
                {intl.formatMessage({ id: 'AUTH.SIGNUP.SUBMITTING' })}
              </span>
            ) : (
              intl.formatMessage({ id: 'AUTH.SIGNUP.SUBMIT' })
            )}
          </Button>

          <div className="text-center text-sm">
            {intl.formatMessage({ id: 'AUTH.SIGNUP.HAS_ACCOUNT' })}{' '}
            <Link to="/auth/signin" className="font-semibold hover:underline">
              {intl.formatMessage({ id: 'AUTH.SIGNUP.SIGNIN_LINK' })}
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
