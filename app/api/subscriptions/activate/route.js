import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/lib/authOptions';
import dbConnect from '@/app/lib/dbConnect';
import { User } from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { message: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify the subscription with PayPal API
    const isSubscriptionValid = await verifyPayPalSubscription(subscriptionId);

    if (!isSubscriptionValid) {
      return NextResponse.json(
        { message: 'Invalid subscription' },
        { status: 400 }
      );
    }

    // Update user subscription plan
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        subscriptionPlan: 'paid',
        paypalSubscriptionId: subscriptionId, // Store for later use
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Subscription activated successfully',
      plan: updatedUser.subscriptionPlan,
    });
  } catch (error) {
    console.error('Error activating subscription:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function verifyPayPalSubscription(subscriptionId) {
  try {
    // Get PayPal access token
    const tokenResponse = await fetch(
      `${
        process.env.PAYPAL_MODE === 'sandbox'
          ? 'https://api-m.sandbox.paypal.com'
          : 'https://api-m.paypal.com'
      }/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
        body: 'grant_type=client_credentials',
      }
    );

    const { access_token } = await tokenResponse.json();

    if (!access_token) {
      console.error('Failed to get PayPal access token');
      return false;
    }

    // Verify subscription
    const subscriptionResponse = await fetch(
      `${
        process.env.PAYPAL_MODE === 'sandbox'
          ? 'https://api-m.sandbox.paypal.com'
          : 'https://api-m.paypal.com'
      }/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const subscription = await subscriptionResponse.json();

    // Check if subscription is active
    return subscription && subscription.status === 'ACTIVE';
  } catch (error) {
    console.error('Error verifying PayPal subscription:', error);
    return false;
  }
}
