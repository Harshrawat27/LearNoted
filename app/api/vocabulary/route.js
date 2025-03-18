// app/api/vocabulary/route.js

// import { NextRequest, NextResponse } from 'next/server';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/authOptions';
import { z } from 'zod';
import { openai } from '../../lib/openai';
import dbConnect from '../../lib/dbConnect';
import { User } from '../../../models/User';
import { Search } from '../../../models/Search';
import jwt from 'jsonwebtoken';

// Input validation schema
const WordSchema = z.object({
  word: z.string().min(1, 'Word must not be empty'),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    if (session && session.user && session.user.email) {
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
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Change this section in POST function
    if (!(await user.canSearchWord())) {
      return NextResponse.json(
        {
          error: 'Monthly word search limit reached',
          remainingSearches: 0, // Always 0 when limit is reached
        },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { word } = WordSchema.parse(body);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Please provide the following information about the word "${word}" in this exact format:
          Meaning: (brief definition)
          Synonyms: (3-4 synonyms)
          Context: (a simple example sentence)
          Additional: (any interesting fact or usage note)`,
        },
      ],
      max_tokens: 150,
    });

    user.incrementWordSearch();
    await user.save();

    const responseText = completion.choices[0].message.content;
    const parts = responseText.split('\n').filter((line) => line.trim());

    const meaningLine = parts.find((p) => p.includes('Meaning:')) || '';
    const synonymsLine = parts.find((p) => p.includes('Synonyms:')) || '';
    const contextLine = parts.find((p) => p.includes('Context:')) || '';
    const additionalLine = parts.find((p) => p.includes('Additional:')) || '';

    const meaning = meaningLine.split('Meaning:')[1]?.trim() || '';
    const synonymsStr = synonymsLine.split('Synonyms:')[1]?.trim() || '';
    const context = contextLine.split('Context:')[1]?.trim() || '';
    const additional = additionalLine.split('Additional:')[1]?.trim() || '';

    // Convert the synonyms string into an array (assuming comma-separated values)
    const synonymsArray = synonymsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Save the search record to the database
    try {
      await Search.create({
        user: user._id,
        word,
        meaning,
        synonyms: synonymsArray,
        context,
        additional,
      });
      console.log(`Search record saved for word: ${word}`);
    } catch (err) {
      console.error('Error saving search record:', err);
      // Proceed even if saving fails
    }

    return NextResponse.json(
      {
        word,
        details: responseText,
        remainingSearches:
          user.subscriptionPlan === 'free'
            ? Math.max(0, 20 - user.wordSearchCount) // Ensure it's never negative
            : 'Unlimited',
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Vocabulary API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch word details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
