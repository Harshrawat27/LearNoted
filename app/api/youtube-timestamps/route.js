import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../lib/dbConnect';
import YouTubeTimestamp from '../../../models/YoutubeHighlight';

export async function POST(request) {
  try {
    // Extract token from Authorization header
    const authorization = request.headers.get('authorization');
    const token = authorization?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.sub) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Extract timestamp data from request body
    const { videoId, videoUrl, videoTitle, timestamp, formattedTime, comment } =
      await request.json();

    // Find existing document for the video and user
    let existingDoc = await YouTubeTimestamp.findOne({
      videoId,
      userId: decoded.sub,
    });

    if (existingDoc) {
      // Append new timestamp to the array
      existingDoc.timestamps = existingDoc.timestamps || [];
      existingDoc.timestamps.push({ timestamp, formattedTime, comment });
      await existingDoc.save();
    } else {
      // Create new document with the first timestamp
      const newTimestamp = new YouTubeTimestamp({
        videoId,
        videoUrl,
        videoTitle,
        userId: decoded.sub,
        timestamps: [{ timestamp, formattedTime, comment }],
      });
      await newTimestamp.save();
    }

    return NextResponse.json(
      { message: 'Timestamp saved successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving timestamp:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
