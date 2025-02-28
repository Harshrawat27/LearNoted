import jwt from 'jsonwebtoken';
import dbConnect from '../../lib/dbConnect'; // Adjust path based on your project structure
import YoutubeHighlight from '../../../models/YoutubeHighlight'; // Adjust path based on your project structure

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract token from Authorization header
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.sub && !decoded.id) {
      return new Response(JSON.stringify({ error: 'Invalid token payload' }), {
        status: 401,
      });
    }

    const userId = decoded.sub || decoded.id; // Adjust based on your token structure

    // Extract data from request body
    const body = await request.json();
    const { videoUrl, timestamp, comment } = body;
    if (!videoUrl || !timestamp || !comment) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Create and save the highlight
    const highlight = new YoutubeHighlight({
      videoUrl,
      timestamp,
      comment,
      userId,
    });
    await highlight.save();

    // Return a success response
    return new Response(
      JSON.stringify({ message: 'Highlight saved', highlight }),
      { status: 201 }
    );
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
      });
    }
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
