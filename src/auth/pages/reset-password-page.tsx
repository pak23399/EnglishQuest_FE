import { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, ChevronLeft, MoveRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
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
import { LoaderCircleIcon } from 'lucide-react';
import {
  getResetRequestSchema,
  ResetRequestSchemaType,
} from '../forms/reset-password-schema';

export function ResetPasswordPage() {
  const { } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ResetRequestSchemaType>({
    resolver: zodResolver(getResetRequestSchema()),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ResetRequestSchemaType) {
    try {
      setIsProcessing(true);
      setError(null);

      // Set success message
      setSuccessMessage(
        `Mã xác thực OTP đã được gửi đến ${values.email}. Vui lòng kiểm tra hộp thư của bạn.`,
      );

      // Reset form
      form.reset();
    } catch (err) {
      console.error('Password reset request error:', err);
      setError(
        err instanceof Error
          ? `Error: ${err.message}. Please ensure your email is correct and try again.`
          : 'An unexpected error occurred. Please try again or contact support.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-base tracking-tight">
              Đặt Lại Mật Khẩu
            </h1>
            <p className="text-sm text-muted-foreground">
              Nhập địa chỉ email của tài khoản cần đặt lại mật khẩu.
            </p>
          </div>
          <Link to="/auth/signin"><Button className='absolute left-5 top-5' variant="outline" mode="icon">
            <ChevronLeft />
          </Button></Link>


          {error && (
            <Alert variant="destructive">
              <AlertIcon>
                <AlertCircle className="h-4 w-4" />
              </AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          {successMessage && (
            <Alert>
              <AlertIcon>
                <Check className="h-4 w-4 text-green-500" />
              </AlertIcon>
              <AlertTitle>{successMessage}</AlertTitle>
            </Alert>
          )}

          <div className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <LoaderCircleIcon className="h-4 w-4 animate-spin" /> Sending Link...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Tiếp Tục <MoveRight />
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
