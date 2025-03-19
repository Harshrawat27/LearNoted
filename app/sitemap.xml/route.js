// app/sitemap.xml/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  // Base URL for your site
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.learnoted.com';

  // Current date in YYYY-MM-DD format
  const date = new Date().toISOString().split('T')[0];

  // List of all pages
  const pages = [
    { url: '/', changefreq: 'weekly', priority: '1.0' },
    { url: '/pricing', changefreq: 'monthly', priority: '0.8' },
    { url: '/privacy-policy', changefreq: 'monthly', priority: '0.7' },
    { url: '/founders-letter', changefreq: 'yearly', priority: '0.6' },
    { url: '/auth/signin', changefreq: 'monthly', priority: '0.8' },
    { url: '/pro-plan', changefreq: 'monthly', priority: '0.9' },
  ];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${date}</lastmod>
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
