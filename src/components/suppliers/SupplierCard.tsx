'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useFavouriteStore } from '@/lib/stores/useFavouriteStore';
import { getCategoryIcon, getCategoryDisplayName, formatPriceRange } from '@/lib/helpers';

interface SupplierCardProps {
  id: string;
  businessName: string;
  category: string;
  location: string;
  description: string;
  pricing: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  subscriptionTier?: string;
}

export function SupplierCard({
  id,
  businessName,
  category,
  location,
  description,
  pricing,
  imageUrl,
  rating,
  reviewCount = 0,
  verified = false,
  subscriptionTier,
}: SupplierCardProps) {
  const { isFavourited, addFavourite, removeFavourite } = useFavouriteStore();
  const favourited = isFavourited(id);

  const handleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favourited) {
      removeFavourite(id);
    } else {
      addFavourite({
        id,
        businessName,
        category,
        location,
        imageUrl,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card group"
    >
      <Link href={`/supplier/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={businessName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {getCategoryIcon(category)}
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {verified && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                Verified
              </span>
            )}
            {subscriptionTier === 'FEATURED' && (
              <span className="px-2 py-1 bg-gold-500 text-white text-xs font-medium rounded-full">
                Featured
              </span>
            )}
          </div>
          <button
            onClick={handleFavourite}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            aria-label={favourited ? 'Remove from favourites' : 'Add to favourites'}
          >
            <svg
              className={`w-5 h-5 ${favourited ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill={favourited ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-white/90 text-xs font-medium rounded-full text-gray-700">
              {getCategoryDisplayName(category)}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/supplier/${id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {businessName}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-gray-500">{location}</span>
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {rating && (
              <>
                <svg className="w-4 h-4 text-gold-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({reviewCount})</span>
              </>
            )}
          </div>
          <span className="text-sm font-medium text-primary-600">
            {formatPriceRange(pricing)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
