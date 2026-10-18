'use client';

import React from 'react';
import { Star, Quote, MapPin } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Dr. Vikram Reddy & Ananya',
    role: 'Homeowners',
    community: 'Jubilee Hills, Hyderabad',
    project: '4BHK Signature Villa Interior',
    comment:
      'RedDot Interio transformed our duplex with extraordinary poise. The fluted marble cladding and Italian lighting give our living room the exact mood of a Milan boutique hotel. Handed over on day 43 with zero defects.',
    rating: 5,
  },
  {
    name: 'Rajesh K. Varma',
    role: 'VP of Engineering',
    community: 'My Home Bhooja, Financial District',
    project: 'Luxury Penthouse (3,800 sq.ft)',
    comment:
      'Their minimalist approach is unmatched in Hyderabad. The modular kitchen with motorized Blum servo-drive drawers and concealed pantry is a chef’s dream. Transparent pricing with no surprises.',
    rating: 5,
  },
  {
    name: 'Sameera & Arvind Rao',
    role: 'Architect & Tech Entrepreneurs',
    community: 'Kokapet Sky Villas',
    project: 'Turnkey Luxury Villa',
    comment:
      'As an architect myself, my tolerance for shoddy finishing is zero. Bhaskar and the RedDot team surpassed my expectations. The acoustic suede panelling in our master suite is flawless.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold uppercase tracking-wider mb-3">
          Client Endorsements
        </div>
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
          Trusted by Hyderabad’s <br />
          <span className="font-normal text-neutral-900 dark:text-white">most discerning residents.</span>
        </h2>
        <p className="text-sm sm:text-base font-light text-neutral-600 dark:text-neutral-400">
          Hear directly from homeowners across Jubilee Hills, Financial District, and Kokapet.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="relative bg-[#f6f3f0]/50 dark:bg-[#141414]/70 border border-black/5 dark:border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div>
              {/* Stars & Quote Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-red text-brand-red" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-neutral-300 dark:text-neutral-700" />
              </div>

              <p className="text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 italic">
                “{t.comment}”
              </p>
            </div>

            <div className="pt-6 border-t border-black/5 dark:border-white/5">
              <h4 className="text-base font-medium text-neutral-900 dark:text-white">
                {t.name}
              </h4>
              <p className="text-xs text-brand-red font-medium mt-0.5">{t.project}</p>
              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>{t.community}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
