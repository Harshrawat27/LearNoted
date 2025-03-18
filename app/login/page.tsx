'use client';

import { useEffect } from 'react';
import { useSession, signIn, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Chrome } from 'lucide-react';

function SignInComponent() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        {/* Header */}
        <header className='flex items-center justify-between py-4 mb-8'>
          <Link href='/' className='flex items-center gap-2'>
            <Image
              src='/logo.png'
              alt='AI Extension Logo'
              width={40}
              height={40}
              className='rounded-full'
            />
            <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
              Lear<span className='text-purple-500'>Noted</span>
            </h1>
          </Link>
        </header>

        {/* Sign In Content */}
        <div className='flex flex-col items-center justify-center py-12'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-200 dark:border-gray-700'
          >
            <div className='text-center mb-8'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4'>
                <Chrome className='h-8 w-8 text-purple-600 dark:text-purple-400' />
              </div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Welcome Back
              </h1>
              <p className='text-gray-600 dark:text-gray-300 mt-2'>
                Sign in to access your highlights and bookmarks
              </p>
            </div>

            <div className='flex flex-col space-y-4'>
              <button
                className='flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-3 font-semibold text-white shadow transition-colors'
                onClick={() => signIn('github')}
              >
                <Github className='mr-2 h-5 w-5' />
                Sign in with GitHub
              </button>
              <button
                className='flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-3 font-semibold text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 shadow transition-colors'
                onClick={() => signIn('google')}
              >
                <svg className='mr-2 h-5 w-5' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z'
                  />
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className='mt-8 text-center text-sm text-gray-500 dark:text-gray-400'>
              By signing in, you agree to our{' '}
              <Link
                href='/terms'
                className='text-purple-600 dark:text-purple-400 hover:underline'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy-policy'
                className='text-purple-600 dark:text-purple-400 hover:underline'
              >
                Privacy Policy
              </Link>
            </div>
          </motion.div>

          <div className='mt-8 text-center'>
            <p className='text-gray-600 dark:text-gray-300'>
              Don&apos;t have an account yet?{' '}
              <Link
                href='/signup'
                className='text-purple-600 dark:text-purple-400 font-medium hover:underline'
              >
                Install our extension
              </Link>{' '}
              to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <SessionProvider>
      <SignInComponent />
    </SessionProvider>
  );
}
