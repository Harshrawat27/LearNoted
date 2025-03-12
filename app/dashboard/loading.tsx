'use client';

import { User } from 'lucide-react';

export default function ProfileLoading() {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded-md mb-8 animate-pulse'></div>

      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden'>
        {/* Profile Header - Gradient Placeholder */}
        <div className='bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 h-32 animate-pulse' />

        <div className='p-6 relative'>
          {/* Profile Picture Placeholder */}
          <div className='absolute -top-16 left-6'>
            <div className='h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse'>
              <div className='flex items-center justify-center h-full text-gray-300 dark:text-gray-600'>
                <User size={64} />
              </div>
            </div>
          </div>

          {/* Profile Info Placeholders */}
          <div className='mt-16'>
            <div className='flex justify-between items-center mb-4'>
              <div className='h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse'></div>
            </div>

            <div className='space-y-4'>
              {/* Email Placeholder */}
              <div className='flex items-center gap-3'>
                <div className='w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse'></div>
                <div className='h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse'></div>
              </div>

              {/* Subscription Placeholder */}
              <div className='flex items-center gap-3'>
                <div className='w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse'></div>
                <div className='h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse'></div>
              </div>

              {/* Stats Section */}
              <div>
                <div className='h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse'></div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
                    <div className='h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded-md mb-2 animate-pulse'></div>
                    <div className='h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse'></div>
                  </div>
                  <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
                    <div className='h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded-md mb-2 animate-pulse'></div>
                    <div className='h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
