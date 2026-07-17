import { SupplierCard } from '@/components/suppliers/SupplierCard';
import prisma from '@/lib/prisma';

export async function FeaturedSuppliers() {
  const suppliers = await prisma.supplier.findMany({
    where: {
      verified: true,
    },
    orderBy: [
      { subscriptionTier: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 6,
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  if (suppliers.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-main">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
              Featured Suppliers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Hand-picked and verified wedding professionals
            </p>
          </div>
          <a
            href="/suppliers"
            className="mt-4 sm:mt-0 text-primary-600 font-medium hover:text-primary-700 transition-colors inline-flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              id={supplier.id}
              businessName={supplier.businessName}
              category={supplier.category}
              location={supplier.location}
              description={supplier.description}
              pricing={supplier.pricing}
              imageUrl={supplier.images[0]?.url}
              rating={supplier.reviews.length > 0 ? supplier.reviews.reduce((a, b) => a + b.rating, 0) / supplier.reviews.length : 0}
              reviewCount={supplier.reviews.length}
              verified={supplier.verified}
              subscriptionTier={supplier.subscriptionTier}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
