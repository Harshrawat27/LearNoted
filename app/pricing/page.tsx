'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 font-sans'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        {/* Header */}
        <header className='flex items-center justify-between py-4 mb-12'>
          <Link href='/' className='flex items-center gap-2'>
            <Image
              src='/learnoted-logo-white.svg'
              alt='Learnoted Logo'
              width={40}
              height={40}
              className='rounded-full'
            />
            <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
              Lear<span className='text-purple-500'>Noted</span>
            </h1>
          </Link>
        </header>

        {/* Hero / Intro */}
        <section className='text-center mb-16 max-w-3xl mx-auto'>
          <h2 className='text-3xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white'>
            Choose Your Plan
          </h2>
          <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-300'>
            Whether you&apos;re just exploring or a power user, we have a plan
            that fits your needs.
          </p>
        </section>

        {/* Pricing Cards */}
        <main className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16'>
          {/* Free Plan */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 flex flex-col border border-gray-200 dark:border-gray-700'>
            <div className='mb-8'>
              <span className='inline-block bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm font-medium py-1 px-3 rounded-full mb-3'>
                Free
              </span>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Basic Plan
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Perfect for casual browsing and getting started.
              </p>
            </div>

            <div className='text-4xl font-bold text-gray-900 dark:text-white mb-6'>
              $0{' '}
              <span className='text-lg font-normal text-gray-600 dark:text-gray-400'>
                / month
              </span>
            </div>

            <ul className='space-y-4 mb-8'>
              {[
                'Up to 5 highlighted pages',
                '10 word lookups per month',
                'Timestamps for up to 5 YouTube videos',
                'Access on a single browser',
                'Standard Support',
              ].map((feature, index) => (
                <li key={index} className='flex items-start'>
                  <div className='flex-shrink-0 mr-2 mt-1'>
                    <CheckCircle className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                  </div>
                  <span className='text-gray-600 dark:text-gray-300'>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <Link className='mt-auto' href='/auth/signin'>
              <button className='w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-6 rounded-xl transition-colors'>
                Get Started
              </button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col border-2 border-purple-400 dark:border-purple-600 relative'>
            <div className='absolute -top-4 right-8 bg-purple-600 text-white text-sm font-bold py-1 px-4 rounded-full'>
              Popular
            </div>

            <div className='mb-8'>
              <span className='inline-block bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm font-medium py-1 px-3 rounded-full mb-3'>
                Pro
              </span>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Premium Plan
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Ideal for professionals and power users.
              </p>
            </div>

            <div className='text-4xl font-bold text-gray-900 dark:text-white mb-6'>
              $5{' '}
              <span className='text-lg font-normal text-gray-600 dark:text-gray-400'>
                / for 30 days
              </span>
            </div>

            <ul className='space-y-4 mb-8'>
              {[
                'Unlimited highlighted pages',
                'Unlimited word lookups',
                'Unlimited YouTube video timestamps',
                'Multi-browser synchronization',
                'Priority support',
              ].map((feature, index) => (
                <li key={index} className='flex items-start'>
                  <div className='flex-shrink-0 mr-2 mt-1'>
                    <CheckCircle className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                  </div>
                  <span className='text-gray-600 dark:text-gray-300'>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <Link href='/pro-plan'>
              <button className='mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-colors'>
                Upgrade Now
              </button>
            </Link>
          </div>
        </main>

        {/* FAQ Section */}
        <section className='max-w-3xl mx-auto mb-16'>
          <h3 className='text-2xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            Frequently Asked Questions
          </h3>

          <div className='space-y-6'>
            {[
              {
                question: 'Is this a recurring plan?',
                answer:
                  'No, this is not a recurring plan. You pay just $5 for 30 days of premium access with no automatic renewals.',
              },
              {
                question: 'Is there any subscription option available?',
                answer:
                  "No, we don't offer subscription plans. We only want you to pay when you're actively using and benefiting from our premium features.",
              },
              {
                question:
                  "What happens to my saved data if I don't purchase another 30-day period after my current one expires?",
                answer:
                  "Your saved data will remain accessible for 10 days after your premium period ends. After that, you'll need to purchase another 30-day period to regain access.",
              },
              {
                question: 'Can I cancel my plan?',
                answer:
                  "Since this is a one-time payment for 30 days of access, there's no need to cancel. We won't charge you again unless you choose to purchase another 30-day period.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700'
              >
                <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  {faq.question}
                </h4>
                <p className='text-gray-600 dark:text-gray-300'>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className='bg-purple-100 dark:bg-purple-900/20 rounded-2xl p-8 md:p-12 mb-16 text-center'>
          <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            Ready to Enhance Your Web Experience?
          </h3>
          <p className='text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
            Join thousands of users who are transforming how they save and
            organize their web highlights.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/auth/signin'>
              <button className='bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl shadow-lg transition-colors'>
                Get Started for Free
              </button>
            </Link>
            <Link href='#features'>
              <button className='bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 font-medium py-3 px-8 rounded-xl transition-colors'>
                Learn More
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className='border-t border-gray-200 dark:border-gray-800 pt-8 pb-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center gap-2 mb-4 md:mb-0'>
              <Image
                src='/learnoted-logo-white.svg'
                alt='learnoted Logo'
                width={32}
                height={32}
                className='rounded-full'
              />
              <span className='text-lg font-semibold text-gray-800 dark:text-white'>
                AI Extension
              </span>
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              © {new Date().getFullYear()} AI Extension. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
