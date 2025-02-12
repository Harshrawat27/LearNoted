import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/authOptions'; // Adjust this path as needed
import dbConnect from '../../lib/dbConnect';
import { Search } from '../../../models/Search';
import { User } from '../../../models/User';
import mongoose from 'mongoose';
import ClientSearchDashboard from './ClientSearchDashboard';

export default async function SearchDashboardPage() {
  // Get the session on the server side using NextAuth’s server helper.
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/api/auth/signin');
  }

  // Connect to the database.
  await dbConnect();

  // Find the user by email from the session.
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    notFound();
  }

  // Fetch the search history for this user.
  const searchHistoryDocs = await Search.find({ user: user._id })
    .sort({ createdAt: -1 })
    .lean();
  const searchHistory = searchHistoryDocs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt.toString(),
    updatedAt: doc.updatedAt.toString(),
  }));

  // Use the current time.
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Aggregate usage data for the current month.
  const usageDataDocs = await Search.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(user._id),
        createdAt: { $gte: startOfMonth },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const usageData = usageDataDocs.map((doc) => ({
    _id: doc._id,
    count: doc.count,
  }));

  // Pass the data to the client component.
  return (
    <ClientSearchDashboard
      searchHistory={searchHistory}
      usageData={usageData}
      now={now.toISOString()}
    />
  );
}
