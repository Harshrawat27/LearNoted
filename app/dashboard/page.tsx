// Filename: app/dashboard/page.tsx (or page.jsx)
// Description: Next.js Server Component that fetches user session, data from DB, and renders DashboardPageClient

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/authOptions';
import dbConnect from '../lib/dbConnect';
import { User } from '@/models/User';
import { Search } from '@/models/Search';
import DashboardPageClient from './DashboardPageClient';

export default async function DashboardPage() {
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

  // 4. Get user’s searches
  const searches = await Search.find({ user: userDoc._id })
    .sort({ createdAt: -1 })
    .lean();

  // 5. Build usage data for Recharts
  const usageByDate = await Search.aggregate([
    { $match: { user: userDoc._id } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  const usageData = usageByDate.map((item) => {
    const { year, month, day } = item._id;
    return {
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
        2,
        '0'
      )}`,
      count: item.count,
    };
  });

  // 6. Render a CLIENT component with the data as props
  return (
    <DashboardPageClient
      user={JSON.parse(JSON.stringify(userDoc))}
      searches={JSON.parse(JSON.stringify(searches))}
      usageData={usageData}
    />
  );
}
