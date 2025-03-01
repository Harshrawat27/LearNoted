import jwt from 'jsonwebtoken';
import dbConnect from '../../lib/dbConnect'; // Adjust path as needed
import YouTubeTimestamp from '../../../models/YoutubeHighlight';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Extract token from Authorization header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.sub) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Connect to MongoDB
      await dbConnect();

      // Extract timestamp data from request body
      const {
        videoId,
        videoUrl,
        videoTitle,
        timestamp,
        formattedTime,
        comment,
      } = req.body;

      // Create and save new timestamp
      const newTimestamp = new YouTubeTimestamp({
        videoId,
        videoUrl,
        videoTitle,
        timestamp,
        formattedTime,
        comment,
        userId: decoded.sub, // User ID from token
      });
      await newTimestamp.save();

      res.status(201).json({ message: 'Timestamp saved successfully' });
    } catch (error) {
      console.error('Error saving timestamp:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
