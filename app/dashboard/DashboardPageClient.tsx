'use client';

import Image from 'next/image';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface DashboardPageClientProps {
  user: {
    name: string;
    email: string;
    subscriptionPlan: string;
    wordSearchCount: number;
  };
  searches: Array<{
    _id: string;
    word: string;
    meaning: string;
    synonyms: string[];
    createdAt: string;
  }>;
  usageData: Array<{
    date: string;
    count: number;
  }>;
}

export default function DashboardPageClient({
  user,
  searches,
  usageData,
}: DashboardPageClientProps) {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-8 sm:p-16 font-sans text-gray-800 dark:text-gray-100'>
      {/* Page Header */}
      <header className='flex items-center justify-between mb-8'>
        <div className='flex items-center gap-3'>
          {/* Replace the logo src with your own if desired */}
          <Image
            src='/logo.png'
            alt='Logo'
            width={40}
            height={40}
            className='rounded-full'
          />
          <h1 className='text-3xl font-bold'>Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className='grid gap-8 md:grid-cols-2'>
        {/* USER INFO CARD */}
        <section className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
          <h2 className='text-xl font-semibold mb-4 text-gray-800 dark:text-white'>
            User Information
          </h2>
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
        </section>

        {/* USAGE CHART CARD */}
        <section className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
          <h2 className='text-xl font-semibold mb-4 text-gray-800 dark:text-white'>
            Search Usage
          </h2>
          <div className='w-full h-64'>
            <ResponsiveContainer>
              <AreaChart
                data={usageData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id='colorCount' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' stroke='#ccc' />
                <XAxis dataKey='date' stroke='#888' />
                <YAxis allowDecimals={false} stroke='#888' />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type='monotone'
                  dataKey='count'
                  stroke='#8884d8'
                  fillOpacity={1}
                  fill='url(#colorCount)'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>

      {/* RECENT SEARCHES TABLE */}
      <section className='mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
        <h2 className='text-xl font-semibold mb-4 text-gray-800 dark:text-white'>
          Recent Searches
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead className='bg-gray-100 dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300'>
                  Word
                </th>
                <th className='px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300'>
                  Meaning
                </th>
                <th className='px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300'>
                  Synonyms
                </th>
                <th className='px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300'>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {searches.map((search) => (
                <tr
                  key={search._id}
                  className='border-b border-gray-200 dark:border-gray-700'
                >
                  <td className='px-4 py-2 text-gray-700 dark:text-gray-300'>
                    {search.word}
                  </td>
                  <td className='px-4 py-2 text-gray-700 dark:text-gray-300'>
                    {search.meaning}
                  </td>
                  <td className='px-4 py-2 text-gray-700 dark:text-gray-300'>
                    {search.synonyms.join(', ')}
                  </td>
                  <td className='px-4 py-2 text-gray-700 dark:text-gray-300'>
                    {new Date(search.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
