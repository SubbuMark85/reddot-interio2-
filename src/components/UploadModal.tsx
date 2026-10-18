'use client';

import React, { useState } from 'react';
import { X, Upload, Check, Loader2 } from 'lucide-react';
import { Project, ProjectCategory } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const CATEGORIES: Exclude<ProjectCategory, 'All'>[] = [
  'Living Room',
  'Modular Kitchen',
  'Master Bedroom',
  'Luxury Villa',
  'Commercial',
];

export default function UploadModal({ isOpen, onClose, onProjectCreated }: UploadModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Living Room');
  const [location, setLocation] = useState('Jubilee Hills, Hyderabad');
  const [price, setPrice] = useState('₹15,00,000');
  const [offerPrice, setOfferPrice] = useState('₹12,80,000');
  const [description, setDescription] = useState('');
  const [showPrice, setShowPrice] = useState(true);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const isVid = file.type.startsWith('video/');
    setMediaType(isVid ? 'video' : 'image');

    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter a project name.');
      return;
    }

    if (!filePreview && !mediaUrl.trim()) {
      setErrorMsg('Please select a photo/video or provide a media URL.');
      return;
    }

    setUploading(true);

    try {
      let finalMediaUrl = mediaUrl.trim();

      // If Supabase is configured and a file was chosen, upload to Supabase Storage bucket 'projects'
      if (isSupabaseConfigured && supabase && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('projects')
          .getPublicUrl(filePath);

        finalMediaUrl = publicUrlData.publicUrl;
      } else if (!finalMediaUrl && filePreview) {
        finalMediaUrl = filePreview;
      }

      const newProject: Project = {
        id: `rd-${Date.now()}`,
        name: name.trim(),
        category,
        media_url: finalMediaUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        media_type: mediaType,
        price: price.trim(),
        offer_price: offerPrice.trim(),
        show_price: showPrice,
        location: location.trim(),
        description: description.trim(),
        created_at: new Date().toISOString(),
      };

      // If Supabase is configured, insert into projects table
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            name: newProject.name,
            category: newProject.category,
            media_url: newProject.media_url,
            media_type: newProject.media_type,
            price: newProject.price,
            offer_price: newProject.offer_price,
            show_price: newProject.show_price,
            location: newProject.location,
            description: newProject.description,
          })
          .select()
          .single();

        if (error) {
          console.warn('Supabase DB error, using client fallback:', error.message);
        } else if (data) {
          newProject.id = data.id;
        }
      }

      onProjectCreated(newProject);
      onClose();
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Failed to save project. Please check credentials.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-[#f6f3f0] dark:bg-[#141414] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-900 dark:text-white animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-6">
          <div>
            <h2 className="text-2xl font-light tracking-tight">
              Upload <span className="font-semibold text-brand-red">Work</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Publish new photo or video project to RedDot Interio gallery
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Picker or Media URL */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Project Media (Photo or Video)
            </label>
            <div className="border-2 border-dashed border-black/10 dark:border-white/10 hover:border-brand-red/50 dark:hover:border-brand-red/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-white/40 dark:bg-black/20 relative">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {filePreview ? (
                <div className="flex flex-col items-center gap-2">
                  {mediaType === 'video' ? (
                    <video src={filePreview} className="max-h-36 rounded-xl object-cover" controls />
                  ) : (
                    <img src={filePreview} alt="Preview" className="max-h-36 rounded-xl object-cover" />
                  )}
                  <span className="text-xs text-brand-red font-medium">Click to replace file</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-3">
                  <div className="w-10 h-10 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Drag &amp; drop or click to upload
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Supports JPG, PNG, WEBP, MP4, MOV
                  </span>
                </div>
              )}
            </div>

            <div className="mt-2 text-center">
              <span className="text-[11px] text-neutral-400">or enter a direct image/video URL below</span>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="mt-1 w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>
          </div>

          {/* Project Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kokapet Sky Villa"
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

          {/* Location & Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Jubilee Hills, Hyderabad"
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
                placeholder="₹15,00,000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Near / Offer Price *
              </label>
              <input
                type="text"
                required
                placeholder="₹12,80,000"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description / Materials Used
            </label>
            <textarea
              rows={2}
              placeholder="Italian fluted marble, German hardware, ambient cove lighting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>

          {/* Show price switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 dark:bg-black/30 border border-black/10 dark:border-white/10">
            <div>
              <span className="text-xs sm:text-sm font-medium block">
                Show price to customers
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                When turned off, customers will see a &ldquo;Contact for price&rdquo; WhatsApp button instead of the price.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPrice(!showPrice)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                showPrice ? 'bg-brand-red' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  showPrice ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Submit Pill Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-full text-sm font-medium bg-brand-red text-white hover:bg-brand-redHover transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to Supabase...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Publish Work to Gallery</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
