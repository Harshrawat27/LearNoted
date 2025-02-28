import jwt from 'jsonwebtoken';
import dbConnect from '../../lib/dbConnect';
import YoutubeHighlight from '../../models/YoutubeHighlight';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Extract token from Authorization header -- to relaunch the app
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.sub && !decoded.id) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    const userId = decoded.sub || decoded.id; // Adjust based on your token structure

    // Extract data from request body
    const { videoUrl, timestamp, comment } = req.body;
    if (!videoUrl || !timestamp || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create and save the highlight
    const highlight = new YoutubeHighlight({
      videoUrl,
      timestamp,
      comment,
      userId,
    });
    await highlight.save();

    return res.status(201).json({ message: 'Highlight saved', highlight });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
