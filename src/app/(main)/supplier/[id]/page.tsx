import { notFound } from 'next/navigation';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { getCategoryDisplayName, formatDate } from '@/lib/helpers';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supplier = await prisma.supplier.findUnique({ where: { id: params.id } });

  if (!supplier) return { title: 'Supplier Not Found' };

  return {
    title: `${supplier.businessName} - ${getCategoryDisplayName(supplier.category)} in ${supplier.location}`,
    description: supplier.description.slice(0, 160),
  };
}

export default async function SupplierDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supplier = await prisma.supplier.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      reviews: {
        include: {
          user: { select: { name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { reviews: true, images: true },
      },
    },
  });

  if (!supplier) notFound();

  const avgRating =
    supplier.reviews.length > 0
      ? supplier.reviews.reduce((a, b) => a + b.rating, 0) / supplier.reviews.length
      : 0;

  const primaryImage = supplier.images.find((img) => img.isPrimary) || supplier.images[0];

  return (
    <div>
      <section className="relative h-[400px] sm:h-[500px] bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={supplier.businessName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {getCategoryDisplayName(supplier.category)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="container-main">
            <div className="flex items-center gap-2 mb-2">
              {supplier.verified && (
                <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                  Verified
                </span>
              )}
              <span className="px-2 py-1 bg-white/90 text-sm rounded-full">
                {getCategoryDisplayName(supplier.category)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              {supplier.businessName}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-white/80">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {supplier.location}
              </span>
              {avgRating > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gold-500 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {avgRating.toFixed(1)} ({supplier._count.reviews} reviews)
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="section-padding">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">{supplier.description}</p>
              </div>

              {supplier.images.length > 1 && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {supplier.images.slice(0, 6).map((image) => (
                      <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={image.url}
                          alt={image.caption || supplier.businessName}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
                {supplier.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {supplier.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{review.user.name}</span>
                          <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-gold-500' : 'text-gray-200'} fill-current`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6 sticky top-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                <div className="space-y-3">
                  {supplier.website && (
                    <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Visit Website
                    </a>
                  )}
                  {supplier.phone && (
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.22l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.22-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {supplier.phone}
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {supplier.email}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-2">Coverage Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {supplier.coverage.map((area) => (
                      <span key={area} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="btn-primary w-full mt-6">
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
