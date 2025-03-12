'use client';
//this code is working -- 11 march

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function ProPlanPage() {
  const { data: session, status } = useSession();
  const [userPlan, setUserPlan] = useState('free');
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const router = useRouter();

  // PayPal client ID - hardcoded for now, but ideally should come from environment
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

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
      setDebugInfo(null);
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

      // Store the full response text for debugging
      const responseText = await response.text();
      console.log('Full server response:', responseText);

      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        setPaymentError(
          'Server returned an invalid response. Please contact support.'
        );
        setDebugInfo({
          statusCode: response.status,
          responseText: responseText,
        });
        return;
      }

      if (!response.ok) {
        console.error('Server error response:', responseData);
        setPaymentError(responseData.error || 'Payment processing failed');

        // Include detailed debug info
        setDebugInfo({
          statusCode: response.status,
          error: responseData.error,
          details: responseData.details || responseData.message,
          orderID: data.orderID,
        });
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
        setDebugInfo(responseData);
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
      setPaymentError(
        'An error occurred while processing your payment. Please try again later.'
      );
      setDebugInfo({
        clientError: error.message,
        stack: error.stack,
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleError = (err) => {
    console.error('PayPal error:', err);
    setPaymentError('There was a problem with PayPal. Please try again later.');
    setPaymentLoading(false);
    setDebugInfo({
      paypalError: err,
    });
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='h-10 w-10 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4' />
          <p className='text-gray-600 dark:text-gray-300'>
            Loading your plan details...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
          {/* Header */}
          <header className='flex items-center justify-between py-4 mb-12'>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src='/learnoted-logo.svg'
                alt='AI Extension Logo'
                width={40}
                height={40}
                className='rounded-full'
              />
              <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
                LearNoted
              </h1>
            </Link>
          </header>

          <div className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center border border-gray-200 dark:border-gray-700'>
            <h1 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              Upgrade to Pro Plan
            </h1>
            <p className='mb-6 text-gray-600 dark:text-gray-300'>
              Please sign in to upgrade your account.
            </p>
            <Link
              href='/api/auth/signin'
              className='inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md'
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (userPlan === 'paid') {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
          {/* Header */}
          <header className='flex items-center justify-between py-4 mb-12'>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src='/logo.png'
                alt='AI Extension Logo'
                width={40}
                height={40}
                className='rounded-full'
              />
              <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
                AI Extension
              </h1>
            </Link>
          </header>

          <div className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center border border-gray-200 dark:border-gray-700'>
            <div className='w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-6'>
              <CheckCircle className='h-8 w-8 text-purple-600 dark:text-purple-400' />
            </div>

            <h1 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              Pro Plan
            </h1>
            <div className='bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-xl mb-6'>
              You are already a Pro user! Enjoy unlimited searches.
            </div>
            <Link
              href='/dashboard'
              className='inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md'
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
          {/* Header */}
          <header className='flex items-center justify-between py-4 mb-12'>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src='/logo.png'
                alt='AI Extension Logo'
                width={40}
                height={40}
                className='rounded-full'
              />
              <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
                AI Extension
              </h1>
            </Link>
          </header>

          <div className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center border border-gray-200 dark:border-gray-700'>
            <div className='w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-6'>
              <CheckCircle className='h-8 w-8 text-purple-600 dark:text-purple-400' />
            </div>

            <h1 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              Thank You!
            </h1>
            <div className='bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-xl mb-6'>
              Your payment was successful! You now have access to unlimited
              searches.
            </div>
            <div className='flex items-center justify-center'>
              <Loader2 className='h-5 w-5 text-purple-600 dark:text-purple-400 animate-spin mr-2' />
              <p className='text-gray-600 dark:text-gray-300'>
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        {/* Header */}
        <header className='flex items-center justify-between py-4 mb-8'>
          <Link href='/' className='flex items-center gap-2'>
            <Image
              src='/logo.png'
              alt='AI Extension Logo'
              width={40}
              height={40}
              className='rounded-full'
            />
            <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
              AI Extension
            </h1>
          </Link>
        </header>

        <div className='max-w-xl mx-auto'>
          <h1 className='text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white'>
            Upgrade to Pro Plan
          </h1>

          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden mb-8 border border-gray-200 dark:border-gray-700'>
            <div className='p-8'>
              <div className='flex items-center mb-6'>
                <span className='inline-block bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm font-medium py-1 px-3 rounded-full mr-3'>
                  Pro
                </span>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Pro Plan - $5.00
                </h2>
              </div>
              <ul className='space-y-3 mb-6'>
                {[
                  'Unlimited word searches',
                  'One-time payment',
                  'No recurring fees',
                  'Lifetime access',
                ].map((feature, index) => (
                  <li key={index} className='flex items-start'>
                    <div className='flex-shrink-0 mr-2 mt-1'>
                      <CheckCircle className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                    </div>
                    <span className='text-gray-600 dark:text-gray-300'>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              {paymentError && (
                <div className='bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-4 rounded-xl mb-6'>
                  <div className='flex items-start'>
                    <AlertCircle className='h-5 w-5 mr-2 mt-0.5 flex-shrink-0' />
                    {/* <div>
                      <p className='font-semibold'>Error:</p>
                      <p>{paymentError}</p>
                      {debugInfo && (
                        <details className='mt-2 text-xs'>
                          <summary className='cursor-pointer hover:underline mt-2'>
                            Technical Details (for Support)
                          </summary>
                          <pre className='mt-2 p-2 bg-red-50 dark:bg-red-950 rounded overflow-auto max-h-40 whitespace-pre-wrap'>
                            {JSON.stringify(debugInfo, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div> */}
                  </div>
                </div>
              )}

              <div className='mt-6'>
                {paymentLoading ? (
                  <div className='text-center py-6 space-y-3'>
                    <Loader2 className='h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin mx-auto' />
                    <p className='text-gray-600 dark:text-gray-300'>
                      Processing payment...
                    </p>
                  </div>
                ) : (
                  <PayPalScriptProvider
                    options={{
                      'client-id': PAYPAL_CLIENT_ID,
                      currency: 'USD',
                      // Always use sandbox for easier debugging
                      'enable-funding': 'card',
                      'disable-funding': 'paylater,credit',
                      components: 'buttons',
                      intent: 'capture',
                      debug: true,
                    }}
                    onInit={() => setPaypalReady(true)}
                    onError={(err) => {
                      console.error('PayPal script error:', err);
                      setPaymentError('Failed to load payment processor');
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
              {/* Debug info for PayPal ClientID */}
              <div className='mt-4 text-xs text-gray-400 dark:text-gray-500'>
                <details>
                  <summary className='cursor-pointer hover:underline'>
                    Payment configuration
                  </summary>
                  <p className='mt-1'>
                    Using PayPal Client ID: {PAYPAL_CLIENT_ID.substring(0, 10)}
                    ...
                    {PAYPAL_CLIENT_ID.substring(PAYPAL_CLIENT_ID.length - 5)}
                  </p>
                </details>
              </div>
            </div>
          </div>

          <div className='text-center'>
            <Link
              href='/dashboard'
              className='inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
