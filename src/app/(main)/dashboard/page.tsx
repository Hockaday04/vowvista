import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/helpers';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login?callbackUrl=/dashboard');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      supplier: {
        include: {
          reviews: { include: { user: { select: { name: true } } } },
          _count: { select: { favourites: true, reviews: true } },
        },
      },
    },
  });

  if (!user) redirect('/auth/login');

  return (
    <div className="section-padding bg-gray-50">
      <div className="container-main">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">
          Welcome, {user.name}
        </h1>

        {user.role === 'SUPPLIER' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Total Views</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="card p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Enquiries</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="card p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Reviews</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{user.supplier?._count.reviews || 0}</p>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Reviews</h2>
              {user.supplier?.reviews.length ? (
                <div className="space-y-4">
                  {user.supplier.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{review.user.name}</span>
                        <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-gold-500' : 'text-gray-200'} fill-current`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Favourites</h2>
              <p className="text-gray-500">Browse suppliers to start building your shortlist.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
