// app/blog/author/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { client } from '../../../lib/sanity';
import { urlFor } from '../../../lib/sanity';
import { groq } from 'next-sanity';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Calendar, User, Tag, ChevronLeft } from 'lucide-react';
import { PortableText } from '@portabletext/react';

export const revalidate = 3600; // Revalidate this page every hour

// Get an author by slug with their posts
async function getAuthorWithPosts(slug) {
  return await client.fetch(
    groq`{
      "author": *[_type == "author" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        image,
        bio
      },
      "posts": *[_type == "post" && author->slug.current == $slug] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        publishedAt,
        categories[]->{_id, title, slug}
      }
    }`,
    { slug }
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { author } = await getAuthorWithPosts(params.slug);

  if (!author) {
    return {
      title: 'Author Not Found | LearNoted Blog',
    };
  }

  return {
    title: `${author.name} | LearNoted Blog`,
    description: `Read articles written by ${author.name}`,
  };
}

export default async function AuthorPage({ params }) {
  const { author, posts } = await getAuthorWithPosts(params.slug);

  if (!author) {
    notFound();
  }

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

          {/* Author profile */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 mb-12'>
            <div className='flex flex-col md:flex-row md:items-center gap-6'>
              {author.image && (
                <div className='flex-shrink-0'>
                  <Image
                    src={urlFor(author.image).width(160).height(160).url()}
                    alt={author.name}
                    width={160}
                    height={160}
                    className='rounded-full'
                  />
                </div>
              )}

              <div className='flex-grow'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                  {author.name}
                </h1>

                {author.bio && (
                  <div className='text-gray-700 dark:text-gray-300 prose dark:prose-invert'>
                    <PortableText
                      value={author.bio}
                      components={{
                        block: {
                          normal: ({ children }) => (
                            <p className='mb-3'>{children}</p>
                          ),
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-8'>
            Articles by {author.name}
          </h2>
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
                      {post.categories?.map((category) => (
                        <Link
                          key={category._id}
                          href={`/blog/category/${category.slug.current}`}
                          className='inline-flex items-center text-xs font-medium text-purple-600 dark:text-purple-400'
                        >
                          <Tag className='h-3 w-3 mr-1' />
                          {category.title}
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
                {author.name} hasn't published any articles yet. Check back
                soon!
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
