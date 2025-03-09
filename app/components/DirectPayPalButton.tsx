'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface DirectPayPalButtonProps {
  onSubscriptionSuccess?: () => void;
}

// Define the handler for the PayPal success callback
declare global {
  interface Window {
    handlePayPalSuccess?: (subscriptionId: string) => void;
  }
}

export default function DirectPayPalButton({
  onSubscriptionSuccess,
}: DirectPayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Handle successful subscription
  const handleSubscriptionSuccess = useCallback(
    async (subscriptionId: string) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/subscriptions/activate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: subscriptionId,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success('Subscription activated successfully!');
          if (onSubscriptionSuccess) {
            onSubscriptionSuccess();
          }
        } else {
          toast.error(result.message || 'Failed to activate subscription');
        }
      } catch (error) {
        console.error('Error activating subscription:', error);
        toast.error('An error occurred while activating your subscription');
      } finally {
        setIsLoading(false);
      }
    },
    [onSubscriptionSuccess]
  );

  // Register the subscription success handler
  useEffect(() => {
    const originalHandler = window.handlePayPalSuccess;

    // Create a wrapper that calls both the original handler and our local handler
    window.handlePayPalSuccess = (subscriptionId: string) => {
      // Call component's local handler
      handleSubscriptionSuccess(subscriptionId);

      // Call the parent component's handler if it exists
      if (originalHandler && typeof originalHandler === 'function') {
        originalHandler(subscriptionId);
      }
    };

    return () => {
      // Restore the original handler on cleanup
      window.handlePayPalSuccess = originalHandler;
    };
  }, [handleSubscriptionSuccess]);

  return (
    <div className='subscription-container'>
      <h2 className='text-xl font-semibold mb-2'>
        Upgrade to Premium - $5/month
      </h2>
      <p className='mb-4'>Unlimited word searches and premium features</p>

      {isLoading ? (
        <div className='p-4 text-center'>
          <p>Processing your subscription...</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {/* Direct PayPal Button HTML */}
          <div
            id='paypal-button-container-P-69Y245349R6371427M7F73CQ'
            className='w-full border rounded p-2'
            dangerouslySetInnerHTML={{
              __html: `
                <div id="paypal-button-container-P-69Y245349R6371427M7F73CQ"></div>
                <script src="https://www.paypal.com/sdk/js?client-id=AaMiLFzWk0BVxiQxMutU6uKkaRnK6ST4ABC3JzK4qNfjEFi9Z9d-3qLKgnFE60GBaZjR2--7QjuiQq7s&vault=true&intent=subscription" data-sdk-integration-source="button-factory"></script>
                <script>
                  paypal.Buttons({
                      style: {
                          shape: 'rect',
                          color: 'gold',
                          layout: 'vertical',
                          label: 'subscribe'
                      },
                      createSubscription: function(data, actions) {
                        return actions.subscription.create({
                          plan_id: 'P-69Y245349R6371427M7F73CQ'
                        });
                      },
                      onApprove: function(data, actions) {
                        // Alert for debugging
                        alert('Subscription successful! ID: ' + data.subscriptionID);
                        
                        // Call the function in React to update the state
                        window.handlePayPalSuccess && window.handlePayPalSuccess(data.subscriptionID);
                      }
                  }).render('#paypal-button-container-P-69Y245349R6371427M7F73CQ');
                </script>
              `,
            }}
          />

          <p className='text-xs text-gray-500 mt-2 text-center'>
            Secure payment processed by PayPal. You can cancel anytime.
          </p>

          <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm'>
            <p className='font-medium text-yellow-800'>
              Troubleshooting Payment Issues:
            </p>
            <ul className='list-disc pl-5 mt-2 text-yellow-700'>
              <li>Make sure you allow third-party cookies for paypal.com</li>
              <li>
                Try using a different browser (Chrome or Firefox recommended)
              </li>
              <li>Temporary disable any ad blockers or privacy extensions</li>
              <li>Check if your browser is up to date</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
