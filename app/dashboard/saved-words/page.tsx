// app/dashboard/saved-words/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import dbConnect from '../../lib/dbConnect';
import { User } from '@/models/User';
import SavedWordsPageClient from './SavedWordsPageClient';

export default async function SavedWordsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/api/auth/signin');
  }

  await dbConnect();
  const userDoc = await User.findOne({ email: session.user?.email });
  if (!userDoc) {
    throw new Error('User not found in database');
  }

  return <SavedWordsPageClient userId={userDoc._id.toString()} />;
}
