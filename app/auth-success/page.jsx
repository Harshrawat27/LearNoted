'use client';
import { useEffect } from 'react';

export default function AuthSuccess() {
  useEffect(() => {
    fetch('/api/auth/token')
      .then((res) => res.json())
      .then(({ token }) => {
        console.log('Token received in auth-success page:', token);
        window.postMessage(
          {
            type: 'EXTENSION_TOKEN',
            token: token,
          },
          '*'
        );
        // Close the tab after a short delay so you can see the logs
        setTimeout(() => {
          window.close();
        }, 1000);
      })
      .catch((err) => {
        console.error('Error fetching token:', err);
      });
  }, []);

  return <div>Authentication successful! Please close this window.</div>;
}
