// app/api/auth/error.tsx
'use client'; // Ensure this is a Client Component

import { useSearchParams } from 'next/navigation';

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{error || 'An unknown error occurred during authentication.'}</p>
    </div>
  );
};

export default ErrorPage;
