import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import dbConnect from '../../lib/dbConnect';
import URLHighlight from '../../../models/Highlight';
import jwt from 'jsonwebtoken';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  await dbConnect();

  let userEmail = null;
  const authHeader = req.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
      return NextResponse.json(
        { error: `Invalid token ${err}` },
        { status: 401, headers: corsHeaders }
      );
    }
  }

  if (!userEmail) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userEmail = session.user.email;
    }
  }

  if (!userEmail) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const url = body.url;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if this is a special action to remove all highlights
    if (body.action === 'removeAllHighlights' && url) {
      // Find the URL record
      const result = await URLHighlight.deleteOne({
        userEmail,
        url,
      });

      return NextResponse.json(
        {
          message: 'All highlights removed',
          count: result.deletedCount > 0 ? 1 : 0,
        },
        { headers: corsHeaders }
      );
    }

    // Create highlight item with all fields
    const newHighlight = {
      text: body.text,
      color: body.color,
      serialized: body.serialized || '',
      context: body.context || '',
      charOffsets: body.charOffsets || null,
      createdAt: new Date(),
    };

    // Find or create the URL record
    let urlRecord = await URLHighlight.findOne({
      userEmail,
      url,
    });

    if (!urlRecord) {
      urlRecord = new URLHighlight({
        userEmail,
        url,
        highlights: [newHighlight],
      });
    } else {
      urlRecord.highlights.push(newHighlight);
    }

    await urlRecord.save();

    // Return the newly created highlight item
    return NextResponse.json(newHighlight, { headers: corsHeaders });
  } catch (error) {
    console.error('Highlight creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create highlight' },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function GET(req) {
  await dbConnect();

  let userEmail = null;
  const authHeader = req.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
      return NextResponse.json(
        { error: `Invalid token ${err}` },
        { status: 401, headers: corsHeaders }
      );
    }
  }

  if (!userEmail) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userEmail = session.user.email;
    }
  }

  if (!userEmail) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: corsHeaders }
    );
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const search = url.searchParams.get('search') || '';
  const searchType = url.searchParams.get('searchType') || 'all';
  const urlFilter = url.searchParams.get('url') || '';

  try {
    let aggregationPipeline = [];

    // Match stage - filter by userEmail
    let matchStage = { userEmail };

    // If exact URL is provided, add it to the match
    if (urlFilter) {
      matchStage.url = urlFilter;
    }

    aggregationPipeline.push({ $match: matchStage });

    // Apply search based on searchType (if not filtered by exact URL)
    if (search && !urlFilter) {
      let searchMatch = {};

      if (searchType === 'domain' || searchType === 'all') {
        searchMatch.url = { $regex: search, $options: 'i' };
      }

      if (Object.keys(searchMatch).length > 0) {
        aggregationPipeline.push({ $match: searchMatch });
      }
    }

    // Unwind the highlights array
    aggregationPipeline.push({ $unwind: '$highlights' });

    // Apply text search if needed
    if (search && (searchType === 'text' || searchType === 'all')) {
      aggregationPipeline.push({
        $match: {
          $or: [
            { 'highlights.text': { $regex: search, $options: 'i' } },
            { 'highlights.context': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    // Sort by createdAt
    aggregationPipeline.push({ $sort: { 'highlights.createdAt': -1 } });

    // Skip and limit for pagination
    const skip = (page - 1) * limit;
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: limit });

    // Project to reshape the output to match the original format
    aggregationPipeline.push({
      $project: {
        _id: '$highlights._id',
        text: '$highlights.text',
        color: '$highlights.color',
        url: 1,
        serialized: '$highlights.serialized',
        context: '$highlights.context',
        charOffsets: '$highlights.charOffsets',
        createdAt: '$highlights.createdAt',
        userEmail: 1,
      },
    });

    // Execute the aggregation
    const highlights = await URLHighlight.aggregate(aggregationPipeline);

    // Count total documents for pagination
    let countPipeline = [{ $match: matchStage }, { $unwind: '$highlights' }];

    // Add any additional filters for text search
    if (
      search &&
      (searchType === 'text' || searchType === 'all') &&
      !urlFilter
    ) {
      countPipeline.push({
        $match: {
          $or: [
            { 'highlights.text': { $regex: search, $options: 'i' } },
            { 'highlights.context': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    countPipeline.push({ $count: 'total' });
    const countResult = await URLHighlight.aggregate(countPipeline);

    const total = countResult.length > 0 ? countResult[0].total : 0;
    const hasMore = skip + highlights.length < total;

    return NextResponse.json(
      {
        highlights: JSON.parse(JSON.stringify(highlights)),
        hasMore,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Highlight fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch highlights' },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function DELETE(req) {
  await dbConnect();

  let userEmail = null;
  const authHeader = req.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
      return NextResponse.json(
        { error: `Invalid token ${err}` },
        { status: 401, headers: corsHeaders }
      );
    }
  }

  if (!userEmail) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userEmail = session.user.email;
    }
  }

  if (!userEmail) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: corsHeaders }
    );
  }

  const url = new URL(req.url);
  const urlFilter = url.searchParams.get('url') || '';
  const highlightId = url.searchParams.get('id') || '';

  if (!urlFilter && !highlightId) {
    return NextResponse.json(
      { error: 'URL or highlight ID parameter is required' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    if (urlFilter) {
      // Delete all highlights for this URL
      const result = await URLHighlight.deleteOne({
        userEmail,
        url: urlFilter,
      });

      return NextResponse.json(
        { message: 'Highlights removed', count: result.deletedCount },
        { headers: corsHeaders }
      );
    } else if (highlightId) {
      // Delete a specific highlight by ID
      const urlRecord = await URLHighlight.findOne({
        userEmail,
        'highlights._id': highlightId,
      });

      if (urlRecord) {
        const originalLength = urlRecord.highlights.length;
        urlRecord.highlights = urlRecord.highlights.filter(
          (h) => h._id.toString() !== highlightId
        );

        // If no highlights remain, remove the entire URL record
        if (urlRecord.highlights.length === 0) {
          await URLHighlight.deleteOne({ _id: urlRecord._id });
        } else {
          // Otherwise save the updated URL record
          await urlRecord.save();
        }

        return NextResponse.json(
          {
            message: 'Highlight removed',
            count: originalLength - urlRecord.highlights.length,
          },
          { headers: corsHeaders }
        );
      }

      return NextResponse.json(
        { message: 'No highlight found with this ID', count: 0 },
        { headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Highlight delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete highlights' },
      { status: 400, headers: corsHeaders }
    );
  }
}
