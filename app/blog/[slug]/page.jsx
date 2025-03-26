// app/blog/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '../../lib/sanity-queries';
import { urlFor } from '../../lib/sanity';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ShareButton from './ShareButton'; // Import the client component
import { Calendar, User, Tag, ChevronLeft } from 'lucide-react';
import { PortableText } from '@portabletext/react';

export const revalidate = 3600; // Revalidate this page every hour

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | LearNoted Blog',
    };
  }

  return {
    title: `${post.title} | LearNoted Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | LearNoted Blog`,
      description: post.excerpt,
      images: post.mainImage
        ? [
            {
              url: urlFor(post.mainImage).width(1200).height(630).url(),
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
  };
}

// Define components for the Portable Text renderer
const myPortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value) return null;
      return (
        <div className='my-8 relative'>
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || 'Blog post image'}
            width={800}
            height={500}
            className='rounded-xl mx-auto'
          />
          {value.caption && (
            <div className='text-center text-gray-500 dark:text-gray-400 mt-2 italic text-sm'>
              {value.caption}
            </div>
          )}
        </div>
      );
    },
    code: ({ value }) => {
      if (!value) return null;
      return (
        <div className='my-6 rounded-xl overflow-hidden'>
          {value.filename && (
            <div className='bg-gray-800 px-4 py-2 text-gray-200 text-sm font-mono'>
              {value.filename}
            </div>
          )}
          <pre className='bg-gray-900 text-gray-100 p-4 overflow-x-auto'>
            <code className='block whitespace-pre font-mono text-sm'>
              {value.code}
            </code>
          </pre>
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className='text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white'>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className='text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white'>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className='text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white'>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className='text-lg font-bold mt-6 mb-3 text-gray-900 dark:text-white'>
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className='mb-4 text-gray-700 dark:text-gray-300 leading-relaxed'>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className='border-l-4 border-purple-500 pl-4 py-1 my-6 italic text-gray-600 dark:text-gray-300'>
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      if (!value?.href) return children;
      const rel = value.href.startsWith('/')
        ? undefined
        : 'noreferrer noopener';
      return (
        <a
          href={value.href}
          rel={rel}
          className='text-purple-600 dark:text-purple-400 hover:underline'
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className='bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm'>
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className='list-disc ml-6 mb-6 space-y-2'>{children}</ul>
    ),
    number: ({ children }) => (
      <ol className='list-decimal ml-6 mb-6 space-y-2'>{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className='text-gray-700 dark:text-gray-300'>{children}</li>
    ),
    number: ({ children }) => (
      <li className='text-gray-700 dark:text-gray-300'>{children}</li>
    ),
  },
};

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Format the publication date
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'No date';

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <Header />

        <main className='py-12'>
          {/* Back button */}
          <div className='mb-8'>
            <Link
              href='/blog'
              className='inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
            >
              <ChevronLeft className='h-4 w-4 mr-1' />
              Back to all posts
            </Link>
          </div>

          {/* Article header */}
          <article className='max-w-4xl mx-auto'>
            <header className='mb-10'>
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-4'>
                  {post.categories
                    .filter(
                      (category) =>
                        category && category.slug && category.slug.current
                    )
                    .map((category) => (
                      <Link
                        key={category._id}
                        href={`/blog/category/${category.slug.current}`}
                        className='px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-sm hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors'
                      >
                        {category.title || 'Untitled Category'}
                      </Link>
                    ))}
                </div>
              )}

              {/* Title */}
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
                {post.title || 'Untitled Post'}
              </h1>

              {/* Meta information */}
              <div className='flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-8'>
                {/* Author with image */}
                {post.author && (
                  <div className='flex items-center mr-6 mb-2'>
                    <div className='w-10 h-10 rounded-full overflow-hidden mr-2'>
                      {post.author.image ? (
                        <Image
                          src={urlFor(post.author.image)
                            .width(80)
                            .height(80)
                            .url()}
                          alt={post.author.name || 'Author'}
                          width={40}
                          height={40}
                          className='object-cover'
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                          <User className='h-6 w-6 text-gray-500' />
                        </div>
                      )}
                    </div>
                    {post.author.slug && post.author.slug.current ? (
                      <Link
                        href={`/blog/author/${post.author.slug.current}`}
                        className='hover:text-purple-600 dark:hover:text-purple-400 transition-colors'
                      >
                        {post.author.name || 'Unknown Author'}
                      </Link>
                    ) : (
                      <span>{post.author.name || 'Unknown Author'}</span>
                    )}
                  </div>
                )}

                {/* Date */}
                <div className='flex items-center mr-6 mb-2'>
                  <Calendar className='h-4 w-4 mr-1' />
                  {formattedDate}
                </div>

                {/* Share button - now using client component */}
                <ShareButton title={post.title} excerpt={post.excerpt} />
              </div>

              {/* Featured Image */}
              {post.mainImage && (
                <div className='relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8'>
                  <Image
                    src={urlFor(post.mainImage).width(1200).url()}
                    alt={post.title || 'Blog post image'}
                    fill
                    className='object-cover'
                    priority
                  />
                </div>
              )}
            </header>

            {/* Article content */}
            <div className='prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300'>
              {post.body ? (
                <PortableText
                  value={post.body}
                  components={myPortableTextComponents}
                />
              ) : (
                <p className='text-gray-600 dark:text-gray-400'>
                  No content available for this post.
                </p>
              )}
            </div>

            {/* Author bio */}
            {post.author && post.author.bio && (
              <div className='mt-16 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md'>
                <div className='flex items-start'>
                  {post.author.image && (
                    <div className='flex-shrink-0 mr-4'>
                      <Image
                        src={urlFor(post.author.image)
                          .width(100)
                          .height(100)
                          .url()}
                        alt={post.author.name || 'Author'}
                        width={80}
                        height={80}
                        className='rounded-full'
                      />
                    </div>
                  )}
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
                      About {post.author.name || 'the Author'}
                    </h3>
                    <div className='text-gray-700 dark:text-gray-300'>
                      <PortableText
                        value={post.author.bio}
                        components={{
                          block: {
                            normal: ({ children }) => (
                              <p className='mb-3'>{children}</p>
                            ),
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>
        </main>

        <Footer />
      </div>
    </div>
  );
}
