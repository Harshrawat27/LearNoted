'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ErrorContent() {
  // useSearchParams is a client hook and now is safely wrapped by Suspense
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

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading error details...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
