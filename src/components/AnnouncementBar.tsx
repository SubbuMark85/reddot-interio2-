'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-50 bg-[#0d0d0d] text-white/90 text-xs sm:text-sm py-2.5 px-4 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-red text-white uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Hyderabad
          </span>
          <span className="text-white/80 font-normal">
            Turnkey luxury interior bookings now open for 2025 &amp; 2026.
          </span>
          <a
            href="https://wa.me/919348923689?text=Hi%20RedDot%20Interio%2C%20I%20would%20like%20to%20book%20a%20free%20design%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-white underline decoration-brand-red decoration-2 underline-offset-4 hover:text-brand-red transition-colors"
          >
            Claim Free 3D Design Session
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-white/50 hover:text-white transition-colors p-1"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
