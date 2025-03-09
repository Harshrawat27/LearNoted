import {
  PayPalSubscriptionDetails,
  PayPalWebhookEvent,
} from '../types/paypal-types';

// PayPal API URLs
const PAYPAL_API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// Authentication Response Type
interface PayPalAuthResponse {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

// Webhook Verification Response
interface PayPalWebhookVerificationResponse {
  verification_status: 'SUCCESS' | 'FAILURE';
}

// Get access token from PayPal
async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal client credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to get PayPal access token: ${JSON.stringify(errorData)}`
    );
  }

  const data = (await response.json()) as PayPalAuthResponse;
  return data.access_token;
}

// Cancel a PayPal subscription
export async function cancelPayPalSubscription(
  subscriptionId: string
): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          reason: 'Cancelled by customer',
        }),
      }
    );

    return response.status === 204;
  } catch (error) {
    console.error('Error cancelling PayPal subscription:', error);
    return false;
  }
}

// Get subscription details
export async function getSubscriptionDetails(
  subscriptionId: string
): Promise<PayPalSubscriptionDetails> {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get subscription details: ${response.statusText}`
      );
    }

    const data = (await response.json()) as PayPalSubscriptionDetails;
    return data;
  } catch (error) {
    console.error('Error getting subscription details:', error);
    throw error;
  }
}

// Verify PayPal webhook signature
interface WebhookVerificationParams {
  transmissionId: string;
  transmissionTime: string;
  certUrl: string;
  authAlgo: string;
  transmissionSig: string;
  body: PayPalWebhookEvent;
  webhookId: string;
}

export async function verifyPayPalWebhook(
  params: WebhookVerificationParams
): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          transmission_id: params.transmissionId,
          transmission_time: params.transmissionTime,
          cert_url: params.certUrl,
          auth_algo: params.authAlgo,
          transmission_sig: params.transmissionSig,
          webhook_event: params.body,
          webhook_id: params.webhookId,
        }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as PayPalWebhookVerificationResponse;
    return data.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Error verifying PayPal webhook:', error);
    return false;
  }
}
