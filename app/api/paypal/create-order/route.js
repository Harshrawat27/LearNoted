// app/api/paypal/create-order/route.js
import { NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

export async function POST(req) {
  try {
    // Ensure request has a valid JSON body
    const bodyText = await req.text();
    const requestData = bodyText ? JSON.parse(bodyText) : {};

    // Set amount to $5.00 USD by default
    const amount = requestData.amount || '5.00';

    // 1. Get an access token from PayPal
    const authResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      throw new Error('Failed to fetch PayPal access token');
    }

    const authData = await authResponse.json();
    const access_token = authData.access_token;

    if (!access_token) {
      return NextResponse.json(
        { error: 'Failed to retrieve PayPal token' },
        { status: 500 }
      );
    }

    // 2. Create an order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount, // Use default $5.00 if no amount provided
            },
          },
        ],
      }),
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const orderData = await orderResponse.json();

    if (orderData.id) {
      return NextResponse.json({ orderID: orderData.id }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Failed to create PayPal order' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
