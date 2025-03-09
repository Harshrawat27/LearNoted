'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  PayPalCreateActions,
  PayPalOnApproveData,
  //  PayPalOnApproveActions,
} from '../../app/types/paypal-types';

interface PayPalButtonProps {
  onSubscriptionSuccess?: () => void;
}

// PayPal Error type
interface PayPalError {
  message: string;
  name?: string;
  details?: Array<{
    issue: string;
    description: string;
  }>;
}

export default function CleanPayPalButton({
  onSubscriptionSuccess,
}: PayPalButtonProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Remove any existing PayPal scripts to avoid conflicts
    const existingScripts = document.querySelectorAll(
      'script[src*="paypal.com/sdk/js"]'
    );
    existingScripts.forEach((script) => {
      script.parentNode?.removeChild(script);
    });

    // Create a new script with all required parameters
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AaMiLFzWk0BVxiQxMutU6uKkaRnK6ST4ABC3JzK4qNfjEFi9Z9d-3qLKgnFE60GBaZjR2--7QjuiQq7s&vault=true&intent=subscription&currency=USD`;
    script.async = true;

    // Add error handling
    script.onerror = () => {
      console.error('PayPal script failed to load');
      setError('Failed to load payment provider');
      setScriptLoaded(false);
    };

    // Set up success handler
    script.onload = () => {
      console.log('PayPal script loaded successfully');
      setScriptLoaded(true);
      setError(null);

      // Make sure PayPal is defined and container exists
      if (window.paypal && paypalContainerRef.current) {
        try {
          window.paypal
            .Buttons({
              style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'subscribe',
              },
              createSubscription: function (
                data: Record<string, unknown>,
                actions: PayPalCreateActions
              ) {
                return actions.subscription.create({
                  plan_id: 'P-69Y245349R6371427M7F73CQ',
                });
              },
              onApprove: async function (
                data: PayPalOnApproveData
                //  actions: PayPalOnApproveActions
              ) {
                console.log('Subscription approved:', data);
                setIsProcessing(true);

                try {
                  // Call our API to record the subscription
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
                    toast.success(
                      'Your subscription has been activated successfully!'
                    );
                    if (onSubscriptionSuccess) {
                      onSubscriptionSuccess();
                    }
                  } else {
                    toast.error(
                      result.message || 'Failed to activate subscription'
                    );
                  }
                } catch (error) {
                  console.error('Error processing subscription:', error);
                  toast.error(
                    'An error occurred while processing your subscription'
                  );
                } finally {
                  setIsProcessing(false);
                }
              },
              onError: function (err: PayPalError) {
                console.error('PayPal button error:', err);
                setError('An error occurred with the payment processing');
              },
            })
            .render(paypalContainerRef.current);
        } catch (err) {
          console.error('Error rendering PayPal buttons:', err);
          setError('Failed to initialize payment system');
        }
      }
    };

    // Add the script to the document
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onSubscriptionSuccess]);

  return (
    <div className='mt-4 space-y-4'>
      <h2 className='text-xl font-semibold'>Upgrade to Premium - $5/month</h2>
      <p>Unlimited word searches and access to premium features</p>

      {isProcessing ? (
        <div className='p-4 bg-blue-50 border border-blue-100 rounded text-center'>
          <p className='text-blue-800 font-medium'>
            Processing your subscription...
          </p>
          <p className='text-sm text-blue-600 mt-1'>
            Please wait while we confirm your payment.
          </p>
        </div>
      ) : error ? (
        <div className='p-4 bg-red-50 border border-red-100 rounded'>
          <p className='text-red-800 font-medium'>{error}</p>
          <p className='text-sm text-red-600 mt-1'>
            Please try again later or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className='mt-2 bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200'
          >
            Try Again
          </button>
        </div>
      ) : !scriptLoaded ? (
        <div className='p-4 border rounded text-center'>
          <p>Loading payment options...</p>
          <p className='text-sm text-gray-500 mt-2'>
            This may take a few moments.
          </p>
        </div>
      ) : (
        <div>
          <div
            ref={paypalContainerRef}
            className='border rounded p-4 bg-gray-50'
          ></div>
          <p className='text-xs text-center text-gray-500 mt-2'>
            Secure payment processed by PayPal. You can cancel anytime.
          </p>
        </div>
      )}

      <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm'>
        <p className='font-medium text-yellow-800'>
          Troubleshooting Payment Issues:
        </p>
        <ul className='list-disc pl-5 mt-2 text-yellow-700 space-y-1'>
          <li>Make sure you allow third-party cookies for paypal.com</li>
          <li>Try using a different browser (Chrome or Firefox recommended)</li>
          <li>Try using an incognito/private window</li>
          <li>Temporarily disable any ad blockers or privacy extensions</li>
          <li>Check if your browser is up to date</li>
        </ul>
      </div>
    </div>
  );
}
