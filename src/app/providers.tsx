'use client';

import { SessionProvider } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </SessionProvider>
  );
}
