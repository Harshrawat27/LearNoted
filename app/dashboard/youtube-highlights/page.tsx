import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions'; // Adjust path as needed
import dbConnect from '../../lib/dbConnect'; // Adjust path as needed
import { Video } from '../../../models/YoutubeHighlight';
import { User } from '@/models/User';
import YouTubeHighlightsPageClient from './YouTubeHighlightsPageClient';

export default async function YouTubeHighlightsPage() {
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
  const initialHighlights = await Video.find({ userId: userDoc._id.toString() })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // 5. Get total count for pagination
  const totalHighlights = await Video.countDocuments({
    userId: userDoc._id.toString(),
  });

  return (
    <YouTubeHighlightsPageClient
      initialHighlights={JSON.parse(JSON.stringify(initialHighlights))}
      totalCount={totalHighlights}
    />
  );
}
