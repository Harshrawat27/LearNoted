// app/lib/sanity-queries.js
import { groq } from 'next-sanity';
import { client, prepareForClient } from './sanity';

// Get all blog posts with author and categories
export async function getAllPosts() {
  const posts = await client.fetch(
    groq`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{_id, name, slug},
      categories[]->{_id, title, slug}
    }`
  );

  return prepareForClient(posts);
}

// Get a single blog post by slug
export async function getPostBySlug(slug) {
  const post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      body,
      publishedAt,
      author->{_id, name, slug, image, bio},
      categories[]->{_id, title, slug}
    }`,
    { slug }
  );

  return prepareForClient(post);
}

// Get posts by category slug
export async function getPostsByCategory(categorySlug) {
  const posts = await client.fetch(
    groq`*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{_id, name, slug},
      categories[]->{_id, title, slug}
    }`,
    { categorySlug }
  );

  return prepareForClient(posts);
}

// Get all categories
export async function getAllCategories() {
  const categories = await client.fetch(
    groq`*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`
  );

  return prepareForClient(categories);
}

// Get recent posts (useful for sidebars, related content)
export async function getRecentPosts(limit = 3) {
  const posts = await client.fetch(
    groq`*[_type == "post"] | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      slug,
      publishedAt,
      mainImage
    }`,
    { limit: limit - 1 }
  );

  return prepareForClient(posts);
}

// Get featured posts (posts that are marked as featured)
export async function getFeaturedPosts() {
  const posts = await client.fetch(
    groq`*[_type == "post" && featured == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{_id, name, slug},
      categories[]->{_id, title, slug}
    }`
  );

  return prepareForClient(posts);
}

// Search posts
export async function searchPosts(searchTerm) {
  const posts = await client.fetch(
    groq`*[_type == "post" && (
      title match $searchTerm || 
      excerpt match $searchTerm ||
      pt::text(body) match $searchTerm
    )] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{_id, name, slug},
      categories[]->{_id, title, slug}
    }`,
    { searchTerm: `*${searchTerm}*` }
  );

  return prepareForClient(posts);
}

// Get related posts (same category and different from current post)
export async function getRelatedPosts(postId, categoryIds = [], limit = 3) {
  if (!categoryIds.length) return [];

  const posts = await client.fetch(
    groq`*[_type == "post" && _id != $postId && count((categories[]->_id) match $categoryIds) > 0] | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      slug,
      mainImage,
      publishedAt
    }`,
    {
      postId,
      categoryIds,
      limit: limit - 1,
    }
  );

  return prepareForClient(posts);
}
