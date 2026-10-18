'use client';

import React, { useState } from 'react';
import { X, Shield, Lock, Mail, Loader2, Info } from 'lucide-react';
import { supabase, isSupabaseConfigured, saveStoredAdminSession } from '@/lib/supabase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: AdminLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSupabaseConfigured && supabase) {
        // Authenticate with real Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user?.email) {
          saveStoredAdminSession(data.user.email);
          onLoginSuccess(data.user.email);
          onClose();
          return;
        }
      }

      // Local / Offline fallback for immediate preview and testing
      if (email.trim() && password.length >= 4) {
        saveStoredAdminSession(email.trim());
        onLoginSuccess(email.trim());
        onClose();
      } else {
        setErrorMsg('Please enter a valid email and password (minimum 4 characters).');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Invalid credentials. Please verify your Supabase admin user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#f6f3f0] dark:bg-[#141414] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-900 dark:text-white animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-light tracking-tight">
                Admin <span className="font-semibold text-brand-red">Portal</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                RedDot Interio Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info notice about no customer accounts */}
        <div className="mb-5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <Info className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
          <span>
            {isSupabaseConfigured
              ? 'Secured with Supabase Auth & Row Level Security.'
              : 'Supabase demo mode active. Enter admin email & password to test the manager dashboard.'}
          </span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-brand-red">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                placeholder="bhaskarjv3689@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-sm font-medium bg-[#0d0d0d] text-white dark:bg-white dark:text-[#0d0d0d] hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Log In as Administrator</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
