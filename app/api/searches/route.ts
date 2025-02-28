import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect'; // Adjust the import path as needed
import { Search } from '@/models/Search';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const skip = (page - 1) * limit;
  const query: any = { user: userId };
  if (search) {
    query.word = { $regex: search, $options: 'i' }; // Case-insensitive search on word field
  }

  try {
    const searches = await Search.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Search.countDocuments(query);
    const hasMore = skip + searches.length < total;

    return NextResponse.json({
      searches: JSON.parse(JSON.stringify(searches)), // Serialize Mongoose docs
      hasMore,
    });
  } catch (error) {
    console.error('Error in /api/searches:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
