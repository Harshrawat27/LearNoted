// app/api/upgrade-plan/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions'; // Adjust path as necessary
import { User } from '../../../models/User';
import dbConnect from '../../lib/dbConnect';

export async function POST(request) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    //  const { paymentId, paymentStatus } = body;
    const { paymentStatus } = body;

    // Validate payment status
    if (paymentStatus !== 'COMPLETED') {
      return NextResponse.json(
        { message: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update user subscription to 'paid'
    user.subscriptionPlan = 'paid';

    // Reset word search count
    user.wordSearchCount = 0;

    // Save the updated user
    await user.save();

    return NextResponse.json({
      message: 'Subscription successfully updated',
      user: {
        email: user.email,
        name: user.name,
        subscriptionPlan: user.subscriptionPlan,
      },
    });
  } catch (error) {
    console.error('Error upgrading plan:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
