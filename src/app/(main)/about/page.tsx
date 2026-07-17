import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About VowVista',
  description: 'Learn about VowVista, the UKs premier wedding planning platform connecting couples with venues and suppliers.',
};

export default function AboutPage() {
  return (
    <div>
      <section className="section-padding bg-gradient-to-b from-primary-50 to-white">
        <div className="container-main max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 text-center">
            About VowVista
          </h1>
          <p className="mt-6 text-lg text-gray-600 text-center text-balance">
            We believe every couple deserves a perfect wedding. VowVista makes finding and booking
            the best venues and suppliers across the UK simple, transparent, and stress-free.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main max-w-3xl">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">
              VowVista was born from a simple frustration: planning a wedding in the UK should not
              require visiting dozens of websites, making countless phone calls, and hoping for the best.
            </p>
            <p className="mb-4">
              Our founders, both having recently navigated the wedding planning maze themselves, set out
              to create a platform that brings everything couples need into one beautiful, intuitive space.
            </p>
            <p>
              Today, VowVista connects over 10,000 verified wedding suppliers with couples across every
              region of the UK, from coastal cottages in Cornwall to grand ballrooms in Edinburgh.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-main max-w-4xl">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="text-3xl mb-4">💍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-sm text-gray-600">
                Every supplier is verified. Every review is from a real couple. We keep things honest.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="font-semibold text-gray-900 mb-2">Connection</h3>
              <p className="text-sm text-gray-600">
                We bridge the gap between talented professionals and couples planning their special day.
              </p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-sm text-gray-600">
                We curate the best suppliers and continuously improve our platform for an exceptional experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main max-w-3xl text-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold text-primary-500">10,000+</p>
              <p className="text-sm text-gray-500 mt-1">Suppliers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-500">50,000+</p>
              <p className="text-sm text-gray-500 mt-1">Couples Helped</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-500">4.8</p>
              <p className="text-sm text-gray-500 mt-1">Average Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-500">150+</p>
              <p className="text-sm text-gray-500 mt-1">UK Locations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
