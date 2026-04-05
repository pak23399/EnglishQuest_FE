import { Check, Crown, Sparkles, Zap, ChevronDown } from 'lucide-react';
import { useAuth } from '@/auth/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useActiveSubscription, useCreatePayment } from '@/hooks/use-subscription';
import { SubscriptionPlan } from '@/models/user.model';
import { useIntl } from 'react-intl';
import { motion } from 'framer-motion';

export function SubscriptionPage() {
  const intl = useIntl();
  const { user } = useAuth();
  const { data: subscription } = useActiveSubscription();
  const { mutate: createPayment, isPending } = useCreatePayment();

  const getPlanName = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.Free:
        return intl.formatMessage({ id: 'SUBSCRIPTION.PLAN_FREE' });
      case SubscriptionPlan.Support:
        return intl.formatMessage({ id: 'SUBSCRIPTION.PLAN_SUPPORT' });
      case SubscriptionPlan.Premium:
        return intl.formatMessage({ id: 'SUBSCRIPTION.PLAN_PREMIUM' });
      default:
        return '';
    }
  };

  const plans = [
    {
      id: SubscriptionPlan.Free,
      name: intl.formatMessage({ id: 'SUBSCRIPTION.PLAN_FREE' }),
      price: 0,
      icon: Zap,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      borderColor: 'border-slate-200 dark:border-slate-700',
      features: [
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_BASIC_LESSONS' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_HEARTS' }, { count: 5 }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_STANDARD_SUPPORT' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_PROGRESS_TRACKING' }),
      ],
    },
    {
      id: SubscriptionPlan.Support,
      name: intl.formatMessage({ id: 'SUBSCRIPTION.PLAN_SUPPORT' }),
      price: 49000,
      icon: Sparkles,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-300 dark:border-blue-700',
      popular: true,
      features: [
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_ALL_FREE' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_UNLIMITED_HEARTS' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_PRIORITY_SUPPORT' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_ANALYTICS' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_AD_FREE' }),
      ],
    },
    {
      id: SubscriptionPlan.Premium,
      name: intl.formatMessage({ id: 'SUBSCRIPTION.PLAN_PREMIUM' }),
      price: 99000,
      icon: Crown,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      borderColor: 'border-amber-300 dark:border-amber-700',
      features: [
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_ALL_SUPPORT' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_EXCLUSIVE_LESSONS' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_STREAK_FREEZE' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_OFFLINE' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_EARLY_ACCESS' }),
        intl.formatMessage({ id: 'SUBSCRIPTION.FEATURE_COACH' }),
      ],
    },
  ];

  const faqs = [
    {
      question: intl.formatMessage({ id: 'SUBSCRIPTION.FAQ_CANCEL_Q' }),
      answer: intl.formatMessage({ id: 'SUBSCRIPTION.FAQ_CANCEL_A' }),
    },
    {
      question: intl.formatMessage({ id: 'SUBSCRIPTION.FAQ_PAYMENT_Q' }),
      answer: intl.formatMessage({ id: 'SUBSCRIPTION.FAQ_PAYMENT_A' }),
    },
    {
      question: intl.formatMessage({ id: 'SUBSCRIPTION.FAQ_SWITCH_Q' }),
      answer: intl.formatMessage({ id: 'SUBSCRIPTION.FAQ_SWITCH_A' }),
    },
  ];

  const handleUpgrade = (planId: SubscriptionPlan) => {
    createPayment(
      { plan: planId },
      {
        onSuccess: (data) => {
          if (data.success && data.paymentUrl) {
            window.location.href = data.paymentUrl;
          }
        },
      }
    );
  };



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-10 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {intl.formatMessage({ id: 'SUBSCRIPTION.TITLE' })}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {intl.formatMessage({ id: 'SUBSCRIPTION.SUBTITLE' })}
        </p>
      </motion.div>

      {/* Current Plan Banner */}
      {subscription && subscription.plan !== SubscriptionPlan.Free && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-primary/50 bg-primary/5 backdrop-blur-sm">
            <CardContent className="py-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {intl.formatMessage({ id: 'SUBSCRIPTION.CURRENT_PLAN' })}
                  </p>
                  <p className="text-2xl font-bold">
                    {getPlanName(subscription.plan)}
                  </p>
                  {subscription.endDate && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {subscription.autoRenew
                        ? intl.formatMessage(
                          { id: 'SUBSCRIPTION.RENEWS_ON' },
                          { date: new Date(subscription.endDate).toLocaleDateString() }
                        )
                        : intl.formatMessage(
                          { id: 'SUBSCRIPTION.EXPIRES_ON' },
                          { date: new Date(subscription.endDate).toLocaleDateString() }
                        )}
                    </p>
                  )}
                </div>
                <Badge variant="primary" className="text-sm px-4 py-1.5">
                  {intl.formatMessage({ id: 'SUBSCRIPTION.ACTIVE' })}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Plans Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {plans.map((plan, index) => {
          const PlanIcon = plan.icon;
          const isCurrentPlan = user?.currentPlan === plan.id;

          return (
            <motion.div key={plan.id} variants={itemVariants}>
              <Card
                className={`relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.popular
                  ? `${plan.borderColor} border-2 shadow-lg`
                  : 'border hover:border-primary/30'
                  } ${isCurrentPlan ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              >

                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge
                      variant="primary"
                      className="px-4 py-1 text-xs font-semibold shadow-md"
                    >
                      {intl.formatMessage({ id: 'SUBSCRIPTION.MOST_POPULAR' })}
                    </Badge>
                  </div>
                )}

                <CardHeader className="flex flex-col items-center justify-center pb-4 pt-8">
                  {/* Row 1: Icon */}
                  <div
                    className={`h-16 w-16 rounded-2xl ${plan.bgColor} flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110`}
                  >
                    <PlanIcon className={`h-8 w-8 ${plan.color}`} />
                  </div>
                  {/* Row 2: Plan Name */}
                  <CardTitle className="text-2xl font-bold text-center">{plan.name}</CardTitle>
                  {/* Row 3: Price */}
                  {plan.price > 0 && (
                    <div className="mt-4 text-center">
                      <span className="text-4xl font-bold">
                        {`${plan.price.toLocaleString('vi-VN')}₫`}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {intl.formatMessage({ id: 'SUBSCRIPTION.PER_MONTH' })}
                      </span>
                    </div>
                  )}
                </CardHeader>



                <CardContent className="space-y-6">
                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <Button
                    variant={isCurrentPlan ? 'secondary' : plan.popular ? 'primary' : 'secondary'}
                    className={`w-full h-12 text-base font-medium transition-all duration-300 ${plan.popular && !isCurrentPlan
                      ? 'shadow-lg hover:shadow-xl'
                      : ''
                      }`}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || isPending || plan.id === SubscriptionPlan.Free}
                  >
                    {isCurrentPlan
                      ? intl.formatMessage({ id: 'SUBSCRIPTION.CURRENT' })
                      : plan.id === SubscriptionPlan.Free
                        ? intl.formatMessage({ id: 'SUBSCRIPTION.FREE_FOREVER' })
                        : isPending
                          ? intl.formatMessage({ id: 'SUBSCRIPTION.PROCESSING' })
                          : intl.formatMessage(
                            { id: 'SUBSCRIPTION.UPGRADE_TO' },
                            { plan: plan.name }
                          )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-muted/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              {intl.formatMessage({ id: 'SUBSCRIPTION.FAQ_TITLE' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
