import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';
import { User } from '../../../../models/User';
import dbConnect from '../../../lib/dbConnect';

export async function GET(request: Request) {
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

    // Return user data (excluding sensitive information)
    return NextResponse.json({
      email: user.email,
      name: user.name,
      image: user.image,
      subscriptionPlan: user.subscriptionPlan,
      wordSearchCount: user.wordSearchCount,
      monthlyResetDate: user.monthlyResetDate,
      hasActiveSubscription:
        user.subscriptionPlan === 'paid' &&
        user.paypalSubscriptionStatus === 'active',
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
