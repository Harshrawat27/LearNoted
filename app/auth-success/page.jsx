'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function AuthSuccess() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    // Fetch token and send to extension
    fetch('/api/auth/token')
      .then((res) => res.json())
      .then(({ token }) => {
        window.postMessage(
          {
            type: 'EXTENSION_TOKEN',
            token: token,
          },
          '*'
        );
      })
      .catch((err) => {
        console.error('Error fetching token:', err);
      });

    // Countdown timer for redirecting to dashboard
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-center p-4'>
      <div className='max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col items-center'>
          <div className='w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-6'>
            <CheckCircle className='h-10 w-10 text-purple-600 dark:text-purple-400' />
          </div>

          <Image
            src='/learnoted-logo-white.svg'
            alt='Learnoted Logo'
            width={60}
            height={60}
            className='rounded-full mb-4'
          />

          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            Authentication Successful!
          </h1>

          <p className='text-gray-600 dark:text-gray-300 mb-6'>
            You've been successfully authenticated. You can now access all your
            highlights and bookmarks.
          </p>

          <div className='w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4'>
            <span className='text-xl font-bold text-purple-600 dark:text-purple-400'>
              {countdown}
            </span>
          </div>

          <p className='text-sm text-gray-500 dark:text-gray-400'>
            You will be redirected to dashboard in {countdown} second
            {countdown !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
