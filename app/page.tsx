import Image from 'next/image';
import Header from './components/Header';

export default function Home() {
  return (
    <div className='min-h-screen grid grid-rows-[auto_1fr_auto] p-8 gap-8 sm:p-5 font-sans bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className='row-start-2 flex flex-col items-center justify-center text-center'>
        {/* Hero Section */}
        <section className='mb-16'>
          <h2 className='text-3xl sm:text-5xl font-extrabold mb-4 text-gray-800 dark:text-white'>
            Search Smarter, Not Harder
          </h2>
          <p className='text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl'>
            Seamlessly explore definitions, learn new concepts, and discover
            deeper insights without ever leaving the page.
          </p>
          <div className='mt-8'>
            <button className='bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-colors'>
              Get Started
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section
          id='features'
          className='grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full'
        >
          <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col items-center text-center'>
            <Image
              src='/feature-1.png' /* Replace with an appropriate image URL */
              alt='Feature 1'
              width={80}
              height={80}
              className='mb-4'
            />
            <h3 className='text-xl font-semibold text-gray-800 dark:text-white mb-2'>
              Instant Definitions
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>
              Highlight any word or phrase to get instant explanations,
              synonyms, and translations.
            </p>
          </div>

          <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col items-center text-center'>
            <Image
              src='/feature-2.png' /* Replace with an appropriate image URL */
              alt='Feature 2'
              width={80}
              height={80}
              className='mb-4'
            />
            <h3 className='text-xl font-semibold text-gray-800 dark:text-white mb-2'>
              Contextual AI Search
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>
              Discover relevant resources, articles, and insights based on what
              you&apos;re reading.
            </p>
          </div>

          <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col items-center text-center'>
            <Image
              src='/feature-3.png' /* Replace with an appropriate image URL */
              alt='Feature 3'
              width={80}
              height={80}
              className='mb-4'
            />
            <h3 className='text-xl font-semibold text-gray-800 dark:text-white mb-2'>
              Seamless Integration
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>
              No need to leave the page—our lightweight extension works across
              websites, blogs, and social media.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section id='about' className='mt-16 max-w-3xl text-left'>
          <h2 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
            About the Extension
          </h2>
          <p className='text-gray-700 dark:text-gray-300 mb-4'>
            Our AI-powered browser extension is designed to enhance your reading
            experience. Whether you&apos;re researching for a project, learning
            a new topic, or just browsing the web for fun, our tool helps you
            delve deeper without interrupting your flow.
          </p>
          <p className='text-gray-700 dark:text-gray-300 mb-4'>
            By using natural language processing and advanced search algorithms,
            our extension contextualizes what you&apos;re reading and fetches
            relevant information instantly.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer
        id='contact'
        className='row-start-3 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-300 dark:border-gray-700 mt-8'
      >
        <p className='text-gray-600 dark:text-gray-400 text-sm'>
          © {new Date().getFullYear()} AI Extension. All rights reserved.
        </p>
        <div className='flex gap-4 mt-4 sm:mt-0'>
          <a href='#' className='text-blue-600 hover:underline text-sm'>
            Twitter
          </a>
          <a href='#' className='text-blue-600 hover:underline text-sm'>
            GitHub
          </a>
          <a href='#' className='text-blue-600 hover:underline text-sm'>
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}
