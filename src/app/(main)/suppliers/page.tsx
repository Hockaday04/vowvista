import { SupplierCard } from '@/components/suppliers/SupplierCard';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Suppliers UK',
  description: 'Browse wedding photographers, caterers, florists, bands, and more across the UK.',
};

const categories = [
  'ALL', 'PHOTOGRAPHER', 'VIDEOGRAPHER', 'CATERER', 'FLORIST',
  'BAND', 'DJ', 'MAKEUP_ARTIST', 'HAIR_STYLIST', 'WEDDING_PLANNER',
  'STATIONERY', 'TRANSPORT', 'CAKE_DESIGNER',
];

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: { category?: string; location?: string; page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const take = 12;
  const skip = (page - 1) * take;

  const where: any = {};
  if (searchParams.category && searchParams.category !== 'ALL') {
    where.category = searchParams.category;
  }
  if (searchParams.location) {
    where.OR = [
      { location: { contains: searchParams.location, mode: 'insensitive' } },
      { coverage: { has: searchParams.location } },
    ];
  }

  const [suppliers, total] = await Promise.all([
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Wedding Suppliers
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {new Intl.NumberFormat('en-GB').format(total)} suppliers available
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/suppliers?category=${cat}${searchParams.location ? `&location=${searchParams.location}` : ''}`}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                (searchParams.category || 'ALL') === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat === 'ALL' ? 'All' : cat.replace('_', ' ').toLowerCase()}
            </a>
          ))}
        </div>

        {suppliers.length > 0 ? (
          <>
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

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {page > 1 && (
                  <a
                    href={`/suppliers?page=${page - 1}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Previous
                  </a>
                )}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`/suppliers?page=${p}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                    className={`px-4 py-2 text-sm rounded-lg ${
                      p === page ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {p}
                  </a>
                ))}
                {page < totalPages && (
                  <a
                    href={`/suppliers?page=${page + 1}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No suppliers found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
