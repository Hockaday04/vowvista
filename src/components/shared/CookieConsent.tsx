'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/lib/stores/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const { cookieConsent, setCookieConsent } = useUIStore();

  useEffect(() => {
    const stored = localStorage.getItem('cookieConsent');
    if (stored !== null) {
      setCookieConsent(stored === 'true');
    }
  }, [setCookieConsent]);

  if (cookieConsent !== null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="cookie-banner"
        role="dialog"
        aria-label="Cookie consent"
      >
        <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 flex-1">
            We use cookies to enhance your experience on VowVista. By continuing to use this site, you agree to our
            {' '}
            <a href="/cookies" className="text-primary-600 underline">
              Cookie Policy
            </a>
            .
          </p>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setCookieConsent(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Decline
            </button>
            <button
              onClick={() => setCookieConsent(true)}
              className="btn-primary text-sm px-4 py-2"
            >
              Accept All
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
