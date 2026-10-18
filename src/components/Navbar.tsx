'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Plus, LogOut, Phone, Menu, X, ArrowUpRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  isAdmin: boolean;
  adminEmail: string | null;
  onOpenAdminLogin: () => void;
  onOpenUpload: () => void;
  onLogout: () => void;
}

export default function Navbar({
  isAdmin,
  adminEmail,
  onOpenAdminLogin,
  onOpenUpload,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 w-full max-w-7xl mx-auto">
      <nav className="bg-[#f6f3f0]/85 dark:bg-[#0d0d0d]/85 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-full px-4 sm:px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-brand-red group-hover:scale-125 transition-transform duration-300 shadow-[0_0_12px_rgba(229,38,45,0.7)]" />
            <span className="absolute w-5 h-5 rounded-full bg-brand-red/30 animate-ping" />
          </div>
          <span className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
            RedDot <span className="font-semibold text-neutral-900 dark:text-white">Interio</span>
          </span>
          <span className="hidden md:inline-block text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400">
            Hyderabad
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <a href="#projects" className="hover:text-brand-red dark:hover:text-brand-red transition-colors">
            Projects
          </a>
          <a href="#services" className="hover:text-brand-red dark:hover:text-brand-red transition-colors">
            Services
          </a>
          <a href="#why-us" className="hover:text-brand-red dark:hover:text-brand-red transition-colors">
            Why Us
          </a>
          <a href="#testimonials" className="hover:text-brand-red dark:hover:text-brand-red transition-colors">
            Testimonials
          </a>
          <a href="#contact" className="hover:text-brand-red dark:hover:text-brand-red transition-colors">
            Contact
          </a>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* If Logged In as Admin */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenUpload}
                id="admin-upload-work-button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-brand-red text-white hover:bg-brand-redHover shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Upload work</span>
              </button>

              <button
                onClick={onLogout}
                title={`Logged in as ${adminEmail || 'Admin'}. Click to logout.`}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 hover:bg-red-500/10 hover:text-brand-red dark:hover:text-brand-red transition-all text-neutral-700 dark:text-neutral-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            /* Admin Login Button */
            <button
              onClick={onOpenAdminLogin}
              id="admin-login-button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-neutral-800 dark:text-neutral-200 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span>Admin login</span>
            </button>
          )}

          {/* Quick Enquire / Phone CTA */}
          <a
            href="tel:+919348923689"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-[#0d0d0d] text-white dark:bg-white dark:text-[#0d0d0d] hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">+91 93489 23689</span>
            <span className="xl:hidden">Call</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-[#f6f3f0]/95 dark:bg-[#0d0d0d]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col gap-3 animate-fade-in text-neutral-800 dark:text-neutral-200">
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-base font-medium hover:text-brand-red flex items-center justify-between"
          >
            Projects <ArrowUpRight className="w-4 h-4 opacity-50" />
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-base font-medium hover:text-brand-red flex items-center justify-between"
          >
            Services <ArrowUpRight className="w-4 h-4 opacity-50" />
          </a>
          <a
            href="#why-us"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-base font-medium hover:text-brand-red flex items-center justify-between"
          >
            Why Us <ArrowUpRight className="w-4 h-4 opacity-50" />
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-base font-medium hover:text-brand-red flex items-center justify-between"
          >
            Testimonials <ArrowUpRight className="w-4 h-4 opacity-50" />
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-base font-medium hover:text-brand-red flex items-center justify-between"
          >
            Contact <ArrowUpRight className="w-4 h-4 opacity-50" />
          </a>

          <div className="pt-3 border-t border-black/10 dark:border-white/10 flex flex-col gap-2">
            <a
              href="https://wa.me/919348923689?text=Hi%20RedDot%20Interio%2C%20I%20want%20to%20discuss%20an%20interior%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-full font-medium text-sm bg-brand-red text-white hover:bg-brand-redHover"
            >
              WhatsApp Consultation
            </a>
            {isAdmin && (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 rounded-full font-medium text-xs text-brand-red bg-brand-red/10"
              >
                Logout ({adminEmail})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
