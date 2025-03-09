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
  const [paymentSuccess, setPaymentSuccess] = useState(false);
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

  const handleApprove = async (data, actions) => {
    try {
      setLoading(true);
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const responseData = await response.json();

      if (responseData.success) {
        console.log('Payment successfully processed on the server');
        setUserPlan('paid');
        setPaymentSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        console.error('Payment verification failed:', responseData.error);
        alert(
          'Payment processing failed. Please try again or contact support.'
        );
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
      alert(
        'An error occurred while processing your payment. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
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

          <div className='mt-6'>
            <PayPalScriptProvider
              options={{
                'client-id':
                  'AQSgOvOVSPVWI4pdNf1iKaEBfvzbCB4lX_fcIofql_h11iBBGqshpuJH5xbsrlU6Rxl8cs_vnWsQ8t4H',
                currency: 'USD',
              }}
            >
              <PayPalButtons
                style={{ layout: 'vertical' }}
                createOrder={(data, actions) => {
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
                  });
                }}
                onApprove={handleApprove}
              />
            </PayPalScriptProvider>
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
