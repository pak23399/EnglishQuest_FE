import { SubscriptionPlan } from './user.model';

export interface Subscription {
    id: string;
    userId: string;
    plan: SubscriptionPlan;
    planName: string;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string;
    isActive: boolean;
    autoRenew: boolean;
    canceledAt?: string | null;
}

export enum SubscriptionStatus {
    Active = 'Active',
    Expired = 'Expired',
    Canceled = 'Canceled',
    PendingPayment = 'PendingPayment',
}

export interface ChangePlanRequest {
    newPlan: SubscriptionPlan;
}

export interface CancelSubscriptionRequest {
    reason: string;
}

export interface CreatePaymentRequest {
    plan: SubscriptionPlan;
}

export interface CreatePaymentResponse {
    success: boolean;
    paymentUrl: string;
}

export interface PaymentResult {
    success: boolean;
    message: string;
    paymentId?: string;
    transactionId?: string;
    planName?: string;
}


export const SUBSCRIPTION_FEATURES = {
    [SubscriptionPlan.Free]: {
        name: 'Free',
        price: 0,
        features: ['Basic lessons only', 'Limited hearts (5)', 'No streak freeze'],
    },
    [SubscriptionPlan.Support]: {
        name: 'Support',
        price: 99000,
        duration: 'Lifetime',
        features: [
            'All lessons',
            'Email support',
            'Limited hearts (5)',
            'No streak freeze',
        ],
    },
    [SubscriptionPlan.Premium]: {
        name: 'Premium',
        price: 149000,
        duration: 'Monthly',
        features: [
            'All lessons',
            'AI Tutor',
            'Certificates',
            'Offline access',
            'Extra heart (6 total)',
            'Streak freeze protection',
            'Priority support',
        ],
    },
};
