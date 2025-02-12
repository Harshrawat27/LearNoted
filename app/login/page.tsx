// pages/login.tsx
'use client'; // Ensure this is a client-side component

import { signIn } from 'next-auth/react';

const Login = () => {
  return (
    <div>
      <h1>Login to Your Account</h1>
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
    </div>
  );
};

export default Login;
