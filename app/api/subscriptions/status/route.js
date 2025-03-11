import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/authOptions';
import dbConnect from '../../../lib/dbConnect';
import { User } from '../../../../models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if the monthly reset should happen
    await user.canSearchWord(); // This will update the counter if needed

    return NextResponse.json({
      plan: user.subscriptionPlan,
      wordSearchCount: user.wordSearchCount,
      resetDate: user.monthlyResetDate,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
