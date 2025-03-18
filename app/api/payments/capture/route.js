// app/api/payments/capture/route.js
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { User } from '../../../../models/User';
import { authOptions } from '../../../lib/authOptions';

// PayPal configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';
const base =
  PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

// Debug function to safely log environment variables
function logEnvironmentSetup() {
  console.log('=== PayPal Environment Setup ===');
  console.log(`PAYPAL_MODE: ${PAYPAL_MODE}`);
  console.log(`PAYPAL_CLIENT_ID exists: ${Boolean(PAYPAL_CLIENT_ID)}`);
  console.log(`PAYPAL_CLIENT_SECRET exists: ${Boolean(PAYPAL_CLIENT_SECRET)}`);
  console.log(`Using API base URL: ${base}`);
  console.log('===============================');
}

// Function to get access token
async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error(
      'PayPal credentials missing: ' +
        (!PAYPAL_CLIENT_ID ? 'PAYPAL_CLIENT_ID ' : '') +
        (!PAYPAL_CLIENT_SECRET ? 'PAYPAL_CLIENT_SECRET' : '')
    );
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  try {
    console.log('Requesting PayPal access token...');
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    const textResponse = await response.text(); // Get raw response first
    let data;

    try {
      // Then try to parse as JSON
      data = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('Failed to parse PayPal response as JSON:', textResponse);
      throw new Error(
        `Invalid response from PayPal: ${textResponse} ${parseError}`
      );
    }

    if (!response.ok) {
      console.error('PayPal token error:', data);
      throw new Error(
        `Failed to get PayPal token: ${response.status} ${
          data.error_description || response.statusText
        }`
      );
    }

    if (!data.access_token) {
      console.error('Missing access_token in PayPal response:', data);
      throw new Error('PayPal did not return an access token');
    }

    console.log('Successfully obtained PayPal access token');
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

    const textResponse = await response.text();
    let data;

    try {
      data = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('Failed to parse PayPal verify response:', textResponse);
      throw new Error(
        `Invalid response from PayPal verify: ${textResponse} ${parseError}`
      );
    }

    if (!response.ok) {
      console.error('PayPal order verification error:', data);
      throw new Error(
        `Failed to verify order: ${response.status} ${
          data.message || response.statusText
        }`
      );
    }

    console.log('Order verified with status:', data.status);
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

    const textResponse = await response.text();
    let data;

    try {
      data = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('Failed to parse PayPal capture response:', textResponse);
      throw new Error(
        `Invalid response from PayPal capture: ${textResponse} ${parseError}`
      );
    }

    if (!response.ok) {
      console.error('PayPal capture error:', data);
      throw new Error(
        `Failed to capture payment: ${response.status} ${
          data.message || response.statusText
        }`
      );
    }

    console.log('Payment captured successfully with status:', data.status);
    return data;
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    throw error;
  }
}

export async function POST(request) {
  // Start by logging environment setup
  try {
    logEnvironmentSetup();
  } catch (error) {
    console.error('Error logging environment:', error);
    // Continue processing - this is just for debugging
  }

  try {
    // 1. Check authentication
    console.log('Checking user authentication...');
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('User not authenticated');
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.log(`User authenticated: ${session.user.email}`);

    // 2. Parse request body
    console.log('Parsing request body...');
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('Failed to parse request body:', jsonError);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { orderID } = body;

    if (!orderID) {
      console.log('No orderID provided in request');
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
    console.log('Getting PayPal access token...');
    let accessToken;
    try {
      accessToken = await getPayPalAccessToken();
    } catch (tokenError) {
      console.error('Failed to get PayPal access token:', tokenError);
      return NextResponse.json(
        {
          success: false,
          error: 'Payment service authentication failed',
          details: tokenError.message,
        },
        { status: 500 }
      );
    }

    // 4. Verify the order
    console.log('Verifying the order...');
    let orderDetails;
    try {
      orderDetails = await verifyPayPalOrder(orderID, accessToken);
    } catch (verifyError) {
      console.error('Failed to verify order:', verifyError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to verify payment order',
          details: verifyError.message,
        },
        { status: 400 }
      );
    }

    console.log(`Order verification status: ${orderDetails.status}`);

    // 5. Capture payment if order status is appropriate
    if (
      orderDetails.status === 'CREATED' ||
      orderDetails.status === 'APPROVED'
    ) {
      console.log('Order is in a valid state for capture');

      let captureResult;
      try {
        captureResult = await capturePayPalOrder(orderID, accessToken);
      } catch (captureError) {
        console.error('Failed to capture payment:', captureError);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to capture payment',
            details: captureError.message,
          },
          { status: 500 }
        );
      }

      console.log(`Payment capture result: ${captureResult.status}`);

      // 6. Update user plan if payment was successful
      if (captureResult.status === 'COMPLETED') {
        try {
          console.log('Connecting to database...');
          await dbConnect();

          console.log(`Finding user: ${session.user.email}...`);
          const user = await User.findOne({ email: session.user.email });

          if (!user) {
            console.error(`User not found: ${session.user.email}`);
            return NextResponse.json(
              { success: false, error: 'User not found' },
              { status: 404 }
            );
          }

          console.log('Updating user plan to paid...');
          user.subscriptionPlan = 'paid';

          // Get current date for record-keeping
          const currentDate = new Date();

          // Update dateOfPurchase only if it's not already set
          if (!user.dateOfPurchase) {
            console.log('Setting initial purchase date...');
            user.dateOfPurchase = currentDate;
          } else {
            console.log(
              'Purchase date already exists, keeping original date...'
            );
          }

          // Always update the renewal date
          console.log('Updating renewal date...');
          user.dateOfRenewal = currentDate;

          await user.save();
          console.log(
            `User ${session.user.email} upgraded to paid plan successfully`
          );
          console.log(`Purchase date: ${user.dateOfPurchase}`);
          console.log(`Renewal date: ${user.dateOfRenewal}`);

          return NextResponse.json({
            success: true,
            message: 'Payment processed successfully and plan upgraded',
            purchaseDate: user.dateOfPurchase,
            renewalDate: user.dateOfRenewal,
          });
        } catch (dbError) {
          console.error('Database error updating user plan:', dbError);
          // Still return success as payment was processed, but log the DB error
          return NextResponse.json({
            success: true,
            message:
              'Payment processed but there was an issue updating your account. Please contact support.',
            dbError: dbError.message,
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
    console.error('Unhandled error processing payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process payment',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
