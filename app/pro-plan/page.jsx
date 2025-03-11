'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProPlanPage() {
  const { data: session, status } = useSession();
  const [userPlan, setUserPlan] = useState('free');
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user's current plan
    if (status === 'authenticated') {
      fetchUserPlan();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchUserPlan = async () => {
    try {
      const response = await fetch('/api/user/plan');
      const data = await response.json();

      if (data.success) {
        setUserPlan(data.plan);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user plan:', error);
      setLoading(false);
    }
  };

  const createOrder = (data, actions) => {
    console.log('Creating PayPal order...');
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: '5.00',
            currency_code: 'USD',
          },
          description: 'Pro Plan - Unlimited Searches',
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    });
  };

  const handleApprove = async (data, actions) => {
    try {
      setPaymentLoading(true);
      setPaymentError(null);
      console.log('Payment approved by user, order ID:', data.orderID);

      // Send the order ID to your server to validate and update the user's plan
      const response = await fetch('/api/payments/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Server error response:', responseData);
        setPaymentError(responseData.error || 'Payment processing failed');
        return;
      }

      if (responseData.success) {
        console.log('Payment successfully processed on the server');
        setUserPlan('paid');
        setPaymentSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        console.error('Payment verification failed:', responseData.error);
        setPaymentError(responseData.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
      setPaymentError(
        'An error occurred while processing your payment. Please try again later.'
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleError = (err) => {
    console.error('PayPal error:', err);
    setPaymentError('There was a problem with PayPal. Please try again later.');
    setPaymentLoading(false);
  };

  if (loading) {
    return <div className='container mx-auto p-8 text-center'>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className='container mx-auto p-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Upgrade to Pro Plan</h1>
        <p className='mb-4'>Please sign in to upgrade your account.</p>
        <Link
          href='/api/auth/signin'
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (userPlan === 'paid') {
    return (
      <div className='container mx-auto p-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Pro Plan</h1>
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
          You are already a Pro user! Enjoy unlimited searches.
        </div>
        <Link
          href='/dashboard'
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className='container mx-auto p-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Thank You!</h1>
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
          Your payment was successful! You now have access to unlimited
          searches.
        </div>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-4 text-center'>
        Upgrade to Pro Plan
      </h1>

      <div className='max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-8'>
        <div className='p-6'>
          <h2 className='text-xl font-semibold mb-4'>Pro Plan - $5.00</h2>
          <ul className='list-disc list-inside mb-4 space-y-2'>
            <li>Unlimited word searches</li>
            <li>One-time payment</li>
            <li>No recurring fees</li>
            <li>Lifetime access</li>
          </ul>

          {paymentError && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
              {paymentError}
            </div>
          )}

          <div className='mt-6'>
            {paymentLoading ? (
              <div className='text-center py-4'>
                <p>Processing payment...</p>
              </div>
            ) : (
              <PayPalScriptProvider
                options={{
                  'client-id':
                    'AQSgOvOVSPVWI4pdNf1iKaEBfvzbCB4lX_fcIofql_h11iBBGqshpuJH5xbsrlU6Rxl8cs_vnWsQ8t4H',
                  currency: 'USD',
                  // Set to 'sandbox' for testing
                  // Make sure this matches your backend environment setting
                  intent: 'capture',
                  'enable-funding': 'card,venmo',
                  'disable-funding': 'paylater,credit',
                }}
              >
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'pay',
                  }}
                  createOrder={createOrder}
                  onApprove={handleApprove}
                  onError={handleError}
                  onCancel={() => console.log('Payment cancelled by user')}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      </div>

      <div className='text-center'>
        <Link href='/dashboard' className='text-blue-500 hover:underline'>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
