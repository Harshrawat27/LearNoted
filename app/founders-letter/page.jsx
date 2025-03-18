'use client';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import {
  UserCircle,
  Globe,
  BookOpen,
  Youtube,
  Lightbulb,
  DollarSign,
} from 'lucide-react';

export default function AboutPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <Header />

        {/* About Content */}
        <section className='py-12 md:py-16'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 md:p-12'>
              <div className='flex flex-col md:flex-row items-center md:items-start gap-8 mb-10'>
                <div className='flex-shrink-0'>
                  <div className='w-32 h-32 md:w-36 md:h-36 relative rounded-full overflow-hidden border-4 border-purple-600 dark:border-purple-400'>
                    <Image
                      src='/creator-avatar.jpg'
                      alt='Harsh'
                      fill
                      className='object-cover'
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%238b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 10-16 0"/></svg>';
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2'>
                    Hey 👋, I'm Harsh
                  </h1>
                  <p className='text-lg text-gray-600 dark:text-gray-300'>
                    The creator of Learnoted
                  </p>
                </div>
              </div>

              <div className='space-y-8 text-gray-700 dark:text-gray-300'>
                {/* Section 1: Introduction */}
                <div className='flex gap-4'>
                  <div className='flex-shrink-0 mt-1'>
                    <div className='p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full'>
                      <UserCircle className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                    </div>
                  </div>
                  <div>
                    <p className='mb-4'>
                      I'm a self-taught developer from India. Over the past four
                      years, I've spent more time on the internet than anywhere
                      else. Most of what I've learned comes from online
                      resources—I love exploring the web and discovering new
                      things.
                    </p>
                  </div>
                </div>

                {/* Section 2: Learning Challenge */}
                <div className='flex gap-4'>
                  <div className='flex-shrink-0 mt-1'>
                    <div className='p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full'>
                      <BookOpen className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                    </div>
                  </div>
                  <div>
                    <p className='mb-4'>
                      I enjoy reading blogs, but since English isn't my first
                      language, I sometimes struggle with certain words. Having
                      to switch tabs to look up meanings feels like a YouTube
                      ad—it disrupts the flow. But in this case, the "ad" is
                      unavoidable because you need another tab.
                    </p>
                  </div>
                </div>

                {/* Section 3: YouTube Challenge */}
                <div className='flex gap-4'>
                  <div className='flex-shrink-0 mt-1'>
                    <div className='p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full'>
                      <Youtube className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                    </div>
                  </div>
                  <div>
                    <p className='mb-4'>
                      The same happens when watching YouTube videos. Some
                      moments are <em>aha!</em> moments, and you want to take
                      notes. But finding a notebook or opening Notion or Google
                      Docs creates unnecessary friction.
                    </p>
                    <p className='mb-4'>
                      Or let's say you're reading something and want to
                      highlight and save a part for later. It's possible, but
                      with so many open tabs, it's easy to lose track.
                    </p>
                  </div>
                </div>

                {/* Section 4: The Solution */}
                <div className='flex gap-4'>
                  <div className='flex-shrink-0 mt-1'>
                    <div className='p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full'>
                      <Lightbulb className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                    </div>
                  </div>
                  <div>
                    <p className='mb-4'>
                      So, I built an extension that lets you do all of
                      this—without the extra steps. And in the future, I'll add
                      even more features to make internet browsing completely
                      frictionless.
                    </p>
                  </div>
                </div>

                {/* Section 5: Pricing Model */}
                <div className='flex gap-4'>
                  <div className='flex-shrink-0 mt-1'>
                    <div className='p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full'>
                      <DollarSign className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                    </div>
                  </div>
                  <div>
                    <p className='mb-4'>
                      You can start using it for free, and there's a paid plan
                      too—$5 for 30 days. Why not $5/month? Because I don't want
                      this to be another forgotten subscription silently
                      charging you. Instead, you'll pay manually every 30 days,
                      only when you're actively using it. And don't worry—we'll
                      remind you before your 30 days are up.
                    </p>
                  </div>
                </div>

                {/* Section 6: Vision */}
                <div className='flex gap-4'>
                  <div className='flex-shrink-0 mt-1'>
                    <div className='p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full'>
                      <Globe className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                    </div>
                  </div>
                  <div>
                    <p>
                      My vision for this extension goes beyond just enhancing
                      web browsing. I want to build a community of curious,
                      like-minded people who learn and grow together. Excited to
                      have you on board! 🚀
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className='mt-12 flex flex-col sm:flex-row gap-4 justify-center'>
                <Link href='https://www.learnoted.com/#contact'>
                  <button className='bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-md transition-colors'>
                    Add to Chrome
                  </button>
                </Link>
                <Link href='/pricing'>
                  <button className='border border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 px-8 py-4 text-lg rounded-md transition-colors bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/10'>
                    Learn More
                  </button>
                </Link>
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
