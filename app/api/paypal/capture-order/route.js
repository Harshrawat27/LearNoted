// app/api/paypal/capture-order/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { User } from '../../../../models/User';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

export async function POST(req) {
  try {
    const bodyText = await req.text();
    const requestData = bodyText ? JSON.parse(bodyText) : {};

    const { orderID, userId } = requestData; // Extract userId from request

    if (!orderID || !userId) {
      return NextResponse.json(
        { error: 'Order ID and User ID are required' },
        { status: 400 }
      );
    }

    // Get PayPal access token
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

    // Capture payment for the order
    const captureResponse = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!captureResponse.ok) {
      throw new Error('Failed to capture PayPal order');
    }

    const captureData = await captureResponse.json();

    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Update the user's subscription plan
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { subscriptionPlan: 'paid' }, // Change this field as per your schema
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, captureData, updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error capturing order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
