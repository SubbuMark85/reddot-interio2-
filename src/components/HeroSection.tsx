'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Sparkles, MapPin, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

// Dynamic import with ssr: false for 3D Three.js canvas
const HeroCanvas = dynamic(() => import('./HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none" />
  ),
});

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 pb-20 px-4 sm:px-6">
      {/* 3D Interactive Canvas with floating glossy spheres reacting to mouse */}
      <HeroCanvas />

      {/* Subtle radial backdrop ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/5 dark:bg-brand-red/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-neutral-400/10 dark:bg-neutral-800/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Layer (ElevenLabs Minimal Typography) */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur-md text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 mb-8 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-brand-red" />
          <span className="font-medium">Hyderabad</span>
          <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600" />
          <span className="text-neutral-600 dark:text-neutral-400">Jubilee Hills • Financial District • Kokapet</span>
        </div>

        {/* Huge Light-weight Inter Headline (ElevenLabs style) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.04em] leading-[1.06] text-neutral-900 dark:text-neutral-100 mb-6">
          Architecture in silence. <br className="hidden sm:inline" />
          <span className="font-normal text-neutral-900 dark:text-white">Living in </span>
          <span className="relative inline-block font-normal text-brand-red">
            precision.
            <svg
              className="absolute -bottom-2 left-0 w-full h-2 text-brand-red/60"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,8 Q50,0 100,8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Subtitle with refined contrast */}
        <p className="max-w-2xl text-base sm:text-xl font-light text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10">
          RedDot Interio crafts signature residential villas and commercial environments. 
          Uncompromising materiality, German precision fittings, and bespoke Italian aesthetics built to endure.
        </p>

        {/* Pill Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm sm:text-base font-medium bg-[#0d0d0d] text-white dark:bg-white dark:text-[#0d0d0d] hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 group"
          >
            <span>Explore Curated Works</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="https://wa.me/919348923689?text=Hi%20RedDot%20Interio%2C%20I%20would%20like%20to%20schedule%20a%20turnkey%20design%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm sm:text-base font-medium bg-brand-red text-white hover:bg-brand-redHover transition-all duration-300 shadow-md hover:shadow-brand-red/30 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book Design Consultation</span>
          </a>
        </div>

        {/* Hyderabad Trust Indicators (Pill badging) */}
        <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-left w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 text-brand-red shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-light text-neutral-900 dark:text-neutral-100">140+</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Hyderabad Homes Handed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 text-brand-red shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-light text-neutral-900 dark:text-neutral-100">45 Days</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Guaranteed Handover</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 text-brand-red shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-light text-neutral-900 dark:text-neutral-100">10 Years</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Material Warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 text-brand-red shrink-0">
              <span className="font-bold text-sm text-brand-red">4.9★</span>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-light text-neutral-900 dark:text-neutral-100">4.9 / 5.0</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Verified Client Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
