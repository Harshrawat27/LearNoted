'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  searchHistory: any;
  usageData: any;
  now: string; // Pass current date as an ISO string
};

export default function ClientSearchDashboard({
  searchHistory,
  usageData,
  now,
}: Props) {
  // Convert the passed ISO string to a Date object.
  const nowDate = new Date(now);
  const daysInMonth = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth() + 1,
    0
  ).getDate();

  // Create an array for counts for each day (index 0 corresponds to day 1)
  const counts = new Array(daysInMonth).fill(0);
  usageData.forEach((item: any) => {
    // item._id is the day of the month (number)
    counts[item._id - 1] = item.count;
  });
  const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const data = {
    labels,
    datasets: [
      {
        label: 'Searches per Day',
        data: counts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Search Usage for Current Month' },
    },
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Search History &amp; Usage</h1>
      <div style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <Bar data={data} options={options} />
      </div>
      <h2>Search History</h2>
      <ul>
        {searchHistory.map((search: any) => (
          <li key={search._id}>
            <strong>{search.word}</strong> – {search.meaning} <br />
            <small>
              Searched on: {new Date(search.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
