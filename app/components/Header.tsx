'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTheme } from './ThemeContext';
import { Moon, Sun } from 'lucide-react'; // Import icons for the toggle

export default function Header() {
  // Get session info from NextAuth
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // Get theme context
  const { theme, toggleTheme } = useTheme();

  return (
    <header className='flex items-center justify-between py-4 px-6 row-start-1 border-b border-gray-200 dark:border-gray-800'>
      <Link href='/'>
        <div className='flex items-center gap-2'>
          <Image
            src={
              theme === 'light'
                ? '/LearNoted-logo-white-512.svg'
                : '/learnoted-logo-white.svg'
            }
            alt='Logo'
            width={40}
            height={40}
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

      <div className='flex items-center gap-4'>
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className='p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Login/Dashboard Button */}
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
