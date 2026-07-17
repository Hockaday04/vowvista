'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCategoryIcon } from '@/lib/helpers';

const categories = [
  { id: 'VENUE', name: 'Venues', count: '2,500+' },
  { id: 'PHOTOGRAPHER', name: 'Photographers', count: '3,200+' },
  { id: 'CATERER', name: 'Caterers', count: '1,800+' },
  { id: 'FLORIST', name: 'Florists', count: '1,500+' },
  { id: 'BAND', name: 'Bands & DJs', count: '2,100+' },
  { id: 'MAKEUP_ARTIST', name: 'Makeup Artists', count: '1,200+' },
  { id: 'HAIR_STYLIST', name: 'Hair Stylists', count: '900+' },
  { id: 'WEDDING_PLANNER', name: 'Planners', count: '800+' },
  { id: 'CAKE_DESIGNER', name: 'Cake Designers', count: '600+' },
  { id: 'STATIONERY', name: 'Stationery', count: '500+' },
  { id: 'TRANSPORT', name: 'Transport', count: '400+' },
  { id: 'VIDEOGRAPHER', name: 'Videographers', count: '1,100+' },
];

export function CategoryGrid() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Browse by Category
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you need for your perfect day
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/suppliers?category=${category.id}`}
                className="card p-6 text-center group block"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(category.id)}
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{category.count} listings</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
