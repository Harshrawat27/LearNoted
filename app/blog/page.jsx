// app/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getAllCategories } from '../lib/sanity-queries';
import { urlFor } from '../lib/sanity';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Calendar, User, Tag } from 'lucide-react';

export const revalidate = 3600; // Revalidate this page every hour

export default async function BlogPage() {
  const posts = (await getAllPosts()) || [];
  const categories = (await getAllCategories()) || [];

  // Filter out any categories that don't have a valid slug
  const validCategories = categories.filter(
    (category) => category && category.slug && category.slug.current
  );

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <Header />

        {/* Hero Section */}
        <section className='py-12 md:py-16 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            LearNoted Blog
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8'>
            Tips, tutorials, and insights about learning, productivity, and
            getting the most out of LearNoted
          </p>

          {/* Categories */}
          <div className='flex flex-wrap justify-center gap-2 mb-12'>
            <Link
              href='/blog'
              className='px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors'
            >
              All
            </Link>
            {validCategories.map((category) => (
              <Link
                key={category._id}
                href={`/blog/category/${category.slug.current}`}
                className='px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
              >
                {category.title || 'Untitled Category'}
              </Link>
            ))}
          </div>
        </section>

        {/* Blog Posts */}
        <section className='py-8 md:py-12'>
          {posts.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {posts.map((post) => {
                // Skip rendering posts with missing required data
                if (
                  !post ||
                  !post.slug ||
                  !post.slug.current ||
                  !post.mainImage
                ) {
                  return null;
                }

                return (
                  <article
                    key={post._id}
                    className='bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]'
                  >
                    <Link href={`/blog/${post.slug.current}`}>
                      <div className='relative w-full h-48'>
                        <Image
                          src={urlFor(post.mainImage).url()}
                          alt={post.title || 'Blog post'}
                          fill
                          className='object-cover'
                        />
                      </div>
                    </Link>

                    <div className='p-6'>
                      {/* Categories */}
                      <div className='flex flex-wrap gap-2 mb-3'>
                        {post.categories
                          ?.filter((cat) => cat && cat.slug && cat.slug.current)
                          .map((category) => (
                            <Link
                              key={category._id}
                              href={`/blog/category/${category.slug.current}`}
                              className='inline-flex items-center text-xs font-medium text-purple-600 dark:text-purple-400'
                            >
                              <Tag className='h-3 w-3 mr-1' />
                              {category.title || 'Untitled Category'}
                            </Link>
                          ))}
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.slug.current}`}>
                        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors'>
                          {post.title || 'Untitled Post'}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      {/* <p className='text-gray-600 dark:text-gray-300 mb-4 line-clamp-3'>
                        {post.excerpt || 'No excerpt available'}
                      </p> */}

                      {/* Post Meta */}
                      <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                        {post.author && (
                          <span className='flex items-center mr-4'>
                            <User className='h-4 w-4 mr-1' />
                            {post.author.name || 'Unknown Author'}
                          </span>
                        )}
                        <span className='flex items-center'>
                          <Calendar className='h-4 w-4 mr-1' />
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )
                            : 'No date'}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                No posts found
              </h2>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                There are no blog posts available yet. Check back soon!
              </p>
            </div>
          )}
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
