import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Highlight from '@/models/Highlight';
import dbConnect from '@/app/lib/dbConnect';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const highlights = await Highlight.find({
      userId: session.user.id,
      url: url,
    });

    return res.status(200).json(highlights);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch highlights' });
  }
}
