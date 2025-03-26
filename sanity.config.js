// sanity.config.js
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'LearNoted Blog',

  projectId: 'hujl5zar', // Replace with your Sanity project ID
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});

// lib/sanity.js
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'hujl5zar', // Replace with your Sanity project ID
  dataset: 'production',
  apiVersion: '2023-05-03', // Use the latest API version
  useCdn: true, // Set to `false` to bypass the edge cache
});

// Helper function for generating image URLs
const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

// lib/sanity-queries.js
import { groq } from 'next-sanity';
import { client } from './sanity';

// Get all blog posts with author and categories
export async function getAllPosts() {
  return await client.fetch(
    groq`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{name, slug},
      categories[]->{title, slug}
    }`
  );
}

// Get a single blog post by slug
export async function getPostBySlug(slug) {
  return await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      body,
      publishedAt,
      author->{name, slug, image, bio},
      categories[]->{title, slug}
    }`,
    { slug }
  );
}

// Get posts by category slug
export async function getPostsByCategory(categorySlug) {
  return await client.fetch(
    groq`*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{name, slug},
      categories[]->{title, slug}
    }`,
    { categorySlug }
  );
}

// Get all categories
export async function getAllCategories() {
  return await client.fetch(
    groq`*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`
  );
}
