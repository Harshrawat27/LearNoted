import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions'; // Adjust path
import dbConnect from '../../lib/dbConnect'; // Adjust path
import Highlight from '@/models/Highlight'; // Adjust path
import HighlightsPageClient from './HighlightsPageClient';

export default async function HighlightsPage() {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/api/auth/signin');
  }

  // Connect to the database
  await dbConnect();

  const userEmail = session.user?.email;
  if (!userEmail) {
    throw new Error('User email not found in session');
  }

  // Fetch initial highlights (first 20)
  const initialHighlights = await Highlight.find({ userEmail })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const totalHighlights = await Highlight.countDocuments({ userEmail });

  return (
    <HighlightsPageClient
      initialHighlights={JSON.parse(JSON.stringify(initialHighlights))}
      totalCount={totalHighlights}
    />
  );
}
