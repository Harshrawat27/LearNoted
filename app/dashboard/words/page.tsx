// Filename: app/dashboard/words/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import dbConnect from '../../lib/dbConnect';
import { User } from '@/models/User';
import { Search } from '@/models/Search';
import WordsPageClient from './WordsPageClient';

export default async function WordsPage() {
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

  // 4. Initially load only the first page of searches (20 items)
  const initialSearches = await Search.find({ user: userDoc._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // 5. Get total count for pagination
  const totalSearches = await Search.countDocuments({ user: userDoc._id });

  // 6. Render client component with initial data
  return (
    <WordsPageClient
      initialSearches={JSON.parse(JSON.stringify(initialSearches))}
      totalCount={totalSearches}
      userId={userDoc._id.toString()}
    />
  );
}
