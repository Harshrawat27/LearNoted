// app/api/learning-resources/route.js
import { NextResponse } from 'next/server';

// Use this API route to securely handle OpenAI API calls
export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Valid query is required' },
        { status: 400 }
      );
    }

    // Validate the query
    if (query.trim().length < 2) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 });
    }

    // Make sure to set up these environment variables in your .env.local file
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('OPENAI_API_KEY is not defined in environment variables');
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-search-preview',
        web_search_options: {
          search_context_size: 'high', // Get the most comprehensive context
          user_location: {
            type: 'approximate',
            approximate: {
              country: 'US', // Default to US for popular resources
            },
          },
        },
        messages: [
          {
            role: 'system',
            content: `You are an expert educational resource finder that helps users discover the best, most popular and highly-regarded learning resources for any given topic. 
            
            STRICTLY follow these rules when recommending resources:
            1. Only recommend resources with actual URLs that users can visit
            2. Prioritize resources that are popular, widely-used, and from authoritative sources
            3. Include a diverse mix of free and paid resources when applicable
            4. Always include verifiable, working links in markdown format
            5. Verify that recommended content actually exists and is accessible
            6. For each resource, include 2-3 sentences explaining why it's valuable and what specifically makes it a good resource
            
            Provide a well-formatted response with exactly these sections:
            
            1. Start with a brief introduction to the topic (2-3 sentences maximum)
            
            2. ARTICLES section:
               - 2-3 high-quality articles from reputable sources (e.g., Medium, well-known blogs, educational sites)
               - Use proper markdown headings (### Title)
               - Each article must have a working link
               - Format links as: [Title](URL)
               - Briefly explain why each is valuable
               
            3. VIDEOS section:
               - 2-3 high-quality videos primarily from YouTube, Coursera, or educational platforms
               - Use proper markdown headings (### Title)
               - Each video must have a working link 
               - Format links as: [Title](URL)
               - Briefly explain why each is valuable
               
            4. COURSES & RESOURCES section:
               - 2-3 interactive resources, courses, or tools from established platforms
               - Use proper markdown headings (### Title)
               - Must include popular learning platforms like Coursera, edX, Udemy, Khan Academy, etc.
               - Format links as: [Title](URL)
               - Briefly explain why each is valuable
            
            Each section must be clearly labeled and separated.`,
          },
          {
            role: 'user',
            content: `I want to learn about ${query}. Please recommend only the most popular and highly-regarded resources with working links.`,
          },
        ],
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch resources' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const annotations = data.choices?.[0]?.message?.annotations || [];

    if (!content) {
      return NextResponse.json(
        { error: 'No content returned from API' },
        { status: 500 }
      );
    }

    // Return both the content and annotations for citation display
    return NextResponse.json({
      content,
      annotations,
      citations: extractCitations(annotations, content),
    });
  } catch (error) {
    console.error('Error in learning-resources API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to extract citation info
function extractCitations(annotations, content) {
  const citations = [];

  if (!annotations || !Array.isArray(annotations)) {
    return citations;
  }

  annotations.forEach((annotation) => {
    if (annotation.type === 'url_citation' && annotation.url_citation) {
      const { url, title, start_index, end_index } = annotation.url_citation;

      if (url && title) {
        citations.push({
          url,
          title,
          startIndex: start_index,
          endIndex: end_index,
          snippet: content.substring(start_index, end_index),
        });
      }
    }
  });

  return citations;
}
