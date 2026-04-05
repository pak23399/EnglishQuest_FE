import {
  CancelSubscriptionRequest,
  ChangePlanRequest,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentResult,
  Subscription,
} from '@/models/subscription.model';
import apiClient from '@/lib/api-client';


export const subscriptionService = {
  /**
   * Get user's current active subscription
   */
  async getActiveSubscription(): Promise<Subscription | null> {
    const response = await apiClient.get('/subscription/active');
    return response.data;
  },

  /**
   * Change subscription plan
   */
  async changePlan(data: ChangePlanRequest): Promise<Subscription> {
    const response = await apiClient.post('/subscription/change-plan', data);
    return response.data;
  },

  /**
   * Cancel active subscription
   */
  async cancelSubscription(
    data: CancelSubscriptionRequest,
  ): Promise<Subscription> {
    const response = await apiClient.post('/subscription/cancel', data);
    return response.data;
  },

  /**
   * Create a VNPAY payment URL for subscription purchase
   */
  async createPayment(
    data: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    const response = await apiClient.post(`/payment/create?plan=${data.plan}`);
    return response.data;
  },

  /**
   * Handle VNPAY payment return callback
   */
  async handlePaymentReturn(searchParams: URLSearchParams): Promise<PaymentResult> {
    const queryString = searchParams.toString();
    const response = await apiClient.get(`/payment/vnpay-return?${queryString}`);
    return response.data;
  },
};
