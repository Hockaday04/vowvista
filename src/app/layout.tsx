import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CookieConsent } from '@/components/shared/CookieConsent';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vowvista.co.uk'),
  title: {
    default: 'VowVista - Find Your Perfect Wedding Venue & Suppliers UK',
    template: '%s | VowVista',
  },
  description: 'Discover and book the best wedding venues, photographers, caterers, and suppliers across the UK. Plan your dream wedding with VowVista.',
  keywords: [
    'wedding venues UK', 'wedding planners', 'wedding photographers',
    'wedding caterers', 'wedding florists', 'wedding DJ', 'wedding bands',
    'wedding planning', 'UK weddings', 'wedding suppliers',
  ],
  authors: [{ name: 'VowVista' }],
  creator: 'VowVista',
  publisher: 'VowVista',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://vowvista.co.uk',
    title: 'VowVista - Find Your Perfect Wedding Venue & Suppliers UK',
    description: 'Discover and book the best wedding venues, photographers, caterers, and suppliers across the UK.',
    siteName: 'VowVista',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VowVista - UK Wedding Planning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VowVista - Find Your Perfect Wedding Venue & Suppliers UK',
    description: 'Discover and book the best wedding venues, photographers, caterers, and suppliers across the UK.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
