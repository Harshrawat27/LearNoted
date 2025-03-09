'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PayPalSubscription from '../../components/PayPalSubscription';
import { toast } from 'react-hot-toast';

interface UserData {
  subscriptionPlan: string;
  paypalSubscriptionId: string | null;
  paypalSubscriptionStatus: string | null;
  wordSearchCount: number;
}

interface SubscriptionClientProps {
  userData: UserData;
}

export default function SubscriptionClient({
  userData,
}: SubscriptionClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(
    userData?.subscriptionPlan || 'free'
  );

  // Refresh the page when subscription changes
  const refreshSubscription = async () => {
    router.refresh(); // Refresh the server component data
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (
      !confirm(
        'Are you sure you want to cancel your subscription? You will lose access to premium features.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Subscription cancelled successfully');
        setCurrentPlan('free');
        router.refresh(); // Refresh the page to show updated status
      } else {
        toast.error(data.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('An error occurred while cancelling your subscription');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className='container mx-auto mt-10 p-4'>
        Please sign in to access this page.
      </div>
    );
  }

  return (
    <div className='container mx-auto mt-10 p-4'>
      <h1 className='text-2xl font-bold mb-6'>Subscription Management</h1>

      <div className='bg-white rounded-lg shadow p-6 mb-6'>
        <h2 className='text-xl font-semibold mb-4'>Current Plan</h2>

        <div className='mb-4'>
          <p>
            <strong>Plan:</strong> {currentPlan === 'paid' ? 'Premium' : 'Free'}
          </p>

          {currentPlan === 'free' && (
            <p>
              <strong>Word Searches:</strong> {userData.wordSearchCount}/100
              this month
            </p>
          )}

          {currentPlan === 'paid' && userData.paypalSubscriptionId && (
            <div className='mt-2'>
              <p>
                You have an active premium subscription with unlimited word
                searches.
              </p>
              <button
                onClick={handleCancelSubscription}
                className='mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Cancel Subscription'}
              </button>
            </div>
          )}
        </div>
      </div>

      {currentPlan === 'free' && (
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Upgrade to Premium</h2>
          <p className='mb-4'>
            Get unlimited word searches and access to premium features for just
            $5/month.
          </p>

          <PayPalSubscription onSubscriptionSuccess={refreshSubscription} />
        </div>
      )}
    </div>
  );
}
