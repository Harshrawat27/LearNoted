'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Header() {
  // Get session info from NextAuth
  const { data: session } = useSession();

  return (
    <header className='flex items-center justify-between py-4 row-start-1'>
      <div className='flex items-center gap-2'>
        <Image
          src='/logo.png' /* Replace with your own logo image */
          alt='AI Extension Logo'
          width={40}
          height={40}
          className='rounded-full'
        />
        <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
          AI Extension
        </h1>
      </div>

      <nav className='flex items-center gap-6'>
        <a
          href='#features'
          className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors'
        >
          Features
        </a>
        <a
          href='#about'
          className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors'
        >
          About
        </a>
        <a
          href='#contact'
          className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors'
        >
          Contact
        </a>

        {/* Only show Dashboard if user is logged in */}
        {session && (
          <Link
            href='/dashboard'
            className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors'
          >
            Dashboard
          </Link>
        )}
      </nav>
    </header>
  );
}
