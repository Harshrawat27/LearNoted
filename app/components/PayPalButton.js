'use client';
// components/PayPalButton.js
import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function PayPalButton({ userId }) {
  const [clientID, setClientID] = useState('');

  useEffect(() => {
    // Retrieve your PayPal client ID from env or an endpoint
    setClientID(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '');
  }, []);

  const createOrder = async () => {
    // Call your Next.js API route to create the order
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // If you have dynamic amounts or user info, pass in body
      // body: JSON.stringify({ userId, amount: '10.00', ... })
    });
    const data = await res.json();
    return data.orderID; // Must return orderID to the PayPal Buttons component
  };

  const onApprove = async (data, actions) => {
    try {
      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: data.orderID, userId }),
      });

      const json = await res.json();
      if (json.success) {
        alert('Payment successful! Subscription updated.');
        // Optionally, refresh user session or redirect
        window.location.reload();
      } else {
        alert('Payment failed or not completed.');
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
      alert('An error occurred. Try again.');
    }
  };

  return (
    <div>
      {clientID ? (
        <PayPalScriptProvider options={{ 'client-id': clientID }}>
          <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
        </PayPalScriptProvider>
      ) : (
        <p>Loading PayPal...</p>
      )}
    </div>
  );
}
