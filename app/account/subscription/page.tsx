import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/authOptions';
import { User } from '@/models/User';
import dbConnect from '../../lib/dbConnect';
import SubscriptionClient from './client';

// This is a Server Component that fetches data
export default async function SubscriptionPage() {
  // Get the session
  const session = await getServerSession(authOptions);

  // Redirect if not logged in
  if (!session || !session.user?.email) {
    redirect('/api/auth/signin');
  }

  // Connect to the database and get user data
  await dbConnect();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    throw new Error('User not found');
  }

  // Prepare the data to pass to the client component
  const userData = {
    subscriptionPlan: user.subscriptionPlan,
    paypalSubscriptionId: user.paypalSubscriptionId || null,
    paypalSubscriptionStatus: user.paypalSubscriptionStatus || null,
    wordSearchCount: user.wordSearchCount,
  };

  // Render the client component with the user data
  return <SubscriptionClient userData={userData} />;
}
