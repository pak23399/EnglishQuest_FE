import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';
import {
    ChangePlanRequest,
    CancelSubscriptionRequest,
    CreatePaymentRequest,
} from '@/models/subscription.model';

// Query keys
export const subscriptionKeys = {
    all: ['subscription'] as const,
    active: () => [...subscriptionKeys.all, 'active'] as const,
};

/**
 * Hook to get active subscription
 */
export function useActiveSubscription() {
    return useQuery({
        queryKey: subscriptionKeys.active(),
        queryFn: subscriptionService.getActiveSubscription,
        staleTime: 300000, // 5 minutes
    });
}

/**
 * Hook to change subscription plan
 */
export function useChangePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ChangePlanRequest) => subscriptionService.changePlan(data),
        onSuccess: (data) => {
            // Update active subscription cache
            queryClient.setQueryData(subscriptionKeys.active(), data);
            // Invalidate access control queries as features may have changed
            queryClient.invalidateQueries({ queryKey: ['content', 'access'] });
        },
    });
}

/**
 * Hook to cancel subscription
 */
export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CancelSubscriptionRequest) =>
            subscriptionService.cancelSubscription(data),
        onSuccess: (data) => {
            queryClient.setQueryData(subscriptionKeys.active(), data);
        },
    });
}

/**
 * Hook to create payment
 */
export function useCreatePayment() {
    return useMutation({
        mutationFn: (data: CreatePaymentRequest) => subscriptionService.createPayment(data),
        onSuccess: (data) => {
            // Redirect to payment URL
            if (data.success && data.paymentUrl) {
                window.location.href = data.paymentUrl;
            }
        },
    });
}

/**
 * Hook to handle payment return callback
 */
export function usePaymentReturn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (searchParams: URLSearchParams) =>
            subscriptionService.handlePaymentReturn(searchParams),
        onSuccess: () => {
            // Invalidate subscription query to refresh subscription status
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
        },
    });
}
