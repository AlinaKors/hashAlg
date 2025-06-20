'use client';
import { SessionProvider } from 'next-auth/react';
import AuthForm from './ui/AuthForm/AuthForm';

export default function Page() {
  return (
    <SessionProvider>
      <AuthForm />
    </SessionProvider>
  );
}
