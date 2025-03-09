'use client';
import React, { useState, useEffect, ComponentType } from 'react';
import { getSession } from 'next-auth/react';

/**
 * Checks if the current user has access to premium features
 * @returns A promise that resolves to a boolean indicating if the user has premium access
 */
export async function hasPremiumAccess(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return false;
    }

    // Fetch the current user data
    const response = await fetch('/api/user/me');
    if (!response.ok) {
      return false;
    }

    const userData = await response.json();
    return userData.subscriptionPlan === 'paid';
  } catch (error) {
    console.error('Error checking premium access:', error);
    return false;
  }
}

/**
 * HOC (Higher Order Component) to protect premium features
 * Use this to wrap components that should only be accessible to premium users
 */
export function withPremiumCheck<P extends object>(
  Component: ComponentType<P>
) {
  return function PremiumProtectedComponent(props: P) {
    const [loading, setLoading] = useState(true);
    const [hasPremium, setHasPremium] = useState(false);

    useEffect(() => {
      async function checkAccess() {
        const hasAccess = await hasPremiumAccess();
        setHasPremium(hasAccess);
        setLoading(false);
      }
      checkAccess();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!hasPremium) {
      return (
        <div className='premium-upgrade-prompt'>
          <h3>Premium Feature</h3>
          <p>This feature is only available to premium subscribers.</p>
          <a href='/account/subscription' className='upgrade-button'>
            Upgrade Now
          </a>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
