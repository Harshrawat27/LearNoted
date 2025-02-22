'use client';
import PayPalButton from '../components/PayPalButton';
import { useSession } from 'next-auth/react'; // if using next-auth
import React from 'react';

export default function SubscribePage() {
  const { data: session } = useSession();
  // Suppose session.user.id is the user's MongoDB ID

  if (!session) {
    return <div>Please log in to subscribe.</div>;
  }

  return (
    <div>
      <h1>Subscribe</h1>
      <PayPalButton userId={session.user.id} />
    </div>
  );
}
