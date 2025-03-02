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

// Handle GET requests to fetch timestamps for a video
export async function GET(req) {
  await dbConnect();

  try {
    const user = await getUserFromRequest(req);

    // Get videoId from query parameters
    const videoId = req.nextUrl.searchParams.get('videoId');
    if (!videoId) {
      return NextResponse.json(
        { error: 'videoId is required' },
        { status: 400 }
      );
    }

    // Fetch the video for this user and videoId
    const video = await Video.findOne({ videoId, userId: user._id });
    const timestamps = video ? video.timestamps : [];

    return NextResponse.json(
      { success: true, data: { timestamps } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching timestamps:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
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
