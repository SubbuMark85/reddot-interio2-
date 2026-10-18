'use client';

import React from 'react';
import { Home, Compass, Layout, Building2, Eye, ShieldCheck, ArrowUpRight } from 'lucide-react';

const SERVICES = [
  {
    num: '01',
    title: 'Luxury Villa & Apartment Interiors',
    desc: 'End-to-end turnkey transformations. From bespoke false ceilings and Italian marble floorings to integrated acoustic lighting.',
    icon: Home,
    tag: 'Turnkey Luxury',
  },
  {
    num: '02',
    title: 'Precision Modular Kitchens',
    desc: 'German Blum hardware, anti-fingerprint matte laminates, quartz waterfall countertops, and space-maximized larder units.',
    icon: Layout,
    tag: 'German Hardware',
  },
  {
    num: '03',
    title: 'Master Suites & Fluted Wardrobes',
    desc: 'Acoustic headboard walls, soft twilight sensor lighting, and floor-to-ceiling tinted glass sliding wardrobes with velvet drawers.',
    icon: Compass,
    tag: 'Custom Joinery',
  },
  {
    num: '04',
    title: 'Commercial & High-Tech Workspaces',
    desc: 'Executive suites, ergonomic collaborative hubs, and conference pods built for Hyderabad’s tech leaders in Hitec City & Kokapet.',
    icon: Building2,
    tag: 'Corporate & Retail',
  },
  {
    num: '05',
    title: '3D Photorealistic Architectural Previews',
    desc: 'Hyper-detailed 3D walkthroughs, lighting simulations, and tactile mood boards before a single brick is touched.',
    icon: Eye,
    tag: 'Virtual Preview',
  },
  {
    num: '06',
    title: '45-Day Handover & 10-Yr Warranty',
    desc: 'Strict project milestone tracking with weekly digital photo logs and a certified 10-year warranty on core woodwork.',
    icon: ShieldCheck,
    tag: 'Zero Overruns',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold uppercase tracking-wider mb-3">
            Our Expertise
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
            Tailored architectural solutions <br className="hidden sm:inline" />
            <span className="font-normal text-neutral-900 dark:text-white">engineered with precision.</span>
          </h2>
        </div>
        <p className="max-w-md text-sm sm:text-base font-light text-neutral-600 dark:text-neutral-400">
          Every project reflects our obsession with clean geometries, durable raw materials, and seamless spatial ergonomics.
        </p>
      </div>

      {/* Grid of Rounded Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((s, idx) => {
          const IconComponent = s.icon;
          return (
            <div
              key={idx}
              className="group relative bg-[#f6f3f0]/50 dark:bg-[#141414]/70 border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-mono font-medium text-neutral-400 dark:text-neutral-500">
                    {s.num}
                  </span>
                  <span className="text-[11px] font-medium tracking-wide px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
                    {s.tag}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-neutral-800 dark:text-neutral-200 group-hover:text-brand-red group-hover:bg-brand-red/10 transition-colors mb-6">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-3">
                  {s.title}
                </h3>
                <p className="text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-8 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <a
                  href={`https://wa.me/919348923689?text=Hi%20RedDot%20Interio%2C%20I%20am%20interested%20in%20${encodeURIComponent(s.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-brand-red flex items-center gap-1 transition-colors"
                >
                  Consult Specialist
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
