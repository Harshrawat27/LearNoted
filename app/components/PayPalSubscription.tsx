'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  PayPalCreateActions,
  PayPalOnApproveData,
  // PayPalOnApproveActions, to fix error
} from '../types/paypal-types';

interface PayPalSubscriptionProps {
  onSubscriptionSuccess?: () => void;
}

export default function PayPalSubscription({
  onSubscriptionSuccess,
}: PayPalSubscriptionProps) {
  const { data: session } = useSession();
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only load PayPal script if user is logged in
    if (!session?.user) return;

    // Create a variable to track if component is still mounted
    let isMounted = true;
    setLoading(true);

    // Load the PayPal SDK script
    const script = document.createElement('script');
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AaMiLFzWk0BVxiQxMutU6uKkaRnK6ST4ABC3JzK4qNfjEFi9Z9d-3qLKgnFE60GBaZjR2--7QjuiQq7s&vault=true&intent=subscription&currency=USD';
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.async = true;

    // Handle script load error
    script.onerror = () => {
      if (isMounted) {
        console.error('Failed to load PayPal SDK script');
        toast.error(
          'Failed to load payment provider. Please try again later or disable ad blockers.'
        );
        setLoading(false);
      }
    };

    script.onload = () => {
      if (isMounted && window.paypal && paypalButtonRef.current) {
        try {
          setLoading(false);

          // Render the PayPal button
          window.paypal
            .Buttons({
              style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'subscribe',
              },
              createSubscription: function (
                //    data: any, -- to fix error
                actions: PayPalCreateActions
              ) {
                return actions.subscription.create({
                  plan_id: 'P-69Y245349R6371427M7F73CQ',
                });
              },
              onApprove: async function (
                data: PayPalOnApproveData
                //  actions: PayPalOnApproveActions -- to fix error
              ) {
                try {
                  // Update the user's subscription status in your DB
                  const response = await fetch('/api/subscriptions/activate', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      subscriptionId: data.subscriptionID,
                    }),
                  });

                  const result = await response.json();

                  if (response.ok) {
                    toast.success('Subscription activated successfully!');
                    if (onSubscriptionSuccess) {
                      onSubscriptionSuccess();
                    }
                  } else {
                    toast.error(
                      result.message || 'Failed to activate subscription'
                    );
                  }
                } catch (error) {
                  console.error('Error activating subscription:', error);
                  toast.error(
                    'An error occurred while activating your subscription'
                  );
                }
              },
            })
            .render(paypalButtonRef.current);
        } catch (error) {
          console.error('Error rendering PayPal buttons:', error);
          toast.error('Failed to initialize payment. Please try again later.');
          setLoading(false);
        }
      }
    };

    document.body.appendChild(script);

    return () => {
      isMounted = false;
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [session, onSubscriptionSuccess]);

  if (!session?.user) {
    return <p>Please sign in to subscribe.</p>;
  }

  return (
    <div className='subscription-container'>
      <h2 className='text-xl font-semibold mb-2'>
        Upgrade to Premium - $5/month
      </h2>
      <p className='mb-4'>Unlimited word searches and premium features</p>

      {loading ? (
        <div className='p-4 text-center'>
          <p>Loading payment options...</p>
          <p className='text-sm text-gray-500 mt-2'>
            If this takes too long, please check if you have ad blockers or
            privacy extensions enabled.
          </p>
        </div>
      ) : (
        <div>
          <div ref={paypalButtonRef} id='paypal-button-container'></div>
          <p className='text-xs text-gray-500 mt-2 text-center'>
            Secure payment processed by PayPal. You can cancel anytime.
          </p>
        </div>
      )}
    </div>
  );
}
