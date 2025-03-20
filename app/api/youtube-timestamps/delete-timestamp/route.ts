// app/api/youtube-timestamps/delete-timestamp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions'; // Adjust path as needed
import dbConnect from '../../../lib/dbConnect'; // Adjust path as needed
import { Video } from '@/models/YoutubeHighlight'; // Adjust path as needed
import { User } from '@/models/User'; // Adjust path as needed

export async function DELETE(request: NextRequest) {
  try {
    // 1. Get the session (authenticate the user)
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to delete timestamps' },
        { status: 401 }
      );
    }

    // 2. Connect to the database
    await dbConnect();

    // 3. Get user from DB
    const userDoc = await User.findOne({ email: session.user.email });
    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // 4. Parse the request body
    const { videoId, timestampId } = await request.json();

    if (!videoId || !timestampId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 5. Find the video and verify ownership
    const videoDoc = await Video.findOne({
      _id: videoId,
      userId: userDoc._id.toString(),
    });

    if (!videoDoc) {
      return NextResponse.json(
        { error: 'Video not found or you do not have permission to modify it' },
        { status: 404 }
      );
    }

    // 6. Remove the timestamp
    const timestampIndex = videoDoc.timestamps.findIndex(
      (ts: any) => ts._id.toString() === timestampId
    );

    if (timestampIndex === -1) {
      return NextResponse.json(
        { error: 'Timestamp not found' },
        { status: 404 }
      );
    }

    // Remove the timestamp from the array
    videoDoc.timestamps.splice(timestampIndex, 1);

    // Save the updated document
    await videoDoc.save();

    return NextResponse.json(
      { message: 'Timestamp deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting timestamp:', error);
    return NextResponse.json(
      { error: 'Failed to delete timestamp' },
      { status: 500 }
    );
  }
}
