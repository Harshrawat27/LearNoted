import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/authOptions';
import dbConnect from '../../../lib/dbConnect';
import { User } from '../../../../models/User';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if user has an active subscription
    if (user.subscriptionPlan !== 'paid') {
      return NextResponse.json(
        { message: 'No active subscription to cancel' },
        { status: 400 }
      );
    }

    // Cancel subscription in PayPal
    if (user.paypalSubscriptionId) {
      const cancelled = await cancelPayPalSubscription(
        user.paypalSubscriptionId
      );
      if (!cancelled) {
        return NextResponse.json(
          { message: 'Failed to cancel subscription with PayPal' },
          { status: 500 }
        );
      }
    }

    // Update user subscription plan back to free
    user.subscriptionPlan = 'free';
    user.paypalSubscriptionId = null;
    await user.save();

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      plan: user.subscriptionPlan,
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function cancelPayPalSubscription(subscriptionId) {
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

    // Cancel subscription
    const response = await fetch(
      `${
        process.env.PAYPAL_MODE === 'sandbox'
          ? 'https://api-m.sandbox.paypal.com'
          : 'https://api-m.paypal.com'
      }/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: 'Customer requested cancellation',
        }),
      }
    );

    return response.status === 204;
  } catch (error) {
    console.error('Error cancelling PayPal subscription:', error);
    return false;
  }
}
