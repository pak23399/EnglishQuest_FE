import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTE_PATHS } from '@/routing/paths';
import { useIntl } from 'react-intl';
import Lottie from 'lottie-react';
import failAnimation from '@/assets/lottie/Fail.json';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';

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

const shakeVariants = {
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5, delay: 0.5 },
  },
};

export function PaymentFailurePage() {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const message = searchParams.get('message') || intl.formatMessage({ id: 'PAYMENT.FAILURE.MESSAGE' });
  const description = searchParams.get('description');

  const reasons = [
    intl.formatMessage({ id: 'PAYMENT.FAILURE.REASON_1' }),
    intl.formatMessage({ id: 'PAYMENT.FAILURE.REASON_2' }),
    intl.formatMessage({ id: 'PAYMENT.FAILURE.REASON_3' }),
    intl.formatMessage({ id: 'PAYMENT.FAILURE.REASON_4' }),
  ];

  const tryItems = [
    intl.formatMessage({ id: 'PAYMENT.FAILURE.TRY_1' }),
    intl.formatMessage({ id: 'PAYMENT.FAILURE.TRY_2' }),
    intl.formatMessage({ id: 'PAYMENT.FAILURE.TRY_3' }),
    intl.formatMessage({ id: 'PAYMENT.FAILURE.TRY_4' }),
  ];

  return (
    <motion.div
      className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-200px)]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="max-w-2xl w-full space-y-6">
        {/* Main Error Card */}
        <Card className="overflow-hidden border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-col items-center justify-center pb-2">
            {/* Lottie Animation */}
            <motion.div
              variants={shakeVariants}
              animate="shake"
              className="h-32 w-32 -mt-4"
            >
              <Lottie
                animationData={failAnimation}
                loop={false}
                className="h-full w-full"
              />
            </motion.div>

            <Badge variant="destructive" className="mb-2">
              <XCircle className="h-4 w-4 mr-2" />
              {intl.formatMessage({ id: 'PAYMENT.FAILURE.TITLE' })}
            </Badge>

            <CardTitle className="text-2xl text-red-600 dark:text-red-400 text-center">
              {intl.formatMessage({ id: 'PAYMENT.FAILURE.SUBTITLE' })}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-muted-foreground mb-4">
                {intl.formatMessage({ id: 'PAYMENT.FAILURE.NO_CHARGES' })}
              </p>
            </motion.div>

            {/* Error Details */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-red-800 dark:text-red-200">
                    {intl.formatMessage({ id: 'PAYMENT.FAILURE.ERROR' })}:
                  </span>
                  <span className="text-red-700 dark:text-red-300 text-right flex-1 ml-4">
                    {decodeURIComponent(message)}
                  </span>
                </div>
              </div>

              {description && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-amber-800 dark:text-amber-200">
                      {intl.formatMessage({ id: 'PAYMENT.FAILURE.DETAILS' })}:
                    </span>
                    <span className="text-amber-700 dark:text-amber-300 text-right flex-1 ml-4">
                      {decodeURIComponent(description)}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    {intl.formatMessage({ id: 'PAYMENT.FAILURE.ACCOUNT_STATUS' })}:
                  </span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                    {intl.formatMessage({ id: 'PAYMENT.FAILURE.NO_CHARGES_BADGE' })}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => navigate(ROUTE_PATHS.HOME)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {intl.formatMessage({ id: 'PAYMENT.FAILURE.GO_HOME' })}
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => navigate(ROUTE_PATHS.SUBSCRIPTION)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {intl.formatMessage({ id: 'PAYMENT.FAILURE.TRY_AGAIN' })}
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Help Cards */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                {intl.formatMessage({ id: 'PAYMENT.FAILURE.REASONS_TITLE' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {reasons.map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    • {reason}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <RefreshCw className="h-5 w-5 mr-2 text-green-600" />
                {intl.formatMessage({ id: 'PAYMENT.FAILURE.WHAT_TO_TRY' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {tryItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    • {item}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
