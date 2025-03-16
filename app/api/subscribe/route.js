// app/api/subscribe/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subscriber from '@/models/Subscriber';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Parse the request body
    const body = await request.json();

    // Check if email is provided
    if (!body.email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email: body.email });
    if (existingSubscriber) {
      // If subscriber exists but is inactive, reactivate
      if (!existingSubscriber.active) {
        existingSubscriber.active = true;
        existingSubscriber.source = body.source || existingSubscriber.source;
        existingSubscriber.subscriptionDate = new Date();
        await existingSubscriber.save();

        return NextResponse.json(
          { success: true, message: 'Subscription reactivated' },
          { status: 200 }
        );
      }

      // If already subscribed
      return NextResponse.json(
        { success: true, message: 'Already subscribed' },
        { status: 200 }
      );
    }

    // Create new subscriber
    const subscriber = new Subscriber({
      email: body.email,
      source: body.source || 'home page form',
      subscriptionDate: body.subscriptionDate || new Date(),
    });

    // Save to database
    await subscriber.save();

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Successfully subscribed' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscription error:', error);

    // Handle duplicate key error (if email uniqueness constraint is violated)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
