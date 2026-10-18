'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Loader2, Video, Film, Trash2, Upload, AlertCircle, Play } from 'lucide-react';
import { Project, ProjectCategory, ProjectVideo } from '@/lib/types';
import {
  supabase,
  isSupabaseConfigured,
  fetchProjectVideos,
  uploadProjectVideoFile,
  deleteProjectVideoRecord,
} from '@/lib/supabase';

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
  const [showPrice, setShowPrice] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Video Management State
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [videoToast, setVideoToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setCategory(project.category);
      setLocation(project.location || '');
      setPrice(project.price || '');
      setOfferPrice(project.offer_price || '');
      setDescription(project.description || '');
      setMediaUrl(project.media_url);
      setShowPrice(project.show_price);
      setVideos(project.videos || []);

      // Load latest videos from DB/store
      fetchProjectVideos(project.id).then((vids) => {
        if (vids && vids.length > 0) {
          setVideos(vids);
        }
      });
    }
  }, [project]);

  if (!isOpen || !project) return null;

  // Handle Video File Upload
  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input value so same file can be selected again if needed
    e.target.value = '';

    // 1. Strict Video validation
    if (!file.type.startsWith('video/')) {
      setVideoToast({
        type: 'error',
        text: 'Only videos allowed here (MP4, WebM, QuickTime).',
      });
      return;
    }

    // 2. 50 MB Supabase free tier size validation
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setVideoToast({
        type: 'error',
        text: `File exceeds 50 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB). Supabase free tier limit is 50 MB per file.`,
      });
      return;
    }

    setUploadingVideo(true);
    setUploadProgress(15);
    setVideoToast(null);

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 300);

    try {
      const uploaded = await uploadProjectVideoFile(
        project.id,
        file,
        videoTitle.trim() || file.name.replace(/\.[^/.]+$/, '')
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      const updatedVideos = [...videos, uploaded];
      setVideos(updatedVideos);
      setVideoTitle('');

      // Update parent project state
      const updatedProject: Project = {
        ...project,
        videos: updatedVideos,
      };
      onProjectUpdated(updatedProject);

      setVideoToast({
        type: 'success',
        text: `"${uploaded.title}" uploaded to portfolio bucket successfully!`,
      });
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('Video upload error:', err);
      setVideoToast({
        type: 'error',
        text: err.message || 'Failed to upload video.',
      });
    } finally {
      setTimeout(() => {
        setUploadingVideo(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Handle Video Delete
  const handleDeleteVideo = async (videoId: string, videoUrl: string) => {
    if (!window.confirm('Delete this video from the project and portfolio storage?')) {
      return;
    }

    setDeletingVideoId(videoId);
    try {
      await deleteProjectVideoRecord(videoId, videoUrl, project.id);
      const updatedVideos = videos.filter((v) => v.id !== videoId);
      setVideos(updatedVideos);

      const updatedProject: Project = {
        ...project,
        videos: updatedVideos,
      };
      onProjectUpdated(updatedProject);

      setVideoToast({
        type: 'success',
        text: 'Video deleted from portfolio storage.',
      });
    } catch (err: any) {
      console.error('Delete video error:', err);
      setVideoToast({
        type: 'error',
        text: 'Failed to delete video.',
      });
    } finally {
      setDeletingVideoId(null);
    }
  };

  // Submit main project details
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
        show_price: showPrice,
        videos,
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
            show_price: updated.show_price,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-[#f6f3f0] dark:bg-[#141414] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-900 dark:text-white animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-6">
          <div>
            <h2 className="text-2xl font-light tracking-tight">
              Edit <span className="font-semibold text-brand-red">Project</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Modify pricing, details, and project walkthrough videos
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
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-brand-red flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cover Image Media URL (Images only) */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Cover Image URL <span className="text-[11px] text-neutral-400 font-normal">(Used for gallery card cover - images only)</span>
            </label>
            <input
              type="url"
              required
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>

          {/* Project Name & Category */}
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

          {/* Location & Prices */}
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

          {/* Show Price to Customers Switch */}
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

          {/* ======================================================== */}
          {/* PROJECT VIDEOS SECTION (Below "Show price to customers") */}
          {/* ======================================================== */}
          <div className="pt-4 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-brand-red" />
                <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
                  Project Videos
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 font-medium">
                  {videos.length} video{videos.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">
              Upload walkthroughs or cinematic videos for this project. Stored in Supabase Storage bucket <code>portfolio/videos/{project.id}/</code>. 
              <span className="text-brand-red font-medium ml-1">Supabase free-plan limit: 50 MB per file.</span>
            </p>

            {/* Video Toast / Feedback message */}
            {videoToast && (
              <div
                className={`mb-4 p-3 rounded-2xl text-xs flex items-center justify-between gap-2 animate-fade-in ${
                  videoToast.type === 'error'
                    ? 'bg-red-500/10 border border-red-500/20 text-brand-red'
                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                <span>{videoToast.text}</span>
                <button
                  type="button"
                  onClick={() => setVideoToast(null)}
                  className="p-1 hover:opacity-70"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Video Upload Controls */}
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/40 border border-black/10 dark:border-white/10 space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Video Title (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Bedroom 360° Walkthrough"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-black/60 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileSelect}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploadingVideo}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium bg-brand-red text-white hover:bg-brand-redHover transition-all shadow-sm disabled:opacity-50"
                >
                  {uploadingVideo ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading Video...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Upload Video File</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] text-neutral-400">
                  Accepts MP4, WebM, MOV (Max 50 MB)
                </span>
              </div>

              {/* Progress Bar */}
              {uploadingVideo && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span>Uploading to portfolio/videos/{project.id}/...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-brand-red transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* List of Existing Videos */}
            <div className="mt-4 space-y-2.5">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Current Videos ({videos.length})
              </label>

              {videos.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-black/10 dark:border-white/10 rounded-2xl p-4 text-xs text-neutral-500 dark:text-neutral-400">
                  No videos attached to this project yet. Use the upload button above to add walkthroughs.
                </div>
              ) : (
                <div className="space-y-2">
                  {videos.map((vid) => (
                    <div
                      key={vid.id}
                      className="p-3 rounded-2xl bg-white/40 dark:bg-black/30 border border-black/5 dark:border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Video thumbnail / small preview */}
                        <div className="w-20 h-14 rounded-xl overflow-hidden bg-black shrink-0 relative flex items-center justify-center">
                          <video
                            src={vid.video_url}
                            className="w-full h-full object-cover opacity-80"
                            muted
                            playsInline
                          />
                          <Play className="w-4 h-4 text-white absolute fill-current opacity-80 pointer-events-none" />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                            {vid.title || 'Untitled Video'}
                          </h4>
                          <span className="text-[10px] text-neutral-400 block truncate">
                            {vid.video_url}
                          </span>
                        </div>
                      </div>

                      {/* Delete icon */}
                      <button
                        type="button"
                        disabled={deletingVideoId === vid.id}
                        onClick={() => handleDeleteVideo(vid.id, vid.video_url)}
                        className="p-2 rounded-full hover:bg-red-500/10 text-neutral-400 hover:text-brand-red transition-colors shrink-0 disabled:opacity-50"
                        title="Delete video"
                      >
                        {deletingVideoId === vid.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-brand-red" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Save Button for general project fields */}
          <div className="pt-3 border-t border-black/5 dark:border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-full text-sm font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Project Details...</span>
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
