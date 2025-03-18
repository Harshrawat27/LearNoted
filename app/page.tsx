// import { useState } from 'react';
import Image from 'next/image';
import Header from './components/Header';
import Link from 'next/link';
import Footer from './components/Footer';
// No Button import needed
import { HighlighterIcon, Search, Chrome, BookOpen, Brain } from 'lucide-react';
import NewsletterForm from './components/NewsletterForm'; // Import the new form component

export default function HomePage() {
  // const [email, setEmail] = useState('');

  // const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // Handle subscription logic here
  //   alert(`Subscribed with email: ${email}`);
  //   setEmail('');
  // };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <Header />

        {/* Hero Section */}
        <section className='py-16 md:py-24'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
                Turn Browsing into Learning
              </h1>
              <p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>
                Capture meanings, highlights, and key moments across the web —
                all in one place, always at your fingertips.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Link href='/#contact'>
                  <button className='bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-md transition-colors'>
                    Add to Chrome
                  </button>
                </Link>
                <Link href='/pricing'>
                  <button className='border border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 px-8 py-6 text-lg rounded-md transition-colors bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/10'>
                    Learn More
                  </button>
                </Link>
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
              Everything you need to transform casual browsing into productive
              learning
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
                  Instant Word Lookup
                </h3>
                <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
                  Uncover meaning with a simple shortcut
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
                      Select any word and press Cmd+M (Mac) or Ctrl+M (Windows)
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
                      Get instant definitions without leaving your page
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
                      Explore synonyms to enhance your vocabulary
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
                      Save lookups for future reference
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2: Text on left, image on right */}
            <div className='grid md:grid-cols-2 gap-12 items-center'>
              <div className='order-2 md:order-1'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Video Timestamp Saver
                </h3>
                <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
                  Never lose a key moment again
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
                      Save exact timestamps while watching YouTube videos
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
                      Add notes to mark important points and insights
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
                      Create a personalized learning timeline
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
                      Quickly jump back to crucial moments in any video
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
                  Smart Highlighting
                </h3>
                <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
                  Capture what matters most
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
                      Highlight important text across any website
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
                      Organize highlights by color and category
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
                      Access your highlights from any device
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
                      Review and study your collected insights
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
                      Capture Knowledge As You Browse{' '}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300'>
                      Select words for instant definitions, highlight important
                      passages, or save video timestamps with just a few clicks.
                      All your valuable insights are automatically organized in
                      your personal dashboard.
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
                      place. Filter by website, content, or comments.
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
                      Reference your dashboard anytime to retain knowledge
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
                  Early bird access
                </h2>
                <p className='text-lg text-gray-700 dark:text-gray-300 mb-6'>
                  Our extension is currently under review. Subscribe now to be
                  notified the moment Learnoted launches and be among the first
                  to enhance your browsing experience. <br></br>
                  <br></br> If you purchase now during our pre-launch,
                  you&apos;ll get 45 days of premium features instead of 30—for
                  just $5 on your{' '}
                  <Link
                    className=' text-purple-400 hover:text-purple-600'
                    href='/pro-plan'
                  >
                    {' '}
                    first purchase!{' '}
                  </Link>
                </p>
              </div>
              <div>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
