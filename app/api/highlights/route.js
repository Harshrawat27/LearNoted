import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import dbConnect from '../../lib/dbConnect';
import Highlight from '../../../models/Highlight';
import jwt from 'jsonwebtoken';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  await dbConnect();

  let userEmail = null;
  const authHeader = req.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
      return NextResponse.json(
        { error: `Invalid token ${err}` },
        { status: 401, headers: corsHeaders }
      );
    }
  }

  if (!userEmail) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userEmail = session.user.email;
    }
  }

  if (!userEmail) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const highlight = await Highlight.create({
      userEmail,
      ...body,
    });
    return NextResponse.json(highlight, { headers: corsHeaders });
  } catch (error) {
    console.error('Highlight creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create highlight' },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function GET(req) {
  await dbConnect();

  let userEmail = null;
  const authHeader = req.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
      return NextResponse.json(
        { error: `Invalid token ${err}` },
        { status: 401, headers: corsHeaders }
      );
    }
  }

  if (!userEmail) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userEmail = session.user.email;
    }
  }

  if (!userEmail) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: corsHeaders }
    );
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const search = url.searchParams.get('search') || '';
  const searchType = url.searchParams.get('searchType') || 'all'; // Extract searchType
  const urlFilter = url.searchParams.get('url') || '';

  try {
    let query = { userEmail };

    // Apply exact URL filter if provided
    if (urlFilter) {
      query.url = urlFilter;
    }

    // Apply search based on searchType
    if (search) {
      if (searchType === 'domain') {
        query.url = { $regex: search, $options: 'i' }; // Search in url
      } else if (searchType === 'text') {
        query.$or = [
          { text: { $regex: search, $options: 'i' } },
          { context: { $regex: search, $options: 'i' } },
        ]; // Search in text and context
      } else if (searchType === 'all') {
        query.$or = [
          { url: { $regex: search, $options: 'i' } },
          { text: { $regex: search, $options: 'i' } },
          { context: { $regex: search, $options: 'i' } },
        ]; // Search in url, text, and context
      }
    }

    const skip = (page - 1) * limit;
    const highlights = await Highlight.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Highlight.countDocuments(query);
    const hasMore = skip + highlights.length < total;

    return NextResponse.json(
      {
        highlights: JSON.parse(JSON.stringify(highlights)),
        hasMore,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Highlight fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch highlights' },
      { status: 400, headers: corsHeaders }
    );
  }
}
