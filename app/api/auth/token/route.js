import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

export async function GET() {
  // Get the session using the correct authOptions with secret set
  const session = await getServerSession(authOptions);
  return new Response(JSON.stringify({ token: session?.token }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
