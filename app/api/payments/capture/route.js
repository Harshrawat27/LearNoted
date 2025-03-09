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

  try {
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('PayPal token error:', errorData);
      throw new Error(
        `Failed to get PayPal token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw error;
  }
}

// Function to verify the order
async function verifyPayPalOrder(orderID, accessToken) {
  try {
    const response = await fetch(`${base}/v2/checkout/orders/${orderID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('PayPal order verification error:', errorData);
      throw new Error(
        `Failed to verify order: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying PayPal order:', error);
    throw error;
  }
}

// Function to capture the order (complete the payment)
async function capturePayPalOrder(orderID, accessToken) {
  try {
    const response = await fetch(
      `${base}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('PayPal capture error:', errorData);
      throw new Error(
        `Failed to capture payment: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    throw error;
  }
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

    const body = await request.json();
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log(`Processing payment for order: ${orderID}`);

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    console.log('Got PayPal access token');

    // Verify the order first
    const orderDetails = await verifyPayPalOrder(orderID, accessToken);
    console.log('Order verified:', orderDetails.status);

    // If order is created or approved, capture the payment
    if (
      orderDetails.status === 'CREATED' ||
      orderDetails.status === 'APPROVED'
    ) {
      const captureResult = await capturePayPalOrder(orderID, accessToken);
      console.log('Payment captured:', captureResult.status);

      if (captureResult.status === 'COMPLETED') {
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
        console.log(`User ${session.user.email} upgraded to paid plan`);

        return NextResponse.json({ success: true });
      }
    }

    // If we get here, the payment wasn't successful
    return NextResponse.json(
      {
        success: false,
        error: 'Payment verification failed',
        orderStatus: orderDetails.status,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process payment',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
