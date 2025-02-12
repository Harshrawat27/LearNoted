'use client';

import { useEffect } from 'react';
import { useSession, signIn, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function SignInComponent() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/auth-success');
    }
  }, [session, router]);

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-100'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md rounded-2xl bg-white p-8 shadow-lg'
      >
        <h1 className='mb-4 text-center text-2xl font-semibold'>Sign In</h1>
        <div className='flex flex-col space-y-4'>
          <button
            className='rounded-xl bg-black px-4 py-2 font-semibold text-white shadow hover:bg-gray-800'
            onClick={() => signIn('github')}
          >
            Sign in with GitHub
          </button>
          <button
            className='rounded-xl bg-red-500 px-4 py-2 font-semibold text-white shadow hover:bg-red-600'
            onClick={() => signIn('google')}
          >
            Sign in with Google
          </button>
        </div>
      </motion.div>
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
