// app/components/ClientProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import React from 'react';

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
          currency: 'USD',
        }}
      >
        {children}
      </PayPalScriptProvider>
    </SessionProvider>
  );
}
