// app/dashboard/useruser/page.tsx
import { redirect, notFound } from 'next/navigation';
import dbConnect from '../../lib/dbConnect';
import { User } from '../../../models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/authOptions'; // Adjust this path as needed

export default async function UserDashboardPage() {
  // Get the session on the server side
  const session = await getServerSession(authOptions);
  if (!session) {
    // If there is no session, redirect to sign-in page
    redirect('/api/auth/signin');
  }

  // Connect to the database and fetch the user data
  await dbConnect();
  const userData = await User.findOne({ email: session.user.email }).lean();
  if (!userData) {
    // If no user is found, trigger a 404 page
    notFound();
  }

  // Convert ObjectId and Date fields to strings for serialization
  userData._id = userData._id.toString();
  userData.createdAt = userData.createdAt
    ? userData.createdAt.toString()
    : null;
  userData.updatedAt = userData.updatedAt
    ? userData.updatedAt.toString()
    : null;
  userData.monthlyResetDate = userData.monthlyResetDate
    ? userData.monthlyResetDate.toString()
    : null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>User Dashboard</h1>
      <p>
        <strong>Name:</strong> {userData.name || 'N/A'}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Subscription Plan:</strong> {userData.subscriptionPlan}
      </p>
      <p>
        <strong>Word Search Count:</strong> {userData.wordSearchCount}
      </p>
      <p>
        <strong>Monthly Reset Date:</strong>{' '}
        {new Date(userData.monthlyResetDate).toLocaleDateString()}
      </p>
    </div>
  );
}
