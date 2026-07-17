'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const regions = [
  { name: 'London', count: '3,200+', image: '🏙️' },
  { name: 'South East', count: '2,100+', image: '🌿' },
  { name: 'Manchester', count: '1,500+', image: '🏭' },
  { name: 'Scotland', count: '1,200+', image: '🏔️' },
  { name: 'Birmingham', count: '1,100+', image: '🏛️' },
  { name: 'Bristol', count: '900+', image: '⛵' },
  { name: 'Yorkshire', count: '1,000+', image: '🌾' },
  { name: 'Wales', count: '800+', image: '🏰' },
];

export function UKRegions() {
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
            Explore by Region
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find wedding suppliers across every corner of the UK
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {regions.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/venues?location=${encodeURIComponent(region.name)}`}
                className="card p-6 text-center group block hover:border-primary-200"
              >
                <div className="text-4xl mb-3">{region.image}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {region.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{region.count} suppliers</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
