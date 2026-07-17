import { Suspense } from 'react';
import type { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-gold-50 px-4 py-12">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
