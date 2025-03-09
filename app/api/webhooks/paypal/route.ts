import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../../models/User';
import dbConnect from '../../../lib/dbConnect';
import { verifyPayPalWebhook } from '../../../lib/paypal';

/*
 * This webhook handler processes PayPal subscription events
 * You'll need to set up this webhook in your PayPal developer dashboard
 * https://developer.paypal.com/docs/api-basics/notifications/webhooks/
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get the PayPal webhook event
  const event = req.body;
  const webhookId = req.headers['paypal-transmission-id'] as string;
  const authAlgo = req.headers['paypal-auth-algo'] as string;
  const certUrl = req.headers['paypal-cert-url'] as string;
  const transmissionSig = req.headers['paypal-transmission-sig'] as string;
  const transmissionTime = req.headers['paypal-transmission-time'] as string;

  try {
    // Verify the webhook signature (implement this in your PayPal utility)
    const isVerified = await verifyPayPalWebhook({
      transmissionId: webhookId,
      transmissionTime: transmissionTime,
      certUrl: certUrl,
      authAlgo: authAlgo,
      transmissionSig: transmissionSig,
      body: req.body,
      webhookId: process.env.PAYPAL_WEBHOOK_ID as string,
    });

    if (!isVerified) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    // Connect to the database
    await dbConnect();

    // Handle different event types
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        // Subscription was created - we handle this in the frontend
        break;

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        // Subscription was activated
        await handleSubscriptionActivated(event.resource);
        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        // Subscription was cancelled or expired
        await handleSubscriptionCancelled(event.resource);
        break;

      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        // Subscription was suspended (payment failed)
        await handleSubscriptionSuspended(event.resource);
        break;

      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
        // Payment failed
        await handlePaymentFailed(event.resource);
        break;

      default:
        // Unhandled event type
        console.log(`Unhandled PayPal event: ${event.event_type}`);
    }

    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleSubscriptionActivated(resource: any) {
  const subscriptionId = resource.id;
  const user = await User.findOne({ paypalSubscriptionId: subscriptionId });

  if (user) {
    user.subscriptionPlan = 'paid';
    user.paypalSubscriptionStatus = 'active';
    await user.save();
  }
}

async function handleSubscriptionCancelled(resource: any) {
  const subscriptionId = resource.id;
  const user = await User.findOne({ paypalSubscriptionId: subscriptionId });

  if (user) {
    user.subscriptionPlan = 'free';
    user.paypalSubscriptionStatus = 'cancelled';
    await user.save();
  }
}

async function handleSubscriptionSuspended(resource: any) {
  const subscriptionId = resource.id;
  const user = await User.findOne({ paypalSubscriptionId: subscriptionId });

  if (user) {
    user.subscriptionPlan = 'free';
    user.paypalSubscriptionStatus = 'suspended';
    await user.save();
  }
}

async function handlePaymentFailed(resource: any) {
  const subscriptionId = resource.id;
  const user = await User.findOne({ paypalSubscriptionId: subscriptionId });

  if (user) {
    // You might want to keep the plan as 'paid' but mark it as having payment issues
    // This depends on your business logic
    user.paypalSubscriptionStatus = 'payment_failed';
    await user.save();
  }
}
