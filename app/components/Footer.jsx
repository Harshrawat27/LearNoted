import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='py-8 border-t border-gray-200 dark:border-gray-800'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          {/* Logo and Brand Name */}
          <div className='flex items-center gap-2 mb-4 md:mb-0'>
            <Image
              src='/learnoted-logo-white.svg'
              alt='LearNoted Logo'
              width={40}
              height={40}
              className='rounded-full'
            />
            <span className='text-lg font-semibold text-gray-800 dark:text-white'>
              Lear<span className='text-purple-500'>Noted</span>
            </span>
          </div>

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
