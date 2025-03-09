import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';
import { User } from '../../../../models/User';
import dbConnect from '../../../lib/dbConnect';

export async function POST(request: Request) {
  try {
    // Extract the subscription ID from the request body
    const body = await request.json();
    const { subscriptionId } = body;

    console.log('Received subscription activation request:', {
      subscriptionId,
    });

    if (!subscriptionId) {
      return NextResponse.json(
        { message: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Get the user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      console.log('No authenticated user session found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log('User not found in database:', session.user.email);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('Found user:', {
      email: user.email,
      currentPlan: user.subscriptionPlan,
    });

    // Store the PayPal subscription ID and update the subscription plan
    user.paypalSubscriptionId = subscriptionId;
    user.subscriptionPlan = 'paid';
    user.paypalSubscriptionStatus = 'active';
    await user.save();

    console.log("User subscription updated successfully to 'paid'");

    return NextResponse.json(
      { message: 'Subscription activated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error activating subscription:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
