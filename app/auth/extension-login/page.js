// app/auth/extension-login/page.js
'use client'; // Use client-side rendering for this page
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ExtensionLogin() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    if (!session) {
      redirect('/auth/signin'); // Redirect to sign-in if not authenticated
    } else if (session.token) {
      // Send token to extension
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage(
          'jpnlaecekabfknkhcpahcidhcbadlpcj',
          { token: session.token },
          (response) => {
            console.log('Token sent to extension', response);
          }
        );
      }
    }
  }, [session, status]);

  return (
    <div>
      <h1>Authorizing Extension...</h1>
      <p>Please wait while we set up your extension.</p>
    </div>
  );
}
