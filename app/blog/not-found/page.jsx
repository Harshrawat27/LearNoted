// app/blog/not-found.tsx
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Search, ArrowLeft } from 'lucide-react';

export default function BlogNotFound() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <Header />

        <main className='py-20 flex flex-col items-center justify-center text-center'>
          <div className='w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6'>
            <Search className='h-10 w-10 text-purple-600 dark:text-purple-400' />
          </div>

          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Content Not Found
          </h1>

          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-md mb-8'>
            Sorry, the blog post, category, or author you're looking for doesn't
            exist or has been moved.
          </p>

          <div className='flex flex-col sm:flex-row gap-4'>
            <Link
              href='/blog'
              className='inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors'
            >
              <ArrowLeft className='h-5 w-5 mr-2' />
              Go to Blog Home
            </Link>

            <Link
              href='/'
              className='inline-flex items-center justify-center px-6 py-3 border border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors'
            >
              Return to Main Site
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
