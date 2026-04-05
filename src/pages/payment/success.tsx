import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTE_PATHS } from '@/routing/paths';
import { useIntl } from 'react-intl';
import Lottie from 'lottie-react';
import successAnimation from '@/assets/lottie/Success.json';
import { motion } from 'framer-motion';
import { subscriptionService } from '@/services/subscription.service';
import { PaymentResult } from '@/models/subscription.model';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export function PaymentSuccessPage() {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        const success = searchParams.get('success');
        const message = searchParams.get('message');
        const paymentId = searchParams.get('paymentId');
        const transactionId = searchParams.get('transactionId');
        const planName = searchParams.get('planName');

        if (success === 'true' && message) {
          setPaymentResult({
            success: true,
            message: decodeURIComponent(message),
            paymentId: paymentId || undefined,
            transactionId: transactionId || undefined,
            planName: planName ? decodeURIComponent(planName) : undefined,
          });
        } else {
          const params = new URLSearchParams(searchParams.toString());
          const result = await subscriptionService.handlePaymentReturn(params);

          setPaymentResult(result);

          if (!result.success) {
            navigate(
              `/payment/failed?message=${encodeURIComponent(result.message)}`
            );
            return;
          }
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        navigate('/payment/failed?message=Payment processing error');
      } finally {
        setIsLoading(false);
      }
    };

    processPaymentReturn();
  }, [searchParams, navigate]);

  useEffect(() => {
    if (isLoading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(ROUTE_PATHS.SUBSCRIPTION);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-200px)]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="max-w-lg w-full">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col items-center justify-center pb-4 pt-6">
            {/* Lottie Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.3 }}
              className="h-28 w-28"
            >
              <Lottie
                animationData={successAnimation}
                loop={false}
                className="h-full w-full"
              />
            </motion.div>

            <Badge variant="primary" className="mb-3">
              <Crown className="h-4 w-4 mr-2" />
              {intl.formatMessage({ id: 'PAYMENT.SUCCESS.TITLE' })}
            </Badge>

            <CardTitle className="text-2xl text-green-600 dark:text-green-400 text-center">
              {paymentResult?.planName
                ? `${intl.formatMessage({ id: 'PAYMENT.SUCCESS.WELCOME' })} ${paymentResult.planName}!`
                : intl.formatMessage({ id: 'PAYMENT.SUCCESS.WELCOME' })}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="text-center">
              <p className="text-muted-foreground">
                {intl.formatMessage({ id: 'PAYMENT.SUCCESS.MESSAGE' })}
              </p>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="font-medium">
                {intl.formatMessage({ id: 'PAYMENT.SUCCESS.STATUS' })}
              </span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                {intl.formatMessage({ id: 'PAYMENT.SUCCESS.ACTIVE' })}
              </Badge>
            </div>

            {/* Payment IDs */}
            {(paymentResult?.paymentId || paymentResult?.transactionId) && (
              <div className="space-y-2">
                {paymentResult?.paymentId && (
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="text-sm font-medium">
                      {intl.formatMessage({ id: 'PAYMENT.SUCCESS.PAYMENT_ID' })}:
                    </p>
                    <p className="text-muted-foreground font-mono text-xs">
                      {paymentResult.paymentId}
                    </p>
                  </div>
                )}

                {paymentResult?.transactionId && (
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="text-sm font-medium">
                      {intl.formatMessage({ id: 'PAYMENT.SUCCESS.TRANSACTION_ID' })}:
                    </p>
                    <p className="text-muted-foreground font-mono text-xs">
                      {paymentResult.transactionId}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Redirect countdown */}
            <p className="text-sm text-center text-muted-foreground">
              {intl.formatMessage(
                { id: 'PAYMENT.SUCCESS.REDIRECT' },
                { seconds: countdown }
              )}
            </p>

            {/* Buttons */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => navigate(ROUTE_PATHS.HOME)}
              >
                {intl.formatMessage({ id: 'PAYMENT.SUCCESS.GO_HOME' })}
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => navigate(ROUTE_PATHS.SUBSCRIPTION)}
              >
                {intl.formatMessage({ id: 'PAYMENT.SUCCESS.VIEW_SUBSCRIPTION' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* What's Next */}
            <div className="p-4 bg-muted/50 rounded-lg border text-center">
              <h3 className="font-semibold mb-2 flex items-center justify-center">
                <Sparkles className="h-4 w-4 mr-2" />
                {intl.formatMessage({ id: 'PAYMENT.SUCCESS.WHATS_NEXT' })}
              </h3>
              <p className="text-muted-foreground text-sm">
                {intl.formatMessage({ id: 'PAYMENT.SUCCESS.WHATS_NEXT_DESC1' })}
              </p>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                {intl.formatMessage({ id: 'PAYMENT.SUCCESS.WHATS_NEXT_DESC2' })}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
