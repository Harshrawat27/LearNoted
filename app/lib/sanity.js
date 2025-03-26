// app/lib/sanity.js
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'hujl5zar', // Replace with your actual Sanity project ID
  dataset: 'production',
  apiVersion: '2023-05-03', // Use the latest API version
  useCdn: true, // Set to `false` for real-time data during development
});

// Helper function for generating image URLs
const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

// Helper function to prepare Sanity data for use with Next.js
export function prepareForClient(data) {
  if (!data) return null;

  // If it's an array, process each item
  if (Array.isArray(data)) {
    return data.map((item) => prepareForClient(item));
  }

  // If it's an object, convert _createdAt and _updatedAt to ISO strings
  if (typeof data === 'object' && data !== null) {
    const processed = {};

    Object.keys(data).forEach((key) => {
      if (key === '_createdAt' || key === '_updatedAt') {
        processed[key] = new Date(data[key]).toISOString();
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        processed[key] = prepareForClient(data[key]);
      } else {
        processed[key] = data[key];
      }
    });

    return processed;
  }

  return data;
}
