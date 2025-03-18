'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
// No Button import needed

export default function Header() {
  // Get session info from NextAuth
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className='flex items-center justify-between py-4 px-6 row-start-1 border-b border-gray-200 dark:border-gray-800'>
      <Link href='/'>
        <div className='flex items-center gap-2'>
          <Image
            src='/learnoted-logo-white.svg'
            alt='AI Extension Logo'
            width={50}
            height={50}
            className='rounded-full'
          />
          <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Lear<span className='text-purple-500'>Noted</span>
          </h1>
        </div>
      </Link>

      <nav className='hidden md:flex items-center gap-6'>
        <a
          href='https://www.learnoted.com/#features'
          className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors'
        >
          Features
        </a>
        <a
          href='/founders-letter'
          className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors'
        >
          Founder&apos;s Letter
        </a>
        <a
          href='/pricing'
          className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors'
        >
          Pricing
        </a>
        <a
          href='https://www.learnoted.com/#contact'
          className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors'
        >
          Contact
        </a>
      </nav>

      <div>
        {isLoading ? (
          <button
            disabled
            className='px-4 py-2 text-gray-400 bg-gray-100 rounded-md cursor-not-allowed'
          >
            Loading...
          </button>
        ) : session ? (
          <Link href='/dashboard'>
            <button className='px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors'>
              Dashboard
            </button>
          </Link>
        ) : (
          <Link href='/api/auth/signin'>
            <button className='px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors'>
              Login
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
