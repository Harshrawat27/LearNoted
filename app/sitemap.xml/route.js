// app/sitemap.xml/route.js
import { NextResponse } from 'next/server';
import { getAllPosts, getAllCategories } from '../lib/sanity-queries';

export async function GET() {
  // Base URL for your site
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.learnoted.com';

  // Current date in YYYY-MM-DD format
  const date = new Date().toISOString().split('T')[0];

  // List of static pages
  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: '1.0' },
    { url: '/pricing', changefreq: 'monthly', priority: '0.8' },
    { url: '/privacy-policy', changefreq: 'monthly', priority: '0.7' },
    { url: '/founders-letter', changefreq: 'yearly', priority: '0.6' },
    { url: '/auth/signin', changefreq: 'monthly', priority: '0.8' },
    { url: '/pro-plan', changefreq: 'monthly', priority: '0.9' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' }, // Add blog index page
  ];

  // Fetch all blog posts
  let blogPages = [];
  try {
    const posts = await getAllPosts();

    // Generate sitemap entries for individual blog posts
    blogPages = posts.map((post) => ({
      url: `/blog/${post.slug.current}`,
      changefreq: 'monthly',
      priority: '0.8',
      // Use post publishedAt date if available
      lastmod: post.publishedAt
        ? new Date(post.publishedAt).toISOString().split('T')[0]
        : date,
    }));

    // Fetch categories for category pages
    const categories = await getAllCategories();
    const categoryPages = categories
      .filter((category) => category && category.slug && category.slug.current)
      .map((category) => ({
        url: `/blog/category/${category.slug.current}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: date,
      }));

    // Add category pages to blog pages
    blogPages = [...blogPages, ...categoryPages];
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    // Continue with static pages if blog post fetching fails
  }

  // Combine static and blog pages
  const allPages = [...staticPages, ...blogPages];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || date}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  // Return XML with appropriate content type
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
