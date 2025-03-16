'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Prepare data for MongoDB
      const data = {
        email: email,
        source: 'home page form', // Hardcoded value as requested
        subscriptionDate: new Date(),
      };

      // Send data to API endpoint
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to subscribe');
      }

      // Show thank you message
      setShowThankYou(true);
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage(
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {showThankYou ? (
        <div className='bg-green-100 dark:bg-green-800/30 p-4 rounded-lg text-center'>
          <p className='text-green-800 dark:text-green-200 font-medium text-lg'>
            Thanks for subscribing!
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubscribe}
          className='flex flex-col sm:flex-row gap-3'
        >
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
            disabled={isSubmitting}
            className='flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
          <button
            type='submit'
            disabled={isSubmitting}
            className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 whitespace-nowrap rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}

      {errorMessage && (
        <p className='mt-2 text-red-600 dark:text-red-400 text-sm'>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
