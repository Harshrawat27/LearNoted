'use client';
import { HighlighterIcon, Search as SearchIcon } from 'lucide-react';

export default function HighlightsLoading() {
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-8 animate-pulse'></div>

      {/* Search Bar Skeleton */}
      <div className='relative mb-6'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <SearchIcon className='h-5 w-5 text-gray-400' />
        </div>
        <div className='block w-full h-12 pl-10 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse'></div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Words List Skeleton */}
        <div className='lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse'></div>
            <div className='h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mt-2 animate-pulse'></div>
          </div>

          <div className='h-[600px] overflow-y-auto'>
            <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <li key={index} className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='w-full'>
                        <div className='h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse'></div>
                        <div className='h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mt-2 animate-pulse'></div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Word Details Skeleton */}
        <div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md'>
          <div className='h-full flex items-center justify-center p-6 text-center text-gray-500'>
            <div>
              <HighlighterIcon className='h-12 w-12 mx-auto mb-4 opacity-30' />
              <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto animate-pulse'></div>
              <div className='h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto mt-2 animate-pulse'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
