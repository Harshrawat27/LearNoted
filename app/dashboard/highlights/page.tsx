import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions'; // Adjust path
import dbConnect from '../../lib/dbConnect'; // Adjust path
import URLHighlight from '@/models/Highlight'; // Updated import
import HighlightsPageClient from './HighlightsPageClient';
import { Suspense } from 'react';
import HighlightsLoading from './loading';
import mongoose from 'mongoose';
import { formatAggregationResults } from '../../utils/highlightAdapter';

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

  // Fetch initial highlights using aggregation pipeline
  const aggregationPipeline = [
    // Match documents for this user
    { $match: { userEmail } } as mongoose.PipelineStage.Match,

    // Unwind the highlights array
    { $unwind: '$highlights' } as mongoose.PipelineStage.Unwind,

    // Sort by creation date
    { $sort: { 'highlights.createdAt': -1 } } as mongoose.PipelineStage.Sort,

    // Limit to first 20 highlights
    { $limit: 20 } as mongoose.PipelineStage.Limit,

    // Project to match the old format
    {
      $project: {
        _id: '$highlights._id',
        text: '$highlights.text',
        color: '$highlights.color',
        url: '$url', // URL is now at the parent level
        serialized: '$highlights.serialized',
        context: '$highlights.context',
        charOffsets: '$highlights.charOffsets',
        createdAt: '$highlights.createdAt',
      },
    } as mongoose.PipelineStage.Project,
  ];

  const initialHighlights = await URLHighlight.aggregate(aggregationPipeline);

  // Count total highlights
  const countPipeline = [
    { $match: { userEmail } } as mongoose.PipelineStage.Match,
    { $unwind: '$highlights' } as mongoose.PipelineStage.Unwind,
    { $count: 'total' } as mongoose.PipelineStage.Count,
  ];

  const countResult = await URLHighlight.aggregate(countPipeline);
  const totalHighlights = countResult.length > 0 ? countResult[0].total : 0;

  // Format the results to ensure they match the expected client format
  const formattedHighlights = formatAggregationResults(initialHighlights);

  return (
    <Suspense fallback={<HighlightsLoading />}>
      <HighlightsPageClient
        initialHighlights={JSON.parse(JSON.stringify(formattedHighlights))}
        totalCount={totalHighlights}
      />
    </Suspense>
  );
}
