'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from './components/Header';
// No Button import needed
import { HighlighterIcon, Search, Chrome, BookOpen, Brain } from 'lucide-react';

export default function HomePage() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle subscription logic here
    alert(`Subscribed with email: ${email}`);
    setEmail('');
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <Header />

        {/* Hero Section */}
        <section className='py-16 md:py-24'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
                Save and manage your web highlights easily
              </h1>
              <p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>
                Use our browser extension to highlight important content across
                the web. Access and organize your highlights anytime, anywhere.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <button className='bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-md transition-colors'>
                  Add to Chrome
                </button>
                <button className='border border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 px-8 py-6 text-lg rounded-md transition-colors bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/10'>
                  Learn More
                </button>
              </div>
            </div>
            <div className='relative'>
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 md:ml-12'>
                <Image
                  src='/hero-section.gif'
                  alt='Dashboard Preview'
                  width={500}
                  height={300}
                  className='rounded-lg'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='py-16 md:py-24'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Key Features
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Everything you need to collect, organize and reference important
              content from around the web.
            </p>
          </div>

          <div className='space-y-24'>
            {/* Feature 1: Image on left, text on right */}
            <div className='grid md:grid-cols-2 gap-12 items-center'>
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-3 relative'>
                <div className='absolute -top-4 -left-4 bg-purple-100 dark:bg-purple-900/20 p-4 rounded-xl'>
                  <HighlighterIcon className='h-8 w-8 text-purple-600 dark:text-purple-400' />
                </div>
                <Image
                  src='/Vocabulary.gif'
                  alt='Vocabulary Feature'
                  width={500}
                  height={300}
                  className='rounded-lg'
                />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Easy Search for work meaning
                </h3>
                <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
                  Highlight text on any webpage with just a few clicks. Our
                  intuitive interface makes it simple to save important
                  information as you browse.
                </p>
                <ul className='space-y-3'>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full'>
                      <svg
                        className='h-4 w-4 text-purple-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-gray-700 dark:text-gray-300'>
                      Multiple highlight colors to categorize content
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full'>
                      <svg
                        className='h-4 w-4 text-purple-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-gray-700 dark:text-gray-300'>
                      One-click highlighting with default settings
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full'>
                      <svg
                        className='h-4 w-4 text-purple-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-gray-700 dark:text-gray-300'>
                      Works on articles, research papers, and any text-based
                      content
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2: Text on left, image on right */}
            <div className='grid md:grid-cols-2 gap-12 items-center'>
              <div className='order-2 md:order-1'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Powerful Search
                </h3>
                <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
                  Quickly find your highlights by text content or website
                  domain. Our powerful search tools help you locate exactly what
                  you need.
                </p>
                <ul className='space-y-3'>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full'>
                      <svg
                        className='h-4 w-4 text-purple-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-gray-700 dark:text-gray-300'>
                      Filter by website, date, or content
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full'>
                      <svg
                        className='h-4 w-4 text-purple-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-gray-700 dark:text-gray-300'>
                      Full-text search across all your highlights
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full'>
                      <svg
                        className='h-4 w-4 text-purple-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-gray-700 dark:text-gray-300'>
                      Save and organize favorite searches
                    </span>
                  </li>
                </ul>
              </div>
              <div className='order-1 md:order-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-3 relative'>
                <div className='absolute -top-4 -right-4 bg-purple-100 dark:bg-purple-900/20 p-4 rounded-xl'>
                  <Search className='h-8 w-8 text-purple-600 dark:text-purple-400' />
                </div>
                <Image
                  src='/youtube-highlight-1.gif'
                  alt='Search Feature'
                  width={500}
                  height={300}
                  className='rounded-lg'
                />
              </div>
            </div>

            {/* Feature 3: Image on left, text on right */}
            <div className='grid md:grid-cols-2 gap-12 items-center'>
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-3 relative'>
                <div className='absolute -top-4 -left-4 bg-purple-100 dark:bg-purple-900/20 p-4 rounded-xl'>
                  <Chrome className='h-8 w-8 text-purple-600 dark:text-purple-400' />
                </div>
                <Image
                  src='/highlight.gif'
                  alt='Highlight feature'
                  width={500}
                  height={300}
                  className='rounded-lg'
                />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Seamless Integration
                </h3>
                <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
                  Works perfectly with your browser with no complicated setup
                  required. Start highlighting in seconds.
                </p>
                <ul className='space-y-3'>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full'>
                      <svg
                        className='h-4 w-4 text-purple-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-gray-700 dark:text-gray-300'>
                      Compatible with Chrome, Firefox, and Edge
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full'>
                      <svg
                        className='h-4 w-4 text-purple-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-gray-700 dark:text-gray-300'>
                      Cloud sync across all your devices
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <div className='flex-shrink-0 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full'>
                      <svg
                        className='h-4 w-4 text-purple-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-gray-700 dark:text-gray-300'>
                      Lightweight extension that won&apos;t slow down your
                      browser{' '}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id='about'
          className='py-16 md:py-24 bg-white dark:bg-gray-800 rounded-2xl shadow-md'
        >
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              How It Works
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Simple, efficient, and designed for your workflow.
            </p>
          </div>

          {/* Desktop version (hidden on mobile) */}
          <div className='max-w-4xl mx-auto relative px-4 hidden md:block'>
            {/* Central Vertical Line */}
            <div className='absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-300 dark:bg-purple-800'></div>

            <div className='relative'>
              {/* Step 1 - Right Side */}
              <div className='flex mb-24'>
                {/* Center Icon */}
                <div className='absolute left-1/2 transform -translate-x-1/2 z-10'>
                  <div className='w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-purple-400 dark:border-purple-600 flex items-center justify-center'>
                    <Chrome className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                  </div>
                </div>

                {/* Content Box - Right Side */}
                <div className='ml-auto w-5/12 pt-2'>
                  <div className='bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600'>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                      Install the Extension
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      Add our extension to your browser with a single click from
                      the Chrome Web Store.
                    </p>
                  </div>
                </div>

                {/* Spacer for Left Side */}
                <div className='w-5/12'></div>
              </div>

              {/* Step 2 - Left Side */}
              <div className='flex mb-24'>
                {/* Content Box - Left Side */}
                <div className='mr-auto w-5/12 pt-2'>
                  <div className='bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600'>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                      Highlight Important Content
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      Select text on any webpage and choose your highlight
                      color. Save key information as you browse.
                    </p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className='absolute left-1/2 transform -translate-x-1/2 z-10'>
                  <div className='w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-purple-400 dark:border-purple-600 flex items-center justify-center'>
                    <HighlighterIcon className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                  </div>
                </div>

                {/* Spacer for Right Side */}
                <div className='w-5/12'></div>
              </div>

              {/* Step 3 - Right Side */}
              <div className='flex mb-24'>
                {/* Center Icon */}
                <div className='absolute left-1/2 transform -translate-x-1/2 z-10'>
                  <div className='w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-purple-400 dark:border-purple-600 flex items-center justify-center'>
                    <BookOpen className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                  </div>
                </div>

                {/* Content Box - Right Side */}
                <div className='ml-auto w-5/12 pt-2'>
                  <div className='bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600'>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                      Access Your Library
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      View, search, and organize all your highlights in one
                      place. Filter by website, date, or content.
                    </p>
                  </div>
                </div>

                {/* Spacer for Left Side */}
                <div className='w-5/12'></div>
              </div>

              {/* Step 4 - Left Side */}
              <div className='flex'>
                {/* Content Box - Left Side */}
                <div className='mr-auto w-5/12 pt-2'>
                  <div className='bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600'>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                      Keep Learning
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      Reference your highlights anytime to retain knowledge
                      better and improve your learning process.
                    </p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className='absolute left-1/2 transform -translate-x-1/2 z-10'>
                  <div className='w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-purple-400 dark:border-purple-600 flex items-center justify-center'>
                    <Brain className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                  </div>
                </div>

                {/* Spacer for Right Side */}
                <div className='w-5/12'></div>
              </div>
            </div>
          </div>

          {/* Mobile version (hidden on desktop) */}
          <div className='md:hidden px-4'>
            <div className='space-y-6'>
              {/* Step 1 - Mobile */}
              <div className='relative'>
                <div className='flex items-center mb-3'>
                  <div className='w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-purple-400 dark:border-purple-600 flex items-center justify-center mr-3'>
                    <Chrome className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                    Install the Extension
                  </h3>
                </div>
                <div className='bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 w-full'>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    Add our extension to your browser with a single click from
                    the Chrome Web Store.
                  </p>
                </div>
              </div>

              {/* Step 2 - Mobile */}
              <div className='relative'>
                <div className='flex items-center mb-3'>
                  <div className='w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-purple-400 dark:border-purple-600 flex items-center justify-center mr-3'>
                    <HighlighterIcon className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                    Highlight Important Content
                  </h3>
                </div>
                <div className='bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 w-full'>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    Select text on any webpage and choose your highlight color.
                    Save key information as you browse.
                  </p>
                </div>
              </div>

              {/* Step 3 - Mobile */}
              <div className='relative'>
                <div className='flex items-center mb-3'>
                  <div className='w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-purple-400 dark:border-purple-600 flex items-center justify-center mr-3'>
                    <BookOpen className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                    Access Your Library
                  </h3>
                </div>
                <div className='bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 w-full'>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    View, search, and organize all your highlights in one place.
                    Filter by website, date, or content.
                  </p>
                </div>
              </div>

              {/* Step 4 - Mobile */}
              <div className='relative'>
                <div className='flex items-center mb-3'>
                  <div className='w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-purple-400 dark:border-purple-600 flex items-center justify-center mr-3'>
                    <Brain className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                    Keep Learning
                  </h3>
                </div>
                <div className='bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 w-full'>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    Reference your highlights anytime to retain knowledge better
                    and improve your learning process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id='contact' className='py-16 md:py-24'>
          <div className='bg-purple-100 dark:bg-purple-900/20 rounded-2xl shadow-md p-8 md:p-12'>
            <div className='grid md:grid-cols-2 gap-8 items-center'>
              <div>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                  Stay Updated
                </h2>
                <p className='text-lg text-gray-700 dark:text-gray-300 mb-6'>
                  Subscribe to our newsletter for updates, tips, and exclusive
                  features.
                </p>
              </div>
              <div>
                <form
                  onSubmit={handleSubscribe}
                  className='flex flex-col sm:flex-row gap-3'
                >
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    required
                    className='flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500'
                  />
                  <button
                    type='submit'
                    className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 whitespace-nowrap rounded-md transition-colors'
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='py-8 border-t border-gray-200 dark:border-gray-800'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center gap-2 mb-4 md:mb-0'>
              <Image
                src='learnoted-logo-white.svg'
                alt='AI Extension Logo'
                width={40}
                height={40}
                className='rounded-full'
              />
              <span className='text-lg font-semibold text-gray-800 dark:text-white'>
                LearNoted
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

// any things to push
