// app/dashboard/profile/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import dbConnect from '../../lib/dbConnect';
import { User } from '@/models/User';
import ProfilePageClient from './ProfilePageClient';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/api/auth/signin');
  }

  await dbConnect();
  const userDoc = await User.findOne({ email: session.user?.email });
  if (!userDoc) {
    throw new Error('User not found in database');
  }

  return <ProfilePageClient user={JSON.parse(JSON.stringify(userDoc))} />;
}
