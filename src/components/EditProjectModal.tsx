'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { Project, ProjectCategory } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface EditProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated: (updatedProject: Project) => void;
}

const CATEGORIES: Exclude<ProjectCategory, 'All'>[] = [
  'Living Room',
  'Modular Kitchen',
  'Master Bedroom',
  'Luxury Villa',
  'Commercial',
];

export default function EditProjectModal({
  project,
  isOpen,
  onClose,
  onProjectUpdated,
}: EditProjectModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Living Room');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setCategory(project.category);
      setLocation(project.location || '');
      setPrice(project.price || '');
      setOfferPrice(project.offer_price || '');
      setDescription(project.description || '');
      setMediaUrl(project.media_url);
      setEnabled(project.enabled);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const updated: Project = {
        ...project,
        name: name.trim(),
        category,
        location: location.trim(),
        price: price.trim(),
        offer_price: offerPrice.trim(),
        description: description.trim(),
        media_url: mediaUrl.trim(),
        enabled,
      };

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('projects')
          .update({
            name: updated.name,
            category: updated.category,
            location: updated.location,
            price: updated.price,
            offer_price: updated.offer_price,
            description: updated.description,
            media_url: updated.media_url,
            enabled: updated.enabled,
          })
          .eq('id', project.id);

        if (error) {
          console.warn('Supabase DB error on update:', error.message);
        }
      }

      onProjectUpdated(updated);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-[#f6f3f0] dark:bg-[#141414] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-900 dark:text-white animate-fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-6">
          <div>
            <h2 className="text-2xl font-light tracking-tight">
              Edit <span className="font-semibold text-brand-red">Project</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Modify pricing, customer visibility, or media
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-brand-red">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Media URL
            </label>
            <input
              type="url"
              required
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#1f1f1f] border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Standard Price
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Near / Offer Price
              </label>
              <input
                type="text"
                required
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/60 dark:bg-black/30 border border-black/10 dark:border-white/10">
            <div>
              <span className="text-xs sm:text-sm font-medium block">
                Enable for Customers
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Visible to Hyderabad clients on the public website
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                enabled ? 'bg-brand-red' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-full text-sm font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Project Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
