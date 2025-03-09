// app/api/user/plan/route.js
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { User } from '../../../../models/User';
import { authOptions } from '../../../lib/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      plan: user.subscriptionPlan,
      searchCount: user.wordSearchCount,
      maxSearches: user.subscriptionPlan === 'free' ? 100 : 'unlimited',
    });
  } catch (error) {
    console.error('Error fetching user plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user plan' },
      { status: 500 }
    );
  }
}
