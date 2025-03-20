'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from './ThemeContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  // Get theme context
  const { theme, toggleTheme } = useTheme();
  return (
    <footer className='py-8 border-t border-gray-200 dark:border-gray-800'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          {/* Logo and Brand Name */}
          <Link href='/'>
            <div className='flex items-center gap-2 mb-4 md:mb-0'>
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
              <span className='text-lg font-semibold text-gray-800 dark:text-white'>
                Lear<span className='text-purple-500'>Noted</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className='mb-4 md:mb-0'>
            <nav className='flex flex-wrap justify-center gap-6 text-sm'>
              <Link
                href='/founders-letter'
                className='text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400'
              >
                Founder's Letter
              </Link>

              <Link
                href='/privacy-policy'
                className='text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400'
              >
                Privacy
              </Link>
              <a
                href='mailto:harshrawat.dev@gmail.com'
                className='text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400'
              >
                Contact us
              </a>
            </nav>
          </div>

          {/* Copyright */}
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            © {currentYear} LearNoted. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
