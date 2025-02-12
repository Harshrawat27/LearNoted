// app/auth/error/page.jsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'An unknown error occurred.';
  const errorDescription = searchParams.get('error_description') || '';

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Authentication Error</h1>
      <p>{error}</p>
      {errorDescription && <p>{errorDescription}</p>}
    </div>
  );
}
