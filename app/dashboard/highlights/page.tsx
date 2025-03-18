import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions'; // Adjust path
import dbConnect from '../../lib/dbConnect'; // Adjust path
import URLHighlight from '@/models/Highlight'; // Updated import
import HighlightsPageClient from './HighlightsPageClient';
import { Suspense } from 'react';
import HighlightsLoading from './loading';
import mongoose from 'mongoose';

// Define a type for the highlight from MongoDB
interface RawHighlight {
  _id: mongoose.Types.ObjectId | string;
  text: string;
  color: string;
  serialized?: string;
  context?: string;
  charOffsets?: Record<string, unknown>;
  createdAt: Date;
  [key: string]: unknown; // For any additional properties
}

// Define the formatted highlight interface
interface FormattedHighlight {
  _id: string;
  text: string;
  color: string;
  context: string;
  url: string;
  createdAt: string;
  serialized: string;
  charOffsets: Record<string, unknown> | null;
}

export default async function HighlightsPage() {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/api/auth/signin');
  }

  // Connect to the database
  await dbConnect();

  const userEmail = session.user?.email;
  if (!userEmail) {
    throw new Error('User email not found in session');
  }

  // Fetch all URL documents (which will show in the left panel)
  const urlDocuments = await URLHighlight.find({ userEmail })
    .select('url updatedAt highlights')
    .lean();

  // Format the data for the client
  const urlSummaries = urlDocuments
    .map((doc) => {
      return {
        url: doc.url,
        title: extractTitle(doc.url),
        totalHighlights: doc.highlights.length,
        lastUpdated: doc.updatedAt || getLatestDate(doc.highlights),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );

  // For the first URL, get all its highlights
  const initialHighlights =
    urlDocuments.length > 0
      ? urlDocuments[0].highlights.map((highlight: RawHighlight) => ({
          ...highlight,
          url: urlDocuments[0].url,
        }))
      : [];

  // Format the highlights for the client
  const formattedHighlights = formatHighlightsWithUrl(initialHighlights);

  // Use a serializable version for the client
  const serializableData = JSON.parse(
    JSON.stringify({
      urlSummaries,
      initialHighlights: formattedHighlights,
      initialUrl: urlDocuments.length > 0 ? urlDocuments[0].url : null,
    })
  );

  return (
    <Suspense fallback={<HighlightsLoading />}>
      <HighlightsPageClient
        urlSummaries={serializableData.urlSummaries}
        initialHighlights={serializableData.initialHighlights}
        initialUrl={serializableData.initialUrl}
      />
    </Suspense>
  );
}

// Helper functions
function extractTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

function getLatestDate(highlights: RawHighlight[]): Date {
  if (highlights.length === 0) return new Date();

  return highlights.reduce((latest, highlight) => {
    const date = new Date(highlight.createdAt);
    return date > latest ? date : latest;
  }, new Date(0));
}

// Define the formatted highlight interface
interface FormattedHighlight {
  _id: string;
  text: string;
  color: string;
  context: string;
  url: string;
  createdAt: string;
  serialized: string;
  charOffsets: Record<string, unknown> | null;
}

function formatHighlightsWithUrl(
  highlights: RawHighlight[]
): FormattedHighlight[] {
  return highlights.map((h) => ({
    _id: h._id.toString(),
    text: h.text || '',
    color: h.color || 'yellow',
    context: h.context || '',
    url: (h.url as string) || '',
    createdAt: h.createdAt
      ? new Date(h.createdAt).toISOString()
      : new Date().toISOString(),
    serialized: h.serialized || '',
    charOffsets: (h.charOffsets as Record<string, unknown>) || null,
  }));
}
