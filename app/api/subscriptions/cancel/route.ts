import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';
import { User } from '../../../../models/User';
import dbConnect from '../../../lib/dbConnect';

// You'll need to create this utility with your PayPal credentials
import { cancelPayPalSubscription } from '../../../lib/paypal';

export async function POST(request: Request) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if the user has an active subscription
    if (!user.paypalSubscriptionId || user.subscriptionPlan !== 'paid') {
      return NextResponse.json(
        { message: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Cancel the subscription with PayPal
    const success = await cancelPayPalSubscription(user.paypalSubscriptionId);
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to cancel subscription with PayPal' },
        { status: 500 }
      );
    }

    // Update the user's subscription status
    user.subscriptionPlan = 'free';
    // Keep the subscription ID for reference but mark it as cancelled
    user.paypalSubscriptionStatus = 'cancelled';
    await user.save();

    return NextResponse.json(
      { message: 'Subscription cancelled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
