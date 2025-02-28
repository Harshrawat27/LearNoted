// app/dashboard/profile/ProfilePageClient.tsx
'use client';

interface ProfilePageClientProps {
  user: {
    name: string;
    email: string;
    subscriptionPlan: string;
    wordSearchCount: number;
  };
}

export default function ProfilePageClient({ user }: ProfilePageClientProps) {
  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
        Your Profile
      </h2>
      <div className='space-y-2'>
        <p className='text-gray-700 dark:text-gray-300'>
          <strong className='text-gray-900 dark:text-gray-100'>Name:</strong>{' '}
          {user.name}
        </p>
        <p className='text-gray-700 dark:text-gray-300'>
          <strong className='text-gray-900 dark:text-gray-100'>Email:</strong>{' '}
          {user.email}
        </p>
        <p className='text-gray-700 dark:text-gray-300'>
          <strong className='text-gray-900 dark:text-gray-100'>
            Subscription:
          </strong>{' '}
          {user.subscriptionPlan}
        </p>
        <p className='text-gray-700 dark:text-gray-300'>
          <strong className='text-gray-900 dark:text-gray-100'>
            Word Search Count:
          </strong>{' '}
          {user.wordSearchCount}
        </p>
      </div>
    </div>
  );
}
