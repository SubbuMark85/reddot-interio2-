'use client';

import React from 'react';
import { ShieldCheck, Clock, Award, Hammer, Sparkles, CheckCircle } from 'lucide-react';

const REASONS = [
  {
    icon: Clock,
    title: 'Strict 45-Day Handover SLA',
    description: 'We value your time. If we delay handover past the agreed schedule, we pay you a per-day penalty. Zero empty promises.',
  },
  {
    icon: Award,
    title: 'German Precision Engineering',
    description: 'Fitted exclusively with Blum and Hettich architectural hardware. Soft-closing, anti-slam mechanisms tested for 200,000 cycles.',
  },
  {
    icon: Hammer,
    title: 'In-House CNC Manufacturing',
    description: 'Zero subcontractor markups. All joinery, modular carcases, and acrylic shutters are machined in our automated facility.',
  },
  {
    icon: ShieldCheck,
    title: '10-Year Written Warranty',
    description: 'BWP grade marine ply and termite-proof HDHMR cores backed by a registered 10-year structural warranty certificate.',
  },
  {
    icon: Sparkles,
    title: '3D Photoreal Visual Guarantee',
    description: 'What you approve in our 3D hyper-real render is what gets constructed down to the exact millimeter and paint shade.',
  },
  {
    icon: CheckCircle,
    title: 'Hyderabad Society Approvals',
    description: 'Seamless coordination with gated community associations across Jubilee Hills, Kokapet, Financial District, and Kondapur.',
  },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold uppercase tracking-wider mb-3">
          Why RedDot Interio
        </div>
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
          Architectural rigor meets <br />
          <span className="font-normal text-neutral-900 dark:text-white">unwavering craftsmanship.</span>
        </h2>
        <p className="text-base sm:text-lg font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
          We combine cutting-edge industrial manufacturing with artisan hand-finishing to deliver residences of timeless pedigree across Hyderabad.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REASONS.map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={i}
              className="bg-[#f6f3f0]/40 dark:bg-[#141414]/60 border border-black/5 dark:border-white/5 rounded-3xl p-8 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-6">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-3">
                {r.title}
              </h3>
              <p className="text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {r.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
