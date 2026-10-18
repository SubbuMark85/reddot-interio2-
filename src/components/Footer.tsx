'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Clock, Shield, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
  isAdmin: boolean;
}

export default function Footer({ onOpenAdminLogin, isAdmin }: FooterProps) {
  return (
    <footer id="contact" className="bg-[#0d0d0d] text-white pt-20 pb-12 px-4 sm:px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <span className="w-4 h-4 rounded-full bg-brand-red shadow-[0_0_12px_rgba(229,38,45,0.8)]" />
              <span className="text-2xl font-light tracking-tight text-white">
                RedDot <span className="font-semibold text-white">Interio</span>
              </span>
            </Link>

            <p className="text-sm font-light text-neutral-400 max-w-sm mb-6 leading-relaxed">
              Hyderabad’s premier turnkey interior architecture studio. Creating enduring spaces through clean geometries, German fittings, and bespoke Italian aesthetics.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/919348923689?text=Hi%20RedDot%20Interio%2C%20I%20want%20to%20discuss%20an%20interior%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="tel:+919348923689"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Studio</span>
              </a>
            </div>
          </div>

          {/* Contact Details Col */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-4">
              Hyderabad Design Studio
            </h4>

            <div className="flex items-start gap-3 text-sm text-neutral-300">
              <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-1" />
              <span>
                Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <Phone className="w-4 h-4 text-brand-red shrink-0" />
              <a href="tel:+919348923689" className="hover:text-white transition-colors">
                +91 93489 23689
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <Mail className="w-4 h-4 text-brand-red shrink-0" />
              <a href="mailto:bhaskarjv3689@gmail.com" className="hover:text-white transition-colors">
                bhaskarjv3689@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <Clock className="w-4 h-4 text-brand-red shrink-0" />
              <span>Mon – Sat: 9:30 AM – 7:30 PM (Sun by appointment)</span>
            </div>
          </div>

          {/* Service Areas Col */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-4">
              Service Enclaves
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'Jubilee Hills',
                'Banjara Hills',
                'Financial District',
                'Gachibowli',
                'Hitec City',
                'Kokapet',
                'Kondapur',
                'Madhapur',
                'Gandipet',
                'Manikonda',
              ].map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-neutral-300"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} RedDot Interio. All rights reserved. Hyderabad, Telangana.
          </p>

          <div className="flex items-center gap-6">
            {!isAdmin ? (
              <button
                onClick={onOpenAdminLogin}
                className="hover:text-neutral-300 transition-colors flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            ) : (
              <span className="text-brand-red font-medium">Admin Connected</span>
            )}

            <a href="#projects" className="hover:text-neutral-300 transition-colors">
              Portfolio
            </a>
            <a href="#services" className="hover:text-neutral-300 transition-colors">
              Services
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
