import Link from 'next/link';
import { Suspense } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedSuppliers } from '@/components/home/FeaturedSuppliers';
import { UKRegions } from '@/components/home/UKRegions';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { SupplierCTA } from '@/components/home/SupplierCTA';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-primary-50/50 via-white to-white">
      <HeroSection />
      <CategoryGrid />
      <Suspense fallback={<div className="section-padding"><p>Loading...</p></div>}>
        <FeaturedSuppliers />
      </Suspense>
      <UKRegions />
      <HowItWorks />
      <Testimonials />
      <SupplierCTA />
    </div>
  );
}
