'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubscriptionPlan() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    // Load user subscription info
    if (session?.user?.email) {
      fetchUserSubscription();
    }

    // Load PayPal script
    if (!document.querySelector('script[src*="paypal.com/sdk/js"]')) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.setAttribute('data-sdk-integration-source', 'button-factory');
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    } else {
      setPaypalLoaded(true);
    }
  }, [session, status, router]);

  // Render PayPal button when script is loaded
  useEffect(() => {
    if (paypalLoaded && session && userSubscription?.plan !== 'paid') {
      try {
        window.paypal
          ?.Buttons({
            style: {
              shape: 'rect',
              color: 'gold',
              layout: 'vertical',
              label: 'subscribe',
            },
            createSubscription: function (data, actions) {
              return actions.subscription.create({
                plan_id: 'P-69Y245349R6371427M7F73CQ',
              });
            },
            onApprove: async function (data, actions) {
              // Submit to our API to update the user
              const response = await fetch('/api/subscriptions/activate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  subscriptionId: data.subscriptionID,
                  email: session.user.email,
                }),
              });

              if (response.ok) {
                // Refresh user data
                fetchUserSubscription();
                alert('Subscription activated successfully!');
              } else {
                alert('Failed to activate subscription');
              }
            },
          })
          .render('#paypal-button-container');
      } catch (error) {
        console.error('PayPal button render error:', error);
      }
    }
  }, [paypalLoaded, session, userSubscription]);

  const fetchUserSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscriptions/status');
      if (response.ok) {
        const data = await response.json();
        setUserSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      });

      if (response.ok) {
        fetchUserSubscription();
        alert('Subscription cancelled successfully');
      } else {
        const data = await response.json();
        alert(`Failed to cancel subscription: ${data.message}`);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('An error occurred while cancelling your subscription');
    }
  };

  if (loading) {
    return <div className='container mx-auto p-6 text-center'>Loading...</div>;
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Subscription Plan</h1>

      {/* User is logged in but loading subscription status */}
      {loading && <p>Loading your subscription information...</p>}

      {/* User has active subscription */}
      {userSubscription?.plan === 'paid' && (
        <div className='bg-green-50 border border-green-500 rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-2'>
            Premium Subscription Active
          </h2>
          <p className='mb-4'>You currently have unlimited word searches.</p>
          <button
            onClick={handleCancelSubscription}
            className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded'
          >
            Cancel Subscription
          </button>
        </div>
      )}

      {/* User has free subscription */}
      {userSubscription?.plan === 'free' && (
        <>
          <div className='bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6'>
            <h2 className='text-xl font-semibold mb-2'>Free Plan</h2>
            <p className='mb-1'>
              You have used {userSubscription.wordSearchCount} out of 100 word
              searches this month.
            </p>
            <p className='mb-4'>
              Your limit resets on{' '}
              {new Date(userSubscription.resetDate).toLocaleDateString()}.
            </p>
          </div>

          <div className='bg-white border rounded-lg p-6 shadow-md mb-6'>
            <h2 className='text-xl font-semibold mb-4'>Upgrade to Premium</h2>
            <ul className='mb-6 list-disc pl-6'>
              <li>Unlimited word searches</li>
              <li>Priority support</li>
              <li>Additional features</li>
            </ul>
            <div
              id='paypal-button-container'
              className='max-w-md mx-auto'
            ></div>
          </div>
        </>
      )}

      <div className='mt-6'>
        <Link href='/' className='text-blue-600 hover:underline'>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// updating environment variable to live
