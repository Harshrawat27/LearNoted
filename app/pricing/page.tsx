import Image from 'next/image';

export default function PricingPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-8 sm:p-5 font-sans'>
      {/* Header */}
      <header className='flex items-center justify-between mb-12'>
        <div className='flex items-center gap-2'>
          <Image
            src='/logo.png' /* Replace with your own logo */
            alt='Logo'
            width={40}
            height={40}
            className='rounded-full'
          />
          <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Pricing
          </h1>
        </div>
      </header>

      {/* Hero / Intro */}
      <section className='text-center mb-16 max-w-3xl mx-auto'>
        <h2 className='text-3xl sm:text-5xl font-extrabold mb-4 text-gray-800 dark:text-white'>
          Flexible Plans for Everyone
        </h2>
        <p className='text-lg sm:text-xl text-gray-700 dark:text-gray-300'>
          Whether you&apos;re just exploring or a power user, we have a plan
          that fits your needs.
        </p>
      </section>

      {/* Pricing Cards */}
      <main className='grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto'>
        {/* Free Plan */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 flex flex-col'>
          <h3 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>
            Free Plan
          </h3>
          <p className='text-gray-700 dark:text-gray-300 mb-4'>
            Perfect for hobby projects or initial exploration.
          </p>
          <div className='text-4xl font-bold text-gray-800 dark:text-white mb-6'>
            $0 <span className='text-lg font-normal'>/ month</span>
          </div>
          <ul className='space-y-2 text-gray-700 dark:text-gray-300 mb-8'>
            <li>• Up to 100 searches/month</li>
            <li>• Basic AI definitions</li>
            <li>• Community support</li>
          </ul>
          <button className='mt-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:bg-blue-500 transition-colors'>
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 flex flex-col'>
          <h3 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>
            Pro Plan
          </h3>
          <p className='text-gray-700 dark:text-gray-300 mb-4'>
            Ideal for power users and professionals.
          </p>
          <div className='text-4xl font-bold text-gray-800 dark:text-white mb-6'>
            $5 <span className='text-lg font-normal'>/ month</span>
          </div>
          <ul className='space-y-2 text-gray-700 dark:text-gray-300 mb-8'>
            <li>• Unlimited monthly searches</li>
            <li>• Advanced AI suggestions</li>
            <li>• 24/7 priority support</li>
          </ul>
          <button className='mt-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:bg-blue-500 transition-colors'>
            Upgrade Now
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className='mt-16 border-t border-gray-300 dark:border-gray-700 pt-6 text-center'>
        <p className='text-gray-600 dark:text-gray-400 text-sm'>
          &copy; {new Date().getFullYear()} AI Extension. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
