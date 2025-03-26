// app/blog/category/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  getAllCategories,
  getPostsByCategory,
} from '../../../lib/sanity-queries';
import { urlFor } from '../../../lib/sanity';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Calendar, User, Tag, ChevronLeft } from 'lucide-react';

export const revalidate = 3600; // Revalidate this page every hour

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const categories = await getAllCategories();
  const category = categories.find((cat) => cat.slug.current === params.slug);

  if (!category) {
    return {
      title: 'Category Not Found | LearNoted Blog',
    };
  }

  return {
    title: `${category.title} | LearNoted Blog`,
    description:
      category.description ||
      `Browse all articles in the ${category.title} category`,
  };
}

// Generate static paths for all categories
export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((category) => ({
    slug: category.slug.current,
  }));
}

export default async function CategoryPage({ params }) {
  const categories = await getAllCategories();
  const category = categories.find((cat) => cat.slug.current === params.slug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(params.slug);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <Header />

        {/* Hero Section */}
        <section className='py-12 md:py-16'>
          <div className='mb-8'>
            <Link
              href='/blog'
              className='inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
            >
              <ChevronLeft className='h-4 w-4 mr-1' />
              Back to all posts
            </Link>
          </div>

          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            {category.title}
          </h1>
          {category.description && (
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8'>
              {category.description}
            </p>
          )}

          {/* Categories */}
          <div className='flex flex-wrap gap-2 mb-12'>
            <Link
              href='/blog'
              className='px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/blog/category/${cat.slug.current}`}
                className={`px-4 py-2 rounded-full transition-colors ${
                  cat.slug.current === params.slug
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </section>

        {/* Blog Posts */}
        <section className='py-8 md:py-12'>
          {posts.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {posts.map((post) => (
                <article
                  key={post._id}
                  className='bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]'
                >
                  <Link href={`/blog/${post.slug.current}`}>
                    <div className='relative w-full h-48'>
                      <Image
                        src={urlFor(post.mainImage).url()}
                        alt={post.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                  </Link>

                  <div className='p-6'>
                    {/* Categories */}
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {post.categories?.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/blog/category/${cat.slug.current}`}
                          className='inline-flex items-center text-xs font-medium text-purple-600 dark:text-purple-400'
                        >
                          <Tag className='h-3 w-3 mr-1' />
                          {cat.title}
                        </Link>
                      ))}
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug.current}`}>
                      <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors'>
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className='text-gray-600 dark:text-gray-300 mb-4 line-clamp-3'>
                      {post.excerpt}
                    </p>

                    {/* Post Meta */}
                    <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                      <span className='flex items-center mr-4'>
                        <User className='h-4 w-4 mr-1' />
                        {post.author.name}
                      </span>
                      <span className='flex items-center'>
                        <Calendar className='h-4 w-4 mr-1' />
                        {new Date(post.publishedAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                No posts found
              </h2>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                There are no posts in this category yet. Check back soon!
              </p>
              <Link
                href='/blog'
                className='inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
              >
                Browse all posts
              </Link>
            </div>
          )}
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
