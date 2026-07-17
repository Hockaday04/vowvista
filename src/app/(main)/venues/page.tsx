import { SupplierCard } from '@/components/suppliers/SupplierCard';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Venues UK',
  description: 'Find the perfect wedding venue across the UK. Browse barns, castles, hotels, and unique spaces for your special day.',
};

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: { location?: string; page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const take = 12;
  const skip = (page - 1) * take;

  const where = searchParams.location
    ? {
        category: 'VENUE',
        OR: [
          { location: { contains: searchParams.location, mode: 'insensitive' } },
          { coverage: { has: searchParams.location } },
        ],
      }
    : { category: 'VENUE' };

  const [venues, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      take,
      skip,
      orderBy: [{ subscriptionTier: 'desc' }, { createdAt: 'desc' }],
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.supplier.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);

  return (
    <div className="section-padding">
      <div className="container-main">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Wedding Venues
            {searchParams.location && (
              <span className="block text-xl font-normal text-gray-500 mt-2">
                in {searchParams.location}
              </span>
            )}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {formatNumber(total)} venues available
            {searchParams.location ? ` in ${searchParams.location}` : ' across the UK'}
          </p>
        </div>

        {venues.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <SupplierCard
                  key={venue.id}
                  id={venue.id}
                  businessName={venue.businessName}
                  category={venue.category}
                  location={venue.location}
                  description={venue.description}
                  pricing={venue.pricing}
                  imageUrl={venue.images[0]?.url}
                  rating={
                    venue.reviews.length > 0
                      ? venue.reviews.reduce((a, b) => a + b.rating, 0) / venue.reviews.length
                      : 0
                  }
                  reviewCount={venue.reviews.length}
                  verified={venue.verified}
                  subscriptionTier={venue.subscriptionTier}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {page > 1 && (
                  <a href={`/venues?page=${page - 1}${searchParams.location ? `&location=${searchParams.location}` : ''}`} className="btn-secondary text-sm px-4 py-2">
                    Previous
                  </a>
                )}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <a
                      key={p}
                      href={`/venues?page=${p}${searchParams.location ? `&location=${searchParams.location}` : ''}`}
                      className={`px-4 py-2 text-sm rounded-lg ${
                        p === page
                          ? 'bg-primary-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {p}
                    </a>
                  );
                })}
                {page < totalPages && (
                  <a href={`/venues?page=${page + 1}${searchParams.location ? `&location=${searchParams.location}` : ''}`} className="btn-secondary text-sm px-4 py-2">
                    Next
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No venues found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-GB').format(num);
}
