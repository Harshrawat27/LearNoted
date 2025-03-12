// Filename: app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/authOptions';
import dbConnect from '../lib/dbConnect';
import { User } from '@/models/User';
import ProfilePageClient from './ProfilePageClient';
import { Suspense } from 'react';
import ProfileLoading from './loading';

export default async function ProfilePage() {
  // 1. Check session (server-side)
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/api/auth/signin');
  }

  // 2. Connect to DB
  await dbConnect();

  // 3. Find the user in DB
  const userDoc = await User.findOne({ email: session.user?.email });
  if (!userDoc) {
    throw new Error('User not found in database');
  }

  // 4. Render client component with user data
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfilePageClient user={JSON.parse(JSON.stringify(userDoc))} />
    </Suspense>
  );
}
