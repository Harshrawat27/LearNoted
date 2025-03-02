import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import dbConnect from '../../lib/dbConnect';
import { User } from '../../../models/User';
import { Video } from '../../../models/YoutubeHighlight';
import jwt from 'jsonwebtoken';

// Helper function to get the authenticated user from the request
async function getUserFromRequest(req) {
  let userEmail = null;

  // Check for JWT token in Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
      throw new Error('Invalid token', err);
    }
  }

  // Fallback to session if no token is provided
  if (!userEmail) {
    const session = await getServerSession(authOptions);
    if (session && session.user && session.user.email) {
      userEmail = session.user.email;
    }
  }

  if (!userEmail) {
    throw new Error('Unauthorized');
  }

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function GET(request) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Connect to database
  await dbConnect();

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const searchType = searchParams.get('searchType') || 'all';

  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
  }

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Build query based on search parameters
  let query = { userId };

  if (search) {
    if (searchType === 'all') {
      query.$or = [
        { channelName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { 'timestamps.comment': { $regex: search, $options: 'i' } },
      ];
    } else if (searchType === 'channel') {
      query.channelName = { $regex: search, $options: 'i' };
    } else if (searchType === 'title') {
      query.title = { $regex: search, $options: 'i' };
    } else if (searchType === 'comment') {
      query['timestamps.comment'] = { $regex: search, $options: 'i' };
    }
  }

  try {
    // Fetch highlights based on query
    const highlights = await Video.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Video.countDocuments(query);
    const hasMore = skip + highlights.length < totalCount;

    return NextResponse.json({
      highlights,
      hasMore,
      total: totalCount,
    });
  } catch (error) {
    console.error('Error fetching YouTube highlights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube highlights' },
      { status: 500 }
    );
  }
}

// Handle POST requests to save a new timestamp
export async function POST(req) {
  await dbConnect();

  try {
    const user = await getUserFromRequest(req);

    const body = await req.json();
    const { videoId, videoTitle, time, comment, channelName } = body;

    if (!videoId || time === undefined || !comment) {
      return NextResponse.json(
        { error: 'videoId, time, and comment are required' },
        { status: 400 }
      );
    }

    // Find or create the video for this user
    let video = await Video.findOne({ videoId, userId: user._id });
    if (!video) {
      video = new Video({
        videoId,
        title: videoTitle || '',
        userId: user._id,
        channelName: channelName || '',
        timestamps: [],
      });
    }

    // Add the new timestamp
    video.timestamps.push({ time, comment });
    await video.save();

    return NextResponse.json(
      { success: true, data: video.timestamps[video.timestamps.length - 1] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving timestamp:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
