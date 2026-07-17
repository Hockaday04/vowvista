import { SupplierCard } from '@/components/suppliers/SupplierCard';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Results',
  description: 'Search wedding venues and suppliers across the UK.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; location?: string };
}) {
  const query = searchParams.q || '';

  const where: any = {};
  if (query) {
    where.OR = [
      { businessName: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
      { coverage: { has: query } },
    ];
  }
  if (searchParams.category) {
    where.category = searchParams.category;
  }
  if (searchParams.location) {
    where.OR = [
      { location: { contains: searchParams.location, mode: 'insensitive' } },
      { coverage: { has: searchParams.location } },
    ];
  }

  const suppliers = await prisma.supplier.findMany({
    where,
    take: 20,
    orderBy: [{ subscriptionTier: 'desc' }, { createdAt: 'desc' }],
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      reviews: { select: { rating: true } },
    },
  });

  return (
    <div className="section-padding">
      <div className="container-main">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Search Results
          </h1>
          {query && (
            <p className="mt-2 text-lg text-gray-600">
              {suppliers.length} results for &quot;{query}&quot;
            </p>
          )}
          {!query && (
            <p className="mt-2 text-lg text-gray-600">
              {suppliers.length} suppliers found
            </p>
          )}
        </div>

        {suppliers.length > 0 ? (
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
                rating={
                  supplier.reviews.length > 0
                    ? supplier.reviews.reduce((a, b) => a + b.rating, 0) / supplier.reviews.length
                    : 0
                }
                reviewCount={supplier.reviews.length}
                verified={supplier.verified}
                subscriptionTier={supplier.subscriptionTier}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No results found</p>
            <p className="text-gray-400 mt-2">Try different search terms or browse our categories</p>
          </div>
        )}
      </div>
    </div>
  );
}
