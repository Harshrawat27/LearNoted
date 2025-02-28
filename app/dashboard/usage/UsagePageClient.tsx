'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { CalendarDays, CircleUser, Calendar, ArrowUpRight } from 'lucide-react';

interface UsagePageClientProps {
  usageData: Array<{
    date: string;
    count: number;
  }>;
  wordCategories: Array<{
    name: string;
    value: number;
  }>;
  totalSearches: number;
}

// For the pie chart
const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00C49F',
];

export default function UsagePageClient({
  usageData,
  wordCategories,
  totalSearches,
}: UsagePageClientProps) {
  const [timeRange, setTimeRange] = useState('all');

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (timeRange === 'all') return usageData;

    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'year') {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }

    return usageData.filter((item) => new Date(item.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  // Calculate daily average
  const totalDays = filteredData.length;
  const totalCount = filteredData.reduce((sum, item) => sum + item.count, 0);
  const dailyAverage = totalDays > 0 ? (totalCount / totalDays).toFixed(1) : 0;

  return (
    <div className='max-w-6xl mx-auto'>
      <h1 className='text-2xl font-bold mb-8'>Usage Statistics</h1>

      {/* Time Range Tabs */}
      <div className='flex space-x-2 mb-6'>
        {[
          { value: 'week', label: 'Last Week' },
          { value: 'month', label: 'Last Month' },
          { value: 'year', label: 'Last Year' },
          { value: 'all', label: 'All Time' },
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-4 py-2 rounded-lg ${
              timeRange === range.value
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Total Searches
              </p>
              <h3 className='text-2xl font-bold mt-1'>{totalSearches}</h3>
            </div>
            <div className='p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg'>
              <CircleUser size={20} />
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Daily Average
              </p>
              <h3 className='text-2xl font-bold mt-1'>{dailyAverage}</h3>
            </div>
            <div className='p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg'>
              <CalendarDays size={20} />
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Active Days
              </p>
              <h3 className='text-2xl font-bold mt-1'>{totalDays}</h3>
            </div>
            <div className='p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg'>
              <Calendar size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        {/* Usage Chart Card */}
        <section className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
          <h2 className='text-xl font-semibold mb-4 flex items-center justify-between'>
            <span>Daily Search Activity</span>
            <span className='text-sm font-normal text-purple-500 flex items-center'>
              <ArrowUpRight size={16} className='mr-1' />
              {totalCount > 0
                ? `${((totalCount / totalSearches) * 100).toFixed(1)}%`
                : '0%'}{' '}
              of total
            </span>
          </h2>
          <div className='w-full h-64'>
            <ResponsiveContainer>
              <AreaChart
                data={filteredData}
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

        {/* Category Chart Card */}
        <section className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Word Categories</h2>
          <div className='w-full h-64'>
            {wordCategories.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={wordCategories}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {wordCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-full text-gray-500'>
                No category data available
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Monthly Trends */}
      <section className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
        <h2 className='text-xl font-semibold mb-4'>Monthly Trends</h2>
        <div className='w-full h-64'>
          {/* This could show a consolidated version of monthly data */}
          <ResponsiveContainer>
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id='colorTrend' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
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
                stroke='#82ca9d'
                fillOpacity={1}
                fill='url(#colorTrend)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
