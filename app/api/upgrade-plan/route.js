// app/api/upgrade-plan/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import dbConnect from '../../lib/dbConnect';
import { User } from '../../../models/User';

export async function POST(request) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);

    // If no session, return unauthorized
    if (!session || !session.user || !session.user.email) {
      console.log('Unauthorized access attempt to upgrade-plan API');
      return NextResponse.json(
        { message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { paymentId, paymentStatus } = body;

    console.log(`Processing payment: ${paymentId}, Status: ${paymentStatus}`);

    // Validate payment status
    if (paymentStatus !== 'COMPLETED') {
      return NextResponse.json(
        { message: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Find the user by email
    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log(`User not found: ${userEmail}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log(`Upgrading user: ${userEmail} to paid plan`);

    // Update user subscription to 'paid'
    user.subscriptionPlan = 'paid';

    // Reset word search count
    user.wordSearchCount = 0;

    // Save the updated user
    await user.save();

    console.log(`User successfully upgraded: ${userEmail}`);

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
      { message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
