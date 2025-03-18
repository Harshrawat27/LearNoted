import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import dbConnect from '../../lib/dbConnect';
import DomainHighlight from '../../../models/DomainHighlight';
import jwt from 'jsonwebtoken';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin',
  'Access-Control-Allow-Credentials': 'true',
};

// Helper function to extract domain from URL
function extractDomain(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    console.error('Error extracting domain:', error);
    return url; // Fallback to the whole URL if parsing fails
  }
}

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

    const domain = extractDomain(url);

    // Check if this is a special action to remove all highlights
    if (body.action === 'removeAllHighlights' && url) {
      // Find the domain record and remove all highlights for the specific URL
      const domainRecord = await DomainHighlight.findOne({
        userEmail,
        domain,
      });

      if (domainRecord) {
        // Filter out highlights with the matching URL
        const originalCount = domainRecord.highlights.length;
        domainRecord.highlights = domainRecord.highlights.filter(
          (h) => h.url !== url
        );

        // If no highlights remain, remove the entire domain record
        if (domainRecord.highlights.length === 0) {
          await DomainHighlight.deleteOne({ _id: domainRecord._id });
          return NextResponse.json(
            { message: 'All highlights removed', count: originalCount },
            { headers: corsHeaders }
          );
        } else {
          // Otherwise save the updated domain record
          await domainRecord.save();
          return NextResponse.json(
            {
              message: 'All highlights removed for URL',
              count: originalCount - domainRecord.highlights.length,
            },
            { headers: corsHeaders }
          );
        }
      }

      return NextResponse.json(
        { message: 'No highlights found to remove', count: 0 },
        { headers: corsHeaders }
      );
    }

    // Create highlight item with all fields
    const newHighlight = {
      text: body.text,
      color: body.color,
      url: url,
      serialized: body.serialized || '',
      context: body.context || '',
      charOffsets: body.charOffsets || null,
      createdAt: new Date(),
    };

    // Find or create the domain record
    let domainRecord = await DomainHighlight.findOne({
      userEmail,
      domain,
    });

    if (!domainRecord) {
      domainRecord = new DomainHighlight({
        userEmail,
        domain,
        highlights: [newHighlight],
      });
    } else {
      domainRecord.highlights.push(newHighlight);
    }

    await domainRecord.save();

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
    aggregationPipeline.push({ $match: matchStage });

    // Unwind the highlights array
    aggregationPipeline.push({ $unwind: '$highlights' });

    // Filter highlights based on search criteria
    if (search || urlFilter) {
      let highlightMatch = {};

      if (urlFilter) {
        highlightMatch['highlights.url'] = urlFilter;
      }

      if (search) {
        if (searchType === 'domain') {
          highlightMatch['domain'] = { $regex: search, $options: 'i' };
        } else if (searchType === 'text') {
          highlightMatch['$or'] = [
            { 'highlights.text': { $regex: search, $options: 'i' } },
            { 'highlights.context': { $regex: search, $options: 'i' } },
          ];
        } else if (searchType === 'all') {
          highlightMatch['$or'] = [
            { domain: { $regex: search, $options: 'i' } },
            { 'highlights.url': { $regex: search, $options: 'i' } },
            { 'highlights.text': { $regex: search, $options: 'i' } },
            { 'highlights.context': { $regex: search, $options: 'i' } },
          ];
        }
      }

      if (Object.keys(highlightMatch).length > 0) {
        aggregationPipeline.push({ $match: highlightMatch });
      }
    }

    // Sort by createdAt
    aggregationPipeline.push({ $sort: { 'highlights.createdAt': -1 } });

    // Skip and limit for pagination
    const skip = (page - 1) * limit;
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: limit });

    // Project to reshape the output
    aggregationPipeline.push({
      $project: {
        _id: '$highlights._id',
        text: '$highlights.text',
        color: '$highlights.color',
        url: '$highlights.url',
        serialized: '$highlights.serialized',
        context: '$highlights.context',
        charOffsets: '$highlights.charOffsets',
        createdAt: '$highlights.createdAt',
        domain: 1,
        userEmail: 1,
      },
    });

    // Execute the aggregation
    const highlights = await DomainHighlight.aggregate(aggregationPipeline);

    // Count total documents for pagination
    let countPipeline = [{ $match: matchStage }, { $unwind: '$highlights' }];

    if (aggregationPipeline.length > 2) {
      // Add any filtering match stages from the main pipeline
      countPipeline.push(aggregationPipeline[2]);
    }

    countPipeline.push({ $count: 'total' });
    const countResult = await DomainHighlight.aggregate(countPipeline);

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
      const domain = extractDomain(urlFilter);

      // Find the domain record
      const domainRecord = await DomainHighlight.findOne({
        userEmail,
        domain,
      });

      if (domainRecord) {
        // Filter out highlights with the matching URL
        const originalCount = domainRecord.highlights.length;
        domainRecord.highlights = domainRecord.highlights.filter(
          (h) => h.url !== urlFilter
        );

        // If no highlights remain, remove the entire domain record
        if (domainRecord.highlights.length === 0) {
          await DomainHighlight.deleteOne({ _id: domainRecord._id });
        } else {
          // Otherwise save the updated domain record
          await domainRecord.save();
        }

        return NextResponse.json(
          {
            message: 'Highlights removed',
            count: originalCount - domainRecord.highlights.length,
          },
          { headers: corsHeaders }
        );
      }

      return NextResponse.json(
        { message: 'No highlights found to remove', count: 0 },
        { headers: corsHeaders }
      );
    } else if (highlightId) {
      // Find the highlight by ID and remove it
      let removed = 0;

      // We need to iterate through all domain records and remove the highlight with matching ID
      const domains = await DomainHighlight.find({ userEmail });

      for (const domain of domains) {
        const originalLength = domain.highlights.length;
        domain.highlights = domain.highlights.filter(
          (h) => h._id.toString() !== highlightId
        );

        if (domain.highlights.length < originalLength) {
          // We found and removed the highlight
          removed = originalLength - domain.highlights.length;

          // If no highlights remain, remove the entire domain record
          if (domain.highlights.length === 0) {
            await DomainHighlight.deleteOne({ _id: domain._id });
          } else {
            // Otherwise save the updated domain record
            await domain.save();
          }

          break;
        }
      }

      return NextResponse.json(
        { message: 'Highlight removed', count: removed },
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
