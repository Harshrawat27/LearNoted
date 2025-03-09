// app/pro-plan/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

export default function ProPlan() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handlePaymentSuccess = async (details) => {
    try {
      setLoading(true);

      // Send payment details to your API to update user subscription
      const response = await fetch('/api/upgrade-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: details.id,
          paymentStatus: details.status,
          payerEmail: details.payer.email_address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Subscription successful! Redirecting to dashboard...');
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setMessage(
          `Error: ${
            data.message || 'Payment successful but subscription update failed.'
          }`
        );
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage(
        'Payment was successful, but we encountered an error updating your account.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          <div className='px-6 py-8'>
            <h2 className='text-2xl font-bold text-gray-900 text-center'>
              Upgrade to Pro Plan
            </h2>
            <p className='mt-2 text-center text-gray-600'>
              Unlock unlimited word searches for just $5
            </p>

            <div className='mt-8 space-y-4'>
              <div className='border border-gray-200 rounded-md p-4'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Pro Plan Benefits:
                </h3>
                <ul className='mt-4 space-y-2'>
                  <li className='flex items-start'>
                    <svg
                      className='h-5 w-5 text-green-500 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    <span>Unlimited word searches</span>
                  </li>
                  <li className='flex items-start'>
                    <svg
                      className='h-5 w-5 text-green-500 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    <span>Priority support</span>
                  </li>
                  <li className='flex items-start'>
                    <svg
                      className='h-5 w-5 text-green-500 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    <span>One-time payment (not subscription)</span>
                  </li>
                </ul>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-md ${
                    message.includes('Error')
                      ? 'bg-red-50 text-red-700'
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  {message}
                </div>
              )}

              <div className='pt-4'>
                <PayPalScriptProvider
                  options={{
                    'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                    currency: 'USD',
                  }}
                >
                  <PayPalButtons
                    disabled={loading}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            description: 'Pro Plan Upgrade',
                            amount: {
                              value: '5.00',
                              currency_code: 'USD',
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      // Capture the funds from the transaction
                      const details = await actions.order.capture();
                      // Call your backend to process the payment and update subscription
                      handlePaymentSuccess(details);
                    }}
                    onError={(err) => {
                      console.error('PayPal Error:', err);
                      setMessage('Payment failed. Please try again later.');
                    }}
                    style={{ layout: 'vertical' }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
