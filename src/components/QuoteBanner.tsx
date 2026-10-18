'use client';

import React, { useState } from 'react';
import { ArrowRight, Phone, MessageCircle, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export default function QuoteBanner() {
  const [bhk, setBhk] = useState('3BHK Luxury Apartment');
  const [area, setArea] = useState('2,400 sq.ft');

  const handleWhatsappQuote = () => {
    const text = encodeURIComponent(
      `Hi RedDot Interio, I would like to get a customized interior quote for my ${bhk} (approx. ${area}) in Hyderabad. Please share your brochure and consultation slots.`
    );
    window.open(`https://wa.me/919348923689?text=${text}`, '_blank');
  };

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="relative rounded-3xl sm:rounded-5xl overflow-hidden bg-[#0d0d0d] text-white p-8 sm:p-14 lg:p-16 border border-white/10 shadow-2xl">
        {/* Ambient Glossy Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-neutral-800/40 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 text-brand-red border border-brand-red/30 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Complimentary 3D Design Session
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight mb-6">
              Ready to sculpt your <br className="hidden sm:inline" />
              <span className="font-normal text-white">Hyderabad dream space?</span>
            </h2>

            <p className="text-base sm:text-lg font-light text-neutral-300 max-w-xl mb-8 leading-relaxed">
              Meet our senior interior architects at our Hyderabad studio or at your site. We will build a free tailored 3D spatial layout and milestone estimate.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleWhatsappQuote}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm sm:text-base font-medium bg-brand-red text-white hover:bg-brand-redHover transition-all shadow-lg hover:shadow-brand-red/30 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Instant WhatsApp Estimate</span>
              </button>

              <a
                href="tel:+919348923689"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-medium bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/10"
              >
                <Phone className="w-4 h-4" />
                <span>+91 93489 23689</span>
              </a>
            </div>
          </div>

          {/* Quick Configurator Box */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl">
            <h3 className="text-lg font-medium text-white mb-2">Instant Estimate Planner</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Select your floorplan to pre-fill your consultation request:
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Property Type
                </label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-red"
                >
                  <option value="2BHK Modern Apartment">2BHK Modern Apartment</option>
                  <option value="3BHK Luxury Apartment">3BHK Luxury Apartment</option>
                  <option value="4BHK Duplex Penthouse">4BHK Duplex Penthouse</option>
                  <option value="Independent Luxury Villa">Independent Luxury Villa</option>
                  <option value="Commercial Office / Studio">Commercial Office / Studio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Approx. Carpet Area
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-red"
                >
                  <option value="1,200 - 1,800 sq.ft">1,200 - 1,800 sq.ft</option>
                  <option value="1,800 - 2,600 sq.ft">1,800 - 2,600 sq.ft</option>
                  <option value="2,600 - 4,000 sq.ft">2,600 - 4,000 sq.ft</option>
                  <option value="4,000+ sq.ft (Villa / Penthouse)">4,000+ sq.ft (Villa / Penthouse)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleWhatsappQuote}
                  className="w-full py-3 rounded-xl bg-white text-neutral-900 font-medium text-xs sm:text-sm hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Request Custom Layout Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red" /> No obligations
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red" /> 100% Free 3D plan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
