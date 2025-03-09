import { NextResponse } from 'next/server';
import { User } from '../../../../models/User';
import dbConnect from '../../../lib/dbConnect';
import { verifyPayPalWebhook } from '@/app/lib/paypal';
import {
  PayPalSubscriptionDetails,
  PayPalWebhookEvent,
} from '../../../types/paypal-types';

/*
 * This webhook handler processes PayPal subscription events
 * You'll need to set up this webhook in your PayPal developer dashboard
 * https://developer.paypal.com/docs/api-basics/notifications/webhooks/
 */
export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json(
      { message: 'Method not allowed' },
      { status: 405 }
    );
  }

  // Get the PayPal webhook event
  const event: PayPalWebhookEvent = await request.json();
  const webhookId = request.headers.get('paypal-transmission-id');
  const authAlgo = request.headers.get('paypal-auth-algo');
  const certUrl = request.headers.get('paypal-cert-url');
  const transmissionSig = request.headers.get('paypal-transmission-sig');
  const transmissionTime = request.headers.get('paypal-transmission-time');

  // Validate required headers
  if (
    !webhookId ||
    !authAlgo ||
    !certUrl ||
    !transmissionSig ||
    !transmissionTime
  ) {
    return NextResponse.json(
      { message: 'Missing required PayPal headers' },
      { status: 400 }
    );
  }

  try {
    // Verify the webhook signature (implement this in your PayPal utility)
    const isVerified = await verifyPayPalWebhook({
      transmissionId: webhookId,
      transmissionTime: transmissionTime,
      certUrl: certUrl,
      authAlgo: authAlgo,
      transmissionSig: transmissionSig,
      body: event,
      webhookId: process.env.PAYPAL_WEBHOOK_ID as string,
    });

    if (!isVerified) {
      return NextResponse.json(
        { message: 'Invalid webhook signature' },
        { status: 400 }
      );
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

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionActivated(
  resource: PayPalSubscriptionDetails
) {
  const subscriptionId = resource.id;

  // Look for a user with this subscription ID
  const user = await User.findOne({ paypalSubscriptionId: subscriptionId });

  if (user) {
    user.subscriptionPlan = 'paid';
    user.paypalSubscriptionStatus = 'active';
    await user.save();
  } else {
    // If no user is found with this subscription ID, try to find them by email
    const subscriber = resource.subscriber?.email_address;
    if (subscriber) {
      const userByEmail = await User.findOne({ email: subscriber });
      if (userByEmail) {
        userByEmail.paypalSubscriptionId = subscriptionId;
        userByEmail.subscriptionPlan = 'paid';
        userByEmail.paypalSubscriptionStatus = 'active';
        await userByEmail.save();
      }
    }
  }
}

async function handleSubscriptionCancelled(
  resource: PayPalSubscriptionDetails
) {
  const subscriptionId = resource.id;
  const user = await User.findOne({ paypalSubscriptionId: subscriptionId });

  if (user) {
    user.subscriptionPlan = 'free';
    user.paypalSubscriptionStatus = 'cancelled';
    await user.save();
  }
}

async function handleSubscriptionSuspended(
  resource: PayPalSubscriptionDetails
) {
  const subscriptionId = resource.id;
  const user = await User.findOne({ paypalSubscriptionId: subscriptionId });

  if (user) {
    user.subscriptionPlan = 'free';
    user.paypalSubscriptionStatus = 'suspended';
    await user.save();
  }
}

async function handlePaymentFailed(resource: PayPalSubscriptionDetails) {
  const subscriptionId = resource.id;
  const user = await User.findOne({ paypalSubscriptionId: subscriptionId });

  if (user) {
    // You might want to keep the plan as 'paid' but mark it as having payment issues
    // This depends on your business logic
    user.paypalSubscriptionStatus = 'payment_failed';
    await user.save();
  }
}
