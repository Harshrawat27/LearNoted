// app/api/auth/token/route.js
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../../../lib/authOptions';

// // export async function GET(request) {
// export async function GET() {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return new Response(JSON.stringify({ error: 'Not authenticated' }), {
//       status: 401,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
//   return new Response(JSON.stringify({ token: session.token }), {
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': 'https://vocabulary-ai-nu.vercel.app',
//       'Access-Control-Allow-Credentials': 'true',
//       'Access-Control-Allow-Methods': 'GET',
//     },
//   });
// }

import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import jwt from 'jsonwebtoken';

// Keep your existing GET method
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ token: session.token }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://vocabulary-ai-nu.vercel.app',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET',
    },
  });
}

// Add a POST method for the Chrome extension
export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // Create a JWT token
  const token = jwt.sign(
    {
      email: session.user.email,
      // Add any other user data you need
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' } // Token expires in 30 days
  );

  return new Response(
    JSON.stringify({
      token,
      email: session.user.email,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin',
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  );
}

// Add OPTIONS method for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
