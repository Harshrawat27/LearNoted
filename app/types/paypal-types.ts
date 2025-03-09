// PayPal API typings

export interface PayPalCreateActions {
  subscription: {
    create: (options: { plan_id: string }) => Promise<string>;
  };
}

export interface PayPalOnApproveData {
  subscriptionID: string;
  orderID?: string;
  payerID?: string;
  facilitatorAccessToken?: string;
}

export interface PayPalOnApproveActions {
  redirect: () => Promise<void>;
  restart: () => Promise<void>;
  subscription: {
    get: () => Promise<PayPalSubscriptionDetails>;
  };
}

// PayPal Webhook Event Types
export type PayPalEventType =
  | 'BILLING.SUBSCRIPTION.CREATED'
  | 'BILLING.SUBSCRIPTION.ACTIVATED'
  | 'BILLING.SUBSCRIPTION.UPDATED'
  | 'BILLING.SUBSCRIPTION.CANCELLED'
  | 'BILLING.SUBSCRIPTION.SUSPENDED'
  | 'BILLING.SUBSCRIPTION.EXPIRED'
  | 'BILLING.SUBSCRIPTION.PAYMENT.FAILED';

// PayPal Subscription Status
export type PayPalSubscriptionStatus =
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'CANCELLED'
  | 'EXPIRED';

// PayPal Subscription Resource
export interface PayPalSubscriptionDetails {
  id: string;
  status: PayPalSubscriptionStatus;
  status_update_time: string;
  create_time: string;
  plan_id: string;
  start_time: string;
  quantity: string;
  billing_info?: {
    outstanding_balance: {
      currency_code: string;
      value: string;
    };
    cycle_executions: Array<{
      tenure_type: string;
      sequence: number;
      cycles_completed: number;
      cycles_remaining: number;
      total_cycles: number;
    }>;
    last_payment?: {
      amount: {
        currency_code: string;
        value: string;
      };
      time: string;
    };
    next_billing_time?: string;
    failed_payments_count: number;
  };
  subscriber: {
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
    shipping_address?: {
      address: {
        address_line_1: string;
        address_line_2?: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: string;
      };
    };
  };
  custom_id?: string;
  plan?: {
    product_id: string;
    name: string;
    billing_cycles: Array<{
      pricing_scheme: {
        fixed_price: {
          value: string;
          currency_code: string;
        };
        version: number;
      };
      frequency: {
        interval_unit: string;
        interval_count: number;
      };
      tenure_type: string;
      sequence: number;
      total_cycles: number;
    }>;
    payment_preferences: {
      auto_bill_outstanding: boolean;
      setup_fee?: {
        value: string;
        currency_code: string;
      };
      setup_fee_failure_action: string;
      payment_failure_threshold: number;
    };
    taxes?: {
      percentage: string;
      inclusive: boolean;
    };
  };
}

// PayPal Webhook Event
export interface PayPalWebhookEvent {
  id: string;
  create_time: string;
  resource_type: string;
  event_type: PayPalEventType;
  summary: string;
  resource: PayPalSubscriptionDetails;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}
