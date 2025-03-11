// app/api/payments/capture/route.js
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { User } from '../../../../models/User';
import { authOptions } from '../../../lib/authOptions';

// PayPal configuration
// NOTE: Make sure these environment variables are properly set in your .env.local file
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
// Default to sandbox for safety unless explicitly set to 'live'
const PAYPAL_MODE = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';
const base =
  PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

// Function to get access token
async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    console.error('PayPal credentials are not configured');
    throw new Error('PayPal credentials are not configured');
  }

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

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal token error:', data);
      throw new Error(
        `Failed to get PayPal token: ${response.status} ${
          data.error_description || response.statusText
        }`
      );
    }

    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw error;
  }
}

// Function to verify the order
async function verifyPayPalOrder(orderID, accessToken) {
  try {
    console.log(`Verifying order ${orderID} with PayPal...`);

    const response = await fetch(`${base}/v2/checkout/orders/${orderID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal order verification error:', data);
      throw new Error(
        `Failed to verify order: ${response.status} ${
          data.message || response.statusText
        }`
      );
    }

    console.log('Order verification response:', data.status);
    return data;
  } catch (error) {
    console.error('Error verifying PayPal order:', error);
    throw error;
  }
}

// Function to capture the order (complete the payment)
async function capturePayPalOrder(orderID, accessToken) {
  try {
    console.log(`Capturing payment for order ${orderID}...`);

    const response = await fetch(
      `${base}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal capture error:', data);
      throw new Error(
        `Failed to capture payment: ${response.status} ${
          data.message || response.statusText
        }`
      );
    }

    console.log('Payment capture successful, status:', data.status);
    return data;
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log(
      `Processing payment for order: ${orderID} for user: ${session.user.email}`
    );
    console.log(`Using PayPal in ${PAYPAL_MODE} mode`);

    // 3. Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    console.log('Successfully obtained PayPal access token');

    // 4. Verify the order
    const orderDetails = await verifyPayPalOrder(orderID, accessToken);
    console.log(`Order verification status: ${orderDetails.status}`);

    // 5. Capture payment if order status is appropriate
    if (
      orderDetails.status === 'CREATED' ||
      orderDetails.status === 'APPROVED'
    ) {
      const captureResult = await capturePayPalOrder(orderID, accessToken);
      console.log(`Payment capture result: ${captureResult.status}`);

      // 6. Update user plan if payment was successful
      if (captureResult.status === 'COMPLETED') {
        try {
          await dbConnect();
          const user = await User.findOne({ email: session.user.email });

          if (!user) {
            console.error(`User not found: ${session.user.email}`);
            return NextResponse.json(
              { success: false, error: 'User not found' },
              { status: 404 }
            );
          }

          user.subscriptionPlan = 'paid';
          await user.save();
          console.log(
            `User ${session.user.email} upgraded to paid plan successfully`
          );

          return NextResponse.json({
            success: true,
            message: 'Payment processed successfully and plan upgraded',
          });
        } catch (dbError) {
          console.error('Database error updating user plan:', dbError);
          // Still return success as payment was processed, but log the DB error
          return NextResponse.json({
            success: true,
            message:
              'Payment processed but there was an issue updating your account. Please contact support.',
          });
        }
      } else {
        console.error(`Payment not completed. Status: ${captureResult.status}`);
        return NextResponse.json(
          {
            success: false,
            error: 'Payment was not completed',
            orderStatus: captureResult.status,
          },
          { status: 400 }
        );
      }
    } else {
      console.error(
        `Order in invalid state for capture: ${orderDetails.status}`
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Order is not in a state that can be captured',
          orderStatus: orderDetails.status,
        },
        { status: 400 }
      );
    }
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
