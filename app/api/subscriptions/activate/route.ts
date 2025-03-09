import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';
import { User } from '../../../../models/User';
import dbConnect from '../../../lib/dbConnect';

export async function POST(request: Request) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Extract the subscription ID from the request body
    const body = await request.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { message: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Store the PayPal subscription ID and update the subscription plan
    user.paypalSubscriptionId = subscriptionId;
    user.subscriptionPlan = 'paid';
    user.paypalSubscriptionStatus = 'active';
    await user.save();

    return NextResponse.json(
      { message: 'Subscription activated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error activating subscription:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
