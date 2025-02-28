// Filename: app/dashboard/usage/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import dbConnect from '../../lib/dbConnect';
import { User } from '@/models/User';
import { Search } from '@/models/Search';
import UsagePageClient from './UsagePageClient';

export default async function UsagePage() {
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

  // 4. Build usage data by date
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

  // 5. Get word categories
  const categoryData = await Search.aggregate([
    { $match: { user: userDoc._id } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const wordCategories = categoryData.map((item) => ({
    name: item._id || 'Uncategorized',
    value: item.count,
  }));

  // 6. Render client component with the data
  return (
    <UsagePageClient
      usageData={usageData}
      wordCategories={wordCategories}
      totalSearches={userDoc.wordSearchCount}
    />
  );
}
