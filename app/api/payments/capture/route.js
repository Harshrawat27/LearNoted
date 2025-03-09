// app/api/payments/capture/route.js
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { User } from '../../../../models/User';
import { authOptions } from '../../../lib/authOptions';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const base =
  process.env.PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

// Function to get access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Function to verify the order
async function verifyPayPalOrder(orderID, accessToken) {
  const response = await fetch(`${base}/v2/checkout/orders/${orderID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Verify the payment
    const order = await verifyPayPalOrder(orderID, accessToken);

    // Check if payment is completed and the amount is correct
    if (
      order.status === 'COMPLETED' ||
      (order.status === 'APPROVED' &&
        order.purchase_units[0].amount.value === '5.00')
    ) {
      // Update user to paid plan
      await dbConnect();
      const user = await User.findOne({ email: session.user.email });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      user.subscriptionPlan = 'paid';
      await user.save();

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Payment verification failed',
        orderStatus: order.status,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error capturing payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to capture payment' },
      { status: 500 }
    );
  }
}
