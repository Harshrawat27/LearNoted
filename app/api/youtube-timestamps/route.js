// app/api/timestamps/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Video } from '@/models/Timestamp';

// GET all timestamps (across all videos)
export async function GET() {
  await dbConnect();

  try {
    const videos = await Video.find({});
    let allTimestamps = [];

    videos.forEach((video) => {
      video.timestamps.forEach((timestamp) => {
        allTimestamps.push({
          videoId: video.videoId,
          timestamp: timestamp,
        });
      });
    });

    return NextResponse.json(
      { success: true, data: allTimestamps },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// POST a new timestamp
export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { videoId, videoTitle, time, comment } = body;

    if (!videoId || time === undefined || !comment) {
      return NextResponse.json(
        {
          success: false,
          error: 'VideoId, time, and comment are required',
        },
        { status: 400 }
      );
    }

    // Find video or create if it doesn't exist
    let video = await Video.findOne({ videoId });

    if (!video) {
      video = new Video({
        videoId,
        title: videoTitle || '',
        timestamps: [],
      });
    }

    // Add new timestamp to the video
    video.timestamps.push({
      time,
      comment,
    });

    await video.save();

    return NextResponse.json(
      {
        success: true,
        data: video.timestamps[video.timestamps.length - 1],
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
