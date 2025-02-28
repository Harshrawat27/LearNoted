import { NextRequest, NextResponse } from 'next/server';
import { FilterQuery } from 'mongoose';
import { Search } from '@/models/Search'; // Adjust the path to your Search model
import dbConnect from '../../lib/dbConnect'; // Adjust the path to your DB connection

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

  // Infer the document type from the Search model
  type SearchDocument = InstanceType<typeof Search>;

  const skip = (page - 1) * limit;
  const query: FilterQuery<SearchDocument> = { user: userId };
  if (search) {
    query.word = { $regex: search, $options: 'i' }; // Case-insensitive search
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
      searches: JSON.parse(JSON.stringify(searches)), // Handle Mongoose lean objects
      hasMore,
    });
  } catch (error) {
    console.error('Error in /api/searches:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
