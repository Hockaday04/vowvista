'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function SupplierCTA() {
  return (
    <section className="section-padding bg-gray-900">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Are You a Wedding Supplier?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Join thousands of wedding professionals reaching engaged couples across the UK.
            List your business on VowVista and grow your client base.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?role=SUPPLIER"
              className="btn-gold text-base px-8 py-4"
            >
              List Your Business Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors"
            >
              View Pricing Plans
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <p className="text-3xl font-bold text-gold-500">10K+</p>
              <p className="text-sm text-gray-400 mt-1">Suppliers Listed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold-500">50K+</p>
              <p className="text-sm text-gray-400 mt-1">Monthly Visitors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold-500">95%</p>
              <p className="text-sm text-gray-400 mt-1">Satisfaction Rate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
